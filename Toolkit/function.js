// Toolkit/function.js - utilities for DB and media helpers
import fs from 'fs/promises';
import path from 'path';

const DB_PATH = './Toolkit/database/DB.json';

export async function ensureDB() {
  try {
    await fs.mkdir(path.dirname(DB_PATH), { recursive: true });
    try { await fs.access(DB_PATH); } catch { await fs.writeFile(DB_PATH, JSON.stringify({ chats: [], settings: {} }, null, 2)); }
  } catch (e) {
    console.error('ensureDB error', e);
  }
}

export async function readDB() {
  const raw = await fs.readFile(DB_PATH, 'utf8');
  return JSON.parse(raw || '{}');
}

export async function saveDB(obj) {
  await fs.writeFile(DB_PATH, JSON.stringify(obj, null, 2));
}

export function shortTime() { return new Date().toISOString(); }

export async function appendLog(line) {
  const logPath = './logs/chat.log';
  await fs.mkdir('./logs', { recursive: true });
  await fs.appendFile(logPath, `${JSON.stringify(line)}\n`);
}
