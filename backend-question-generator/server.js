import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import questionRoutes from './routes/questionRoutes.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Connect to MongoDB Atlas
connectDB();

// Middleware
app.use(express.json({ limit: '10mb' })); // Parse JSON bodies
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // Parse URL-encoded bodies

// CORS Configuration
const corsOptions = {
  origin: function (origin, callback) {
    const allowed = [
      'http://localhost:3000',
      'http://localhost:5173',
      'http://localhost:5174',
      'http://localhost:5175',
      'https://mernproj1.vercel.app'
    ];

    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow vercel deployments
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    if (allowed.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
};

app.use(cors(corsOptions));

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'College Companion - Question Generator API',
    version: '1.0.0',
    status: 'Active',
    endpoints: {
      generate: 'POST /api/questions/generate',
      history: 'GET /api/questions/history',
      getById: 'GET /api/questions/:id',
      delete: 'DELETE /api/questions/:id'
    },
    documentation: {
      generate: {
        method: 'POST',
        body: {
          syllabus: 'string (required, min 10 chars)',
          questionType: 'string (required: mcq, short-answer, long-answer, etc.)'
        }
      },
      history: {
        method: 'GET',
        query: {
          limit: 'number (optional, default 50)',
          page: 'number (optional, default 1)',
          questionType: 'string (optional)'
        }
      }
    }
  });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    database: 'connected',
    uptime: process.uptime()
  });
});

// Mount question routes
app.use('/api/questions', questionRoutes);

// 404 Handler - Must return JSON
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found',
    requestedUrl: req.url,
    method: req.method,
    availableEndpoints: [
      'POST /api/questions/generate',
      'GET /api/questions/history',
      'GET /api/questions/:id',
      'DELETE /api/questions/:id'
    ]
  });
});

// Global Error Handler - Must return JSON
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.message);

  // Don't expose error stack in production
  const errorResponse = {
    success: false,
    error: err.message || 'Internal server error',
    timestamp: new Date().toISOString()
  };

  // Include stack trace only in development
  if (process.env.NODE_ENV === 'development') {
    errorResponse.stack = err.stack;
  }

  res.status(err.status || 500).json(errorResponse);
});

// Start server
const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log('\n🚀 ============================================');
  console.log('   Question Generator Backend Server');
  console.log('============================================');
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`📍 Base URL: http://localhost:${PORT}`);
  console.log(`📍 API Endpoint: http://localhost:${PORT}/api/questions`);
  console.log(`📍 Health Check: http://localhost:${PORT}/health`);
  console.log('============================================');
  console.log('📊 MongoDB Atlas connected to "test" database');
  console.log('💡 Collection: questionhistories');
  console.log('🤖 Groq AI: llama-3.3-70b-versatile');
  console.log('============================================\n');
});

// Graceful shutdown
const shutdown = () => {
  console.log('\n🛑 Shutting down gracefully...');
  process.exit(0);
};

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

export default app;
