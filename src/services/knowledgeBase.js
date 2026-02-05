import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { OpenAIApi, Configuration } from 'openai';

const prisma = new PrismaClient();
const redis = new Redis();
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export const getKnowledgeBaseSuggestions = async (query) => {
  try {
    // Check Redis cache first
    const cachedSuggestions = await redis.get(`kb_suggestions:${query}`);
    if (cachedSuggestions) {
      return JSON.parse(cachedSuggestions);
    }

    // Fetch relevant knowledge base entries from PostgreSQL
    const knowledgeBaseEntries = await prisma.knowledgeBase.findMany({
      where: {
        content: {
          contains: query,
        },
      },
      select: {
        id: true,
        title: true,
        content: true,
      },
    });

    // If no entries found, return an empty array
    if (knowledgeBaseEntries.length === 0) {
      return [];
    }

    // Prepare the prompt for OpenAI
    const prompt = `Based on the following knowledge base entries, provide suggestions for the query: "${query}". Entries: ${JSON.stringify(knowledgeBaseEntries)}`;

    // Get suggestions from OpenAI
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 150,
    });

    const suggestions = response.data.choices[0].text.trim().split('\n').filter(Boolean);

    // Cache the suggestions in Redis for future requests
    await redis.set(`kb_suggestions:${query}`, JSON.stringify(suggestions), 'EX', 3600); // Cache for 1 hour

    return suggestions;
  } catch (error) {
    console.error('Error fetching knowledge base suggestions:', error);
    throw new Error('Could not fetch suggestions at this time. Please try again later.');
  }
};