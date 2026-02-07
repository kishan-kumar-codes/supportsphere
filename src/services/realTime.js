import Redis from 'ioredis';
import { PrismaClient } from '@prisma/client';

const redis = new Redis(process.env.REDIS_URL);
const prisma = new PrismaClient();

const CHANNELS = {
  SENTIMENT: 'sentiment_updates',
  KNOWLEDGE_BASE: 'knowledge_base_suggestions',
};

export const publishSentimentUpdate = async (data) => {
  try {
    await redis.publish(CHANNELS.SENTIMENT, JSON.stringify(data));
  } catch (error) {
    console.error('Error publishing sentiment update:', error);
  }
};

export const publishKnowledgeBaseSuggestion = async (data) => {
  try {
    await redis.publish(CHANNELS.KNOWLEDGE_BASE, JSON.stringify(data));
  } catch (error) {
    console.error('Error publishing knowledge base suggestion:', error);
  }
};

export const subscribeToSentimentUpdates = (callback) => {
  const subscriber = new Redis(process.env.REDIS_URL);
  subscriber.subscribe(CHANNELS.SENTIMENT, (err, count) => {
    if (err) {
      console.error('Error subscribing to sentiment updates:', err);
    } else {
      console.log(`Subscribed to ${count} channel(s).`);
    }
  });

  subscriber.on('message', (channel, message) => {
    if (channel === CHANNELS.SENTIMENT) {
      try {
        const data = JSON.parse(message);
        callback(data);
      } catch (error) {
        console.error('Error parsing sentiment update message:', error);
      }
    }
  });
};

export const subscribeToKnowledgeBaseSuggestions = (callback) => {
  const subscriber = new Redis(process.env.REDIS_URL);
  subscriber.subscribe(CHANNELS.KNOWLEDGE_BASE, (err, count) => {
    if (err) {
      console.error('Error subscribing to knowledge base suggestions:', err);
    } else {
      console.log(`Subscribed to ${count} channel(s).`);
    }
  });

  subscriber.on('message', (channel, message) => {
    if (channel === CHANNELS.KNOWLEDGE_BASE) {
      try {
        const data = JSON.parse(message);
        callback(data);
      } catch (error) {
        console.error('Error parsing knowledge base suggestion message:', error);
      }
    }
  });
};

export const saveSentimentData = async (data) => {
  try {
    await prisma.sentiment.create({
      data,
    });
  } catch (error) {
    console.error('Error saving sentiment data to database:', error);
  }
};

export const saveKnowledgeBaseSuggestion = async (data) => {
  try {
    await prisma.knowledgeBase.create({
      data,
    });
  } catch (error) {
    console.error('Error saving knowledge base suggestion to database:', error);
  }
};