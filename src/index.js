import express from 'express';
import { rateLimiter } from './limiter.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// Global rate limiting: 20 requests per 60-second sliding window
app.use(rateLimiter({ windowMs: 60 * 1000, maxRequests: 20 }));

// Healthcheck route
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    service: 'sentinel-rate-limiter',
    uptime: process.uptime(),
    timestamp: new Date().toISOString()
  });
});

// Protected demo payload route
app.get('/api/v1/data', (req, res) => {
  res.status(200).json({
    message: 'Request authorized and served through Sentinel gateway.',
    timestamp: Date.now()
  });
});

// Sensitive route with tighter limit
app.post('/api/v1/login', rateLimiter({ windowMs: 60 * 1000, maxRequests: 5 }), (req, res) => {
  res.status(200).json({ message: 'Authentication attempt received.' });
});

app.listen(PORT, () => {
  console.log(`Sentinel Gateway listening on port ${PORT}`);
});
