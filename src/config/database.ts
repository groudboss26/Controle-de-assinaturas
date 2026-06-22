import { existsSync, mkdirSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';

const databasePath = resolve(process.cwd(), 'assinaturas.db');

const databaseDir = dirname(databasePath);

if (!existsSync(databaseDir)) {
  mkdirSync(databaseDir, { recursive: true });
}

export const db = new DatabaseSync(databasePath);

db.exec(`
  CREATE TABLE IF NOT EXISTS subscriptions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    price REAL NOT NULL,
    due_date TEXT NOT NULL,
    period TEXT NOT NULL,
    shared INTEGER DEFAULT 0,
    my_share REAL NOT NULL
  )
`);
