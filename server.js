import express from 'express';
import sqlite3 from 'sqlite3';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Explicitly serve index.html at the root URL
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Database and API routes...
const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join('/tmp', 'database.sqlite') 
  : './database.sqlite';

const db = new sqlite3.Database(dbPath, (err) => {
  if (!err) {
    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      studentName TEXT
    )`);
  }
});

app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/api/projects', (req, res) => {
  const { name, description, studentName } = req.body;
  const query = `INSERT INTO projects (name, description, studentName) VALUES (?, ?, ?)`;
  db.run(query, [name, description, studentName], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, description, studentName });
  });
});

export default app;
