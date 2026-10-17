const express = require('express');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

let projects = [];

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get(['/projects', '/api/projects'], (req, res) => {
  const formattedProjects = projects.map(p => ({
    ...p,
    status: p.status || p.description || 'In Progress',
    description: p.description || p.status || 'In Progress'
  }));
  res.json(formattedProjects);
});

app.post(['/projects', '/api/projects'], (req, res) => {
  const { name, status, description } = req.body;
  const val = status || description || 'In Progress';
  const newProject = {
    id: projects.length + 1,
    name: name || 'Untitled Project',
    status: val,
    description: val,
    studentName: 'Student'
  };
  projects.push(newProject);
  res.json(newProject);
});

module.exports = app;

