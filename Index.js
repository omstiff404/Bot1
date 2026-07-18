// Index.js - bot bootstrap (ESM)
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import pino from 'pino';
import qrcode from 'qrcode-terminal';
import { useMultiFileAuthState, makeWASocket, DisconnectReason, fetchLatestBaileysVersion, proto } from '@adiwajshing/baileys';
import { ensureDB, saveDB } from './Toolkit/function.js';
import { messageHandler } from './Toolkit/handler.js';
import cfg from './Config.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function createBot() {
  await ensureDB();
  const logger = pino({ level: 'info' });

  const { state, saveCreds } = await useMultiFileAuthState('./Toolkit/database/auth');

  const { version, isLatest } = await fetchLatestBaileysVersion();
  logger.info({ version, isLatest }, 'Baileys version');

  const sock = makeWASocket({
    logger,
    printQRInTerminal: false,
    auth: state,
    version
  });

  sock.ev.on('creds.update', saveCreds);

  // connection updates (pairing, QR code, etc.)
  sock.ev.on('connection.update', (update) => {
    const { connection, lastDisconnect, qr } = update;
    if (qr) {
      // display QR in terminal and save to logs
      qrcode.generate(qr, { small: true });
      logger.info('QR code generated -- scan with WhatsApp mobile client');
      // also write a pairing QR file (overwritten each time)
      fs.writeFile('./Toolkit/database/last_qr.txt', qr).catch(()=>{});
    }
    if (connection === 'close') {
      const code = lastDisconnect?.error?.output?.statusCode || lastDisconnect?.error?.statusCode;
      logger.warn({ code }, 'connection closed');
      if (code !== DisconnectReason.loggedOut) {
        // reconnect
        createBot().catch(err => logger.error(err));
      } else {
        logger.info('Logged out, delete auth folder to re-pair');
      }
    }
    if (connection === 'open') {
      logger.info('Connection open');
    }
  });

  // message handling
  sock.ev.on('messages.upsert', async m => {
    try {
      await messageHandler({ sock, messages: m, cfg, logger });
    } catch (err) {
      logger.error(err, 'messageHandler error');
    }
  });

  return sock;
}

// If run directly
if (import.meta.url === `file://${process.argv[1]}`) {
  createBot().catch(err => { console.error(err); process.exit(1); });
}
