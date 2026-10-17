app.get('/projects', (req, res) => {
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
