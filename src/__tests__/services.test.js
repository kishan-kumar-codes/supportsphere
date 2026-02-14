import { PrismaClient } from '@prisma/client';
import { createClient } from 'redis';
import request from 'supertest';
import app from '../app'; // Assuming your Express app is exported from app.js
import { jest } from '@jest/globals';

const prisma = new PrismaClient();
const redisClient = createClient();

beforeAll(async () => {
  await prisma.$connect();
  await redisClient.connect();
});

afterAll(async () => {
  await prisma.$disconnect();
  await redisClient.quit();
});

describe('Backend Services', () => {
  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ username: 'testuser', password: 'password123' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.username).toBe('testuser');

    // Clean up
    await prisma.user.delete({ where: { id: response.body.id } });
  });

  it('should fetch a user by ID', async () => {
    const newUser = await prisma.user.create({
      data: { username: 'fetchuser', password: 'password123' },
    });

    const response = await request(app).get(`/api/users/${newUser.id}`);

    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('id', newUser.id);
    expect(response.body.username).toBe('fetchuser');

    // Clean up
    await prisma.user.delete({ where: { id: newUser.id } });
  });

  it('should return 404 for non-existing user', async () => {
    const response = await request(app).get('/api/users/999999');

    expect(response.status).toBe(404);
    expect(response.body).toHaveProperty('error', 'User not found');
  });

  it('should update a user', async () => {
    const newUser = await prisma.user.create({
      data: { username: 'updateuser', password: 'password123' },
    });

    const response = await request(app)
      .put(`/api/users/${newUser.id}`)
      .send({ username: 'updateduser' });

    expect(response.status).toBe(200);
    expect(response.body.username).toBe('updateduser');

    // Clean up
    await prisma.user.delete({ where: { id: newUser.id } });
  });

  it('should delete a user', async () => {
    const newUser = await prisma.user.create({
      data: { username: 'deleteuser', password: 'password123' },
    });

    const response = await request(app).delete(`/api/users/${newUser.id}`);

    expect(response.status).toBe(204);

    const fetchResponse = await request(app).get(`/api/users/${newUser.id}`);
    expect(fetchResponse.status).toBe(404);

    // Clean up not needed as user is already deleted
  });
});