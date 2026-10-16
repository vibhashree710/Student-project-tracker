import express from 'express';
export function createApp(db) {
  const app = express();
  app.use(express.json());
  app.use(express.static('public'));

  // Health check route
  app.get('/api/health', (req, res) => {
    res.json({ ok: true });
  });

  function readId(req, res) {
    const id = Number(req.params.id);
    if (Number.isNaN(id)) {
      res.status(400).json({ error: 'Invalid ID.' });
      return null;
    }
    return id;
  }

  function readProject(req, res) {
    const { name, status } = req.body;
    if (!name || typeof name !== 'string' || !name.trim()) {
      res.status(400).json({ error: 'Project name is required.' });
      return null;
    }
    if (!status || typeof status !== 'string' || !status.trim()) {
      res.status(400).json({ error: 'Project status is required.' });
      return null;
    }
    return { name: name.trim(), status: status.trim() };
  }

  app.get('/api/projects', async (req, res) => {
    const rows = await db.list();
    res.json(rows);
  });

  app.post('/api/projects', async (req, res) => {
    const project = readProject(req, res);
    if (!project) return;
    const row = await db.create(project);
    res.status(201).json(row);
  });
  app.get('/api/projects/:id', async (req, res) => {
    const id = readId(req, res);
    if (id === null) return;
    const row = await db.read(id);
    if (!row) return res.status(404).json({ error: 'Project not found.' });
    res.json(row);
  });

  app.put('/api/projects/:id', async (req, res) => {
    const id = readId(req, res);
    if (id === null) return;
    const project = readProject(req, res);
    if (!project) return;
    const row = await db.update(id, project);
    if (!row) return res.status(404).json({ error: 'Project not found.' });
    res.json(row);
  });

  app.delete('/api/projects/:id', async (req, res) => {
    const id = readId(req, res);
    if (id === null) return;
    if (!await db.remove(id)) return res.status(404).json({ error: 'Project not found.' });
    res.json({ deleted: true });
  });

  app.use('/api', (req, res) => res.status(404).json({ error: 'API route not found.' }));
  
  app.use((error, req, res, next) => {
    if (error.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
    if (error.type === 'entity.too.large') return res.status(413).json({ error: 'Request too large.' });
    console.error('Request failed:', error.code || error.name);
    res.status(500).json({ error: 'Server error. Check the server terminal.' });
  });

  return app;
}