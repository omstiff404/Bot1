// Command/sticker/sticker.js
import { exec } from 'child_process';
export const command = {
  name: 'sticker',
  description: 'Create sticker from image (placeholder, needs ffmpeg/imagemagick on host)',
  async execute({ sock, from, args, message }) {
    await sock.sendMessage(from, { text: 'Sticker command placeholder. Send an image with caption !sticker' });
  }
};
