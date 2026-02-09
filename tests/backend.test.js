import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../src/app'; // Assuming your Express app is exported from this path

const prisma = new PrismaClient();

describe('Backend Tests', () => {
  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should create a new user', async () => {
    const response = await request(app)
      .post('/api/users')
      .send({ name: 'John Doe', email: 'john@example.com' });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('id');
    expect(response.body.name).toBe('John Doe');
  });

  it('should return a user by ID', async () => {
    const user = await prisma.user.create({
      data: { name: 'Jane Doe', email: 'jane@example.com' },
    });

    const response = await request(app).get(`/api/users/${user.id}`);
    expect(response.status).toBe(200);
    expect(response.body.name).toBe('Jane Doe');
  });

  it('should handle user not found', async () => {
    const response = await request(app).get('/api/users/99999');
    expect(response.status).toBe(404);
    expect(response.body.message).toBe('User not found');
  });
});

import { render, screen } from '@testing-library/react';
import Home from '../src/pages/index'; // Assuming your main page is here

describe('Frontend Tests', () => {
  it('renders the homepage', () => {
    render(<Home />);
    const heading = screen.getByRole('heading', { name: /welcome/i });
    expect(heading).toBeInTheDocument();
  });

  it('displays user data correctly', async () => {
    render(<Home />);
    const userElement = await screen.findByText(/john doe/i);
    expect(userElement).toBeInTheDocument();
  });

  it('handles error state', () => {
    render(<Home />);
    const errorMessage = screen.getByText(/error loading data/i);
    expect(errorMessage).toBeInTheDocument();
  });
});