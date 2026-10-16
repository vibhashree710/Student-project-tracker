import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import fs from 'fs';
import path from 'path';

const dir = './data';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const dbPromise = open({
  filename: path.join(dir, 'projects.db'),
  driver: sqlite3.Database
});

async function init() {
  const db = await dbPromise;
  await db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      status TEXT NOT NULL
    )
  `);
}

init();

export const db = {
  async list() {
    const db = await dbPromise;
    return db.all('SELECT * FROM projects');
  },

  async create(project) {
    const db = await dbPromise;
    const result = await db.run(
      'INSERT INTO projects (name, status) VALUES (?, ?)',
      project.name,
      project.status
    );
    return { id: result.lastID, ...project };
  },

  async update(id, project) {
    const db = await dbPromise;
    const result = await db.run(
      'UPDATE projects SET name = ?, status = ? WHERE id = ?',
      project.name,
      project.status,
      id
    );
    if (result.changes === 0) return null;
    return { id: Number(id), ...project };
  },

  async remove(id) {
    const db = await dbPromise;
    const result = await db.run('DELETE FROM projects WHERE id = ?', id);
    return result.changes > 0;
  }
};