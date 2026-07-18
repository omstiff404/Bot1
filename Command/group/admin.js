// Command/group/admin.js
export const command = {
  name: 'admin',
  description: 'Simple group admin commands placeholder',
  async execute({ sock, from, args }) {
    const sub = (args[0] || '').toLowerCase();
    if (sub === 'tag') {
      await sock.sendMessage(from, { text: 'tagging group (placeholder)' });
      return;
    }
    await sock.sendMessage(from, { text: 'Group admin commands:\n - !admin tag' });
  }
};
