import express from 'express';

export function createApp(db) {
  const app = express();

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // your other routes...

  return app;
}
