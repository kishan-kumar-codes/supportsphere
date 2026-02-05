# SupportSphere ![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![Version](https://img.shields.io/badge/version-1.0.0-blue)

## Project Description
SupportSphere is an intelligent customer support platform that leverages AI to analyze customer queries and prioritize support tickets in real-time. It integrates seamlessly with a knowledge base to provide agents with contextual suggestions, enhancing response times and customer satisfaction.

## Features
- 🤖 AI-driven customer query analysis
- ⏱️ Real-time support ticket prioritization
- 📚 Integrated knowledge base suggestions

## Tech Stack
### Frontend
- **Next.js** 🌐

### Backend
- **Node.js** 🚀
- **OpenAI Agent SDK** 🧠

### Database
- **PostgreSQL** 🗄️
- **Prisma** 🔗

### Caching
- **Redis** 🧊

## Installation
To set up the project locally, follow these steps:

- Clone the repository
bash
git clone https://github.com/kishan-kumar-codes/supportsphere.git
- Navigate into the project directory
bash
cd supportsphere
- Install the dependencies
bash
npm install
- Set up your environment variables (create a `.env` file based on `.env.example`)
bash
cp .env.example .env
- Run the database migrations
bash
npx prisma migrate dev
- Start the development server
bash
npm run dev
## Usage
Once the server is running, you can access the application at `http://localhost:3000`. Follow the on-screen instructions to set up your customer support environment.

## API Documentation
For detailed API documentation, please refer to the [API Docs](https://github.com/kishan-kumar-codes/supportsphere/wiki/API-Documentation).

## Testing
To run the tests, use the following command:
bash
npm test
## Deployment
For deploying the application, follow these steps:

- Build the application
bash
npm run build
- Start the production server
bash
npm start
- Ensure your environment variables are set correctly for production.

## Contributing
We welcome contributions! Please follow these guidelines:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature/YourFeature`).
3. Make your changes and commit them (`git commit -m 'Add some feature'`).
4. Push to the branch (`git push origin feature/YourFeature`).
5. Open a Pull Request.

Thank you for considering contributing to SupportSphere!