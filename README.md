# Cleaning Service Management System

This is a full-stack application for managing cleaning services, including user management, order processing, service management, and review systems.

## Project Structure

```
cleaning-service/
├── backend/           # Backend API server
│   ├── src/          # Source code
│   │   ├── auth/     # Authentication
│   │   ├── users/    # User management
│   │   ├── orders/   # Order management
│   │   ├── services/ # Service management
│   │   ├── reviews/  # Review system
│   │   └── ...
│   ├── index.js      # Main application file
│   └── package.json  # Backend dependencies
├── frontend/         # React frontend application
│   ├── src/         # Source code
│   ├── public/      # Static files
│   └── package.json # Frontend dependencies
└── package.json     # Root package.json for workspace management
```

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- PostgreSQL
- MongoDB (for logging)

### Installation

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Create a `.env` file in the backend directory with the following variables:
   ```
   MONGO_URI=your_mongodb_uri
   ACCESS_TOKEN_SECRET=your_jwt_secret
   ```

3. Start the development servers:
   ```bash
   # Start both frontend and backend
   npm run dev
   
   # Or start them separately
   npm run start:dev  # Backend only
   npm run frontend   # Frontend only
   ```

## Frontend Features

- React with TypeScript
- Material-UI for components
- React Router for navigation
- React Query for data fetching
- Axios for API communication

## Backend Features

- Express.js REST API
- JWT Authentication
- PostgreSQL database with Sequelize ORM
- MongoDB for logging
- Swagger API documentation

## API Documentation

API documentation is available at `/docs` endpoint when the server is running.

## Available Scripts

- `npm start` - Start the production backend server
- `npm run start:dev` - Start the development backend server
- `npm run frontend` - Start the frontend development server
- `npm run dev` - Start both frontend and backend development servers
- `npm test` - Run backend tests 