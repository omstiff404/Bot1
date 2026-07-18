// Command/main/menu.js
import fs from 'fs/promises';
import path from 'path';

export const command = {
  name: 'menu',
  description: 'Tampilkan menu (dengan gambar + audio)',
  async execute({ sock, from, args }) {
    const imgPath = path.resolve('./Media/gambar/image.jpg');
    const audioPath = path.resolve('./Media/audio/audio.mp3');

    const imageExists = await fs.stat(imgPath).then(()=>true).catch(()=>false);
    const audioExists = await fs.stat(audioPath).then(()=>true).catch(()=>false);

    const sections = [
      { title: 'Main Menu', rows: [ { title: 'Owner', rowId: '!owner' }, { title: 'Group', rowId: '!admin' }, { title: 'Sticker', rowId: '!sticker' } ] }
    ];

    // send image if exists
    if (imageExists) {
      await sock.sendMessage(from, { image: await fs.readFile(imgPath), caption: 'Menu - stiff404' });
    } else {
      await sock.sendMessage(from, { text: 'Menu - stiff404 (no image found)' });
    }

    // send audio if exists
    if (audioExists) {
      await sock.sendMessage(from, { audio: await fs.readFile(audioPath), mimetype: 'audio/mpeg' });
    }
  }
};
