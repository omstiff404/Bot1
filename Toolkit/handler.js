// Toolkit/handler.js
// Minimal handler without switch/case: register commands as a Map
import fs from 'fs/promises';
import path from 'path';
import cfg from '../Config.js';
import { appendLog } from './function.js';

const commands = new Map();

// auto-load command files
async function loadCommands() {
  const base = path.join(process.cwd(), 'Command');
  try {
    const walk = async (dir) => {
      const files = await fs.readdir(dir, { withFileTypes: true });
      for (const f of files) {
        const p = path.join(dir, f.name);
        if (f.isDirectory()) await walk(p);
        else if (f.isFile() && f.name.endsWith('.js')) {
          const mod = await import(`file://${p}`);
          if (mod?.command && mod.command.name) {
            commands.set(mod.command.name, mod.command);
          }
        }
      }
    };
    await walk(base);
  } catch (e) {
    // ignore if Command folder not present yet
  }
}

await loadCommands();

export async function messageHandler({ sock, messages, cfg: _cfg, logger }) {
  const upsert = messages?.messages?.[0];
  if (!upsert) return;
  const message = upsert;
  const from = message.key.remoteJid || 'unknown';
  const body = (message.message?.conversation || message.message?.extendedTextMessage?.text || '').trim();

  if (!body) return; // ignore non-text for now

  // log chat
  await appendLog({ time: new Date().toISOString(), from, body });

  // prefix handling
  if (!body.startsWith(_cfg.PREFIX)) return;
  const without = body.slice(_cfg.PREFIX.length).trim();
  const [cmd, ...rest] = without.split(/\s+/);
  const args = rest;

  const handler = commands.get(cmd.toLowerCase());
  if (!handler) {
    await sock.sendMessage(from, { text: `Unknown command: ${cmd}` });
    return;
  }

  try {
    await handler.execute({ sock, message, from, args, cfg: _cfg, logger });
  } catch (err) {
    logger.error(err);
    await sock.sendMessage(from, { text: 'Error while executing command.' });
  }
}

export function registerCommand(name, obj) { commands.set(name, obj); }
