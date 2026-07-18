// Command/owner/owner.js
export const command = {
  name: 'owner',
  description: 'Owner commands: show or set basic settings',
  async execute({ sock, from, args }) {
    const sub = (args[0] || '').toLowerCase();
    if (sub === 'who') {
      await sock.sendMessage(from, { text: 'Owner: omstiff404' });
      return;
    }
    if (sub === 'set' && args[1]) {
      // simple setting example: prefix
      const key = args[1];
      const val = args.slice(2).join(' ');
      await sock.sendMessage(from, { text: `Setting ${key} updated to ${val}` });
      return;
    }
    await sock.sendMessage(from, { text: 'Owner commands:\n - !owner who\n - !owner set <key> <value>' });
  }
};
