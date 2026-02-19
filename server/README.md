# AI Governance Platform - Backend Server

A Node.js + Express + SQLite backend for the AI Governance Platform with TypeScript support.

## Ports (Default)

- **Backend API**: `3001` (see `PORT` in `.env`)
- **Health check**: `http://localhost:3001/api/health`

## Project Structure

```
src/
├── config/       # Configuration files
├── middleware/   # Express middleware
├── models/       # SQLite database models
├── routes/       # API route handlers
├── services/     # Business logic
└── utils/        # Utility functions
data/             # Database and upload files
dist/             # Compiled JavaScript (generated)
```

## Setup Instructions

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your configuration values
   - Set `XAI_API_KEY` to enable Grok (xAI) responses on a real server.

## Development

### Start the development server:
```bash
npm run dev
```

The server will start with auto-reload on file changes.

### Build for production:
```bash
npm run build
```

### Run production build:
```bash
npm start
```

## Serving the Frontend (Production)

When `NODE_ENV=production`, the backend serves the built frontend **from the repo root `dist/` folder**.

1. Build the frontend (repo root):
```bash
cd ..
npm run build
```

2. Build & start the backend (server folder):
```bash
cd server
npm run build
NODE_ENV=production npm start
```

Then open (example):
- `http://localhost:3001/ai-intelligence`

## Dependencies

### Production
- **express** - Web framework
- **cors** - CORS middleware
- **jsonwebtoken** - JWT authentication
- **bcryptjs** - Password hashing
- **dotenv** - Environment variables
- **multer** - File upload handling
- **uuid** - UUID generation
- **helmet** - Security headers
- **compression** - Response compression
- **morgan** - HTTP request logging
- **sql.js** - SQLite (WASM) database engine

### Development
- **typescript** - TypeScript compiler
- **@types/*** - Type definitions
- **tsx** - TypeScript execution
- **nodemon** - Auto-reload development
- **@types/node** - Node.js types
- **@types/express** - Express types

## API Endpoints

Add your API endpoints documentation here as you develop them.

## Environment Variables

See `.env.example` for all available configuration options.

## License

ISC
