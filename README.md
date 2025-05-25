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
└── package.json      # Root package.json for workspace management
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

3. Start the development server:
   ```bash
   npm run start:dev
   ```

## API Documentation

API documentation is available at `/docs` endpoint when the server is running.

## Available Scripts

- `npm start` - Start the production server
- `npm run start:dev` - Start the development server with hot reload
- `npm test` - Run tests 