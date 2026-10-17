import sqlite3 from 'sqlite3';
import path from 'path';
import fs from 'fs';

// Use /tmp for Vercel's read-only environment, or local path for development
const dbPath = process.env.NODE_ENV === 'production' 
  ? path.join('/tmp', 'database.sqlite') 
  : './database.sqlite';

// Ensure table is initialized if using /tmp on serverless cold starts
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Error opening database', err.message);
  } else {
    console.log('Connected to SQLite database.');
    db.run(`CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT,
      studentName TEXT
    )`);
  }
});

export { db };
