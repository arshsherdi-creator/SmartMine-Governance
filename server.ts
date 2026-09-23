import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import { apiRouter } from './server/routes';

async function startServer() {
  const app = express();
  const PORT = 3000;

  // JSON payload parser
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({
      status: 'ok',
      service: 'SmartMine Governance AI Platform',
      version: '1.0.0',
      timestamp: new Date().toISOString()
    });
  });

  // API routes go FIRST
  app.use('/api', apiRouter);

  // 404 handler for any unhandled /api request (prevents falling through to Vite HTML)
  app.all('/api/*', (req, res) => {
    res.status(404).json({
      success: false,
      message: `API endpoint not found: ${req.method} ${req.originalUrl}`
    });
  });
  app.all('/api', (req, res) => {
    res.status(404).json({ success: false, message: 'API root not found' });
  });

  // Global API error handler (ensures JSON response on errors)
  app.use('/api', (err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('API Error:', err);
    res.status(500).json({
      success: false,
      message: err?.message || 'Internal Server Error'
    });
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SmartMine Governance Enterprise Server running on port ${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start SmartMine Governance server:', err);
  process.exit(1);
});
