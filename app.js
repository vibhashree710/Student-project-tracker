import express from 'express';

export function createApp(db) {
  const app = express();

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(express.static('public'));

  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
  });

  app.get('/api/projects', (req, res) => {
    db.all('SELECT * FROM projects', [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json(rows);
    });
  });

  app.post('/api/projects', (req, res) => {
    const { name, description, studentName } = req.body;
    const query = `INSERT INTO projects (name, description, studentName) VALUES (?, ?, ?)`;
    db.run(query, [name, description, studentName], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ id: this.lastID, name, description, studentName });
    });
  });

  return app;
}
