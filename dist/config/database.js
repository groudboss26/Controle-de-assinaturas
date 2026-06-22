"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.db = void 0;
const node_fs_1 = require("node:fs");
const node_path_1 = require("node:path");
const node_sqlite_1 = require("node:sqlite");
const databasePath = (0, node_path_1.resolve)(process.cwd(), 'assinaturas.db');
const databaseDir = (0, node_path_1.dirname)(databasePath);
if (!(0, node_fs_1.existsSync)(databaseDir)) {
    (0, node_fs_1.mkdirSync)(databaseDir, { recursive: true });
}
exports.db = new node_sqlite_1.DatabaseSync(databasePath);
exports.db.exec(`
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
