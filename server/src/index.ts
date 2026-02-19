import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import cors from 'cors';
import morgan from 'morgan';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import type { Request, Response, NextFunction } from 'express';
import { initializeDatabase, seedDatabase, closeDatabase } from './config/database.js';

// Routes
import authRoutes from './routes/auth.js';
import riskAssessmentRoutes from './routes/risk-assessments.js';
import complianceRoutes from './routes/compliance.js';
import aiServiceRoutes from './routes/ai-services.js';
import productRoutes from './routes/products.js';
import dashboardRoutes from './routes/dashboard.js';
import aiIntelligenceRoutes from './routes/ai-intelligence.js';
import ontologyRoutes from './routes/ontology.js';
import riskGuideRoutes from './routes/risk-guide.js';
import sllmRoutes from './routes/sllm.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const NODE_ENV = process.env.NODE_ENV || 'development';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(helmet({ contentSecurityPolicy: false }));
app.use(compression());
app.use(cors({
  origin: process.env.CORS_ORIGIN || ['http://localhost:5173', 'http://localhost:8080', 'http://localhost:3000'],
  credentials: true,
}));
app.use(morgan(NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

// Initialize database and start server
(async () => {
  try {
    await initializeDatabase();
    await seedDatabase();

    // API Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/risk-assessments', riskAssessmentRoutes);
    app.use('/api/compliance', complianceRoutes);
    app.use('/api/ai-services', aiServiceRoutes);
    app.use('/api/products', productRoutes);
    app.use('/api/dashboard', dashboardRoutes);
    app.use('/api/ai', aiIntelligenceRoutes);
    app.use('/api/ontology', ontologyRoutes);
    app.use('/api/risk-guide', riskGuideRoutes);
    app.use('/api/sllm', sllmRoutes);

    // Health check
    app.get('/api/health', (req, res) => {
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        environment: NODE_ENV,
        version: '2.0.0',
        database: 'SQLite (sql.js)',
        ai: 'Grok (xAI) - RAG & Ontology',
      });
    });

    // Serve static frontend in production
    if (NODE_ENV === 'production') {
      const clientPath = path.join(__dirname, '../../dist');
      app.use(express.static(clientPath));
      app.get('*', (req, res) => {
        if (!req.path.startsWith('/api')) {
          res.sendFile(path.join(clientPath, 'index.html'));
        }
      });
    }

    // 404 Handler
    app.use((req, res) => {
      res.status(404).json({ error: 'Route not found' });
    });

    // Error Handler
    app.use((err: any, req: Request, res: Response, next: NextFunction) => {
      console.error(err);
      res.status(err.status || 500).json({
        error: NODE_ENV === 'production' ? 'Internal Server Error' : err.message,
      });
    });

    // Graceful shutdown
    process.on('SIGINT', () => { closeDatabase(); process.exit(0); });
    process.on('SIGTERM', () => { closeDatabase(); process.exit(0); });

    // Start server
    app.listen(PORT, () => {
      console.log(`AI Governance Platform API Server`);
      console.log(`   Port: ${PORT} | Env: ${NODE_ENV}`);
      console.log(`   Database: SQLite (sql.js)`);
      console.log(`   API: http://localhost:${PORT}/api/health`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
})();
