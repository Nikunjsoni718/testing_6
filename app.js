import express from 'express';
import cors from 'cors';
import { userRoutes } from './routes/users.js';
import { productRoutes } from './routes/products.js';
import { logRequest, errorHandler } from './middleware/logger.js';

const app = express();
const PORT = process.env.PORT || 3000;

// Standard middleware configuration
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['https://meliusai.in', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

// Custom logging middleware
app.use(logRequest);

// Health check route for load balancers
app.get('/health', (req, res) => {
  res.status(200).json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Main API Routers
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/products', productRoutes);

// Fallback for 404s
app.use((req, res, next) => {
  res.status(404).json({ error: 'Resource not found' });
});

// Global error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Enterprise API Gateway initialized on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
