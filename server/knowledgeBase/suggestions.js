import { PrismaClient } from '@prisma/client';
import Redis from 'ioredis';
import { OpenAIApi, Configuration } from 'openai';

const prisma = new PrismaClient();
const redis = new Redis();
const openai = new OpenAIApi(new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
}));

export async function getKnowledgeBaseSuggestions(userInput) {
  try {
    // Check Redis cache first
    const cachedSuggestions = await redis.get(`suggestions:${userInput}`);
    if (cachedSuggestions) {
      return JSON.parse(cachedSuggestions);
    }

    // Fetch relevant articles from the database
    const articles = await prisma.article.findMany({
      where: {
        OR: [
          { title: { contains: userInput, mode: 'insensitive' } },
          { content: { contains: userInput, mode: 'insensitive' } },
        ],
      },
      take: 5, // Limit to 5 suggestions
    });

    // If no articles found, use OpenAI to generate suggestions
    if (articles.length === 0) {
      const response = await openai.createCompletion({
        model: 'text-davinci-003',
        prompt: `Suggest knowledge base articles related to: ${userInput}`,
        max_tokens: 100,
      });

      const suggestions = response.data.choices[0].text.trim().split('\n').map(s => s.trim());
      await redis.set(`suggestions:${userInput}`, JSON.stringify(suggestions), 'EX', 3600); // Cache for 1 hour
      return suggestions;
    }

    // Cache the found articles
    await redis.set(`suggestions:${userInput}`, JSON.stringify(articles), 'EX', 3600); // Cache for 1 hour
    return articles;
  } catch (error) {
    console.error('Error fetching knowledge base suggestions:', error);
    throw new Error('Could not fetch suggestions at this time. Please try again later.');
  }
}