import fs from 'fs';
import path from 'path';
import { User, Work, Stage, Expense } from './types';

/**
 * Simple file-backed JSON database.
 * Great for dev / portfolio projects — can be swapped for Postgres later
 * by replacing only this module.
 */

interface Database {
  users: User[];
  works: Work[];
  stages: Stage[];
  expenses: Expense[];
}

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');

function ensureFile(): void {
  const dir = path.dirname(DB_FILE);
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
  if (!fs.existsSync(DB_FILE)) {
    const initial: Database = { users: [], works: [], stages: [], expenses: [] };
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
  }
}

export function readDB(): Database {
  ensureFile();
  const raw = fs.readFileSync(DB_FILE, 'utf-8');
  return JSON.parse(raw) as Database;
}

export function writeDB(data: Database): void {
  ensureFile();
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
}

export function updateDB(mutator: (db: Database) => void): Database {
  const db = readDB();
  mutator(db);
  writeDB(db);
  return db;
}
