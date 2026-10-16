export function createApp(db) {
  const app = express(); // or whatever your app initialization is

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  // your other routes...

  return app;
}