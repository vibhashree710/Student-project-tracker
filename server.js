const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbFile = '/tmp/database.sqlite';
const db = new sqlite3.Database(dbFile, (err) => {
  if (err) console.error('Database opening error: ' + err.message);
});

db.run(`CREATE TABLE IF NOT EXISTS projects (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  description TEXT,
  studentName TEXT
)`);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/projects', (req, res) => {
  db.all('SELECT * FROM projects', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects', [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.post('/projects', (req, res) => {
  const { name, status } = req.body;
  const query = `INSERT INTO projects (name, description, studentName) VALUES (?, ?, ?)`;
  db.run(query, [name, status, 'Student'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, status });
  });
});

app.post('/api/projects', (req, res) => {
  const { name, status } = req.body;
  const query = `INSERT INTO projects (name, description, studentName) VALUES (?, ?, ?)`;
  db.run(query, [name, status, 'Student'], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, name, status });
  });
});

module.exports = app;
