const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let projects = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/projects', (req, res) => {
  res.json(projects);
});

app.get('/api/projects', (req, res) => {
  res.json(projects);
});

app.post('/projects', (req, res) => {
  const { name, status } = req.body;
  const newProject = {
    id: projects.length + 1,
    name: name || 'Untitled Project',
    description: status || 'In Progress',
    studentName: 'Student'
  };
  projects.push(newProject);
  res.json(newProject);
});

app.post('/api/projects', (req, res) => {
  const { name, status } = req.body;
  const newProject = {
    id: projects.length + 1,
    name: name || 'Untitled Project',
    description: status || 'In Progress',
    studentName: 'Student'
  };
  projects.push(newProject);
  res.json(newProject);
});

module.exports = app;
