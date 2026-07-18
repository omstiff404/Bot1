// Main.js
// Provides a start function and modular hooks
import { createBot } from './Index.js';

export async function start() {
  const bot = await createBot();
  return bot;
}

// If run directly, start the bot
if (import.meta.url === `file://${process.argv[1]}`) {
  start().catch(err => {
    console.error('Failed to start bot', err);
    process.exit(1);
  });
}
