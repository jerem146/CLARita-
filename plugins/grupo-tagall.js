/* 
- tagall By Angel-OFC  
- etiqueta en un grupo a todos
- https://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y
*/
const handler = async (m, { isOwner, isAdmin, conn, text, participants, args, command, usedPrefix, groupMetadata }) => {
  if (!m.isGroup) throw '*⛔ Este comando solo funciona en grupos.*';
  if (!(isAdmin || isOwner)) {
    global.dfail('admin', m, conn);
    return;
  }

  const customEmoji = global.db.data.chats[m.chat]?.customEmoji || '🍫';
  m.react(customEmoji);

  const pesan = args.join` ` || '';
  const oi = pesan ? `*» INFO :* ${pesan}` : '';

  const groupName = groupMetadata.subject || 'Grupo';
  let pp = './media/menus/Menu2.jpg'; // Imagen por defecto

  try {
    pp = await conn.profilePictureUrl(m.chat, 'image');
  } catch (e) {
    // si falla, se queda la imagen por defecto
  }

  let teks = `*!  MENCION GENERAL  !*\n  *PARA ${participants.length} MIEMBROS* 🗣️\n\n${oi}\n\n─⌬ *${botname}*\n\n`;

  for (const mem of participants) {
    teks += `${customEmoji} @${mem.id.split('@')[0]}\n`;
  }

  teks += `\n─⌬ *Grupo:* ${groupName}\n─⌬ *Versión:* ${vs}`;

  await conn.sendMessage(m.chat, {
    image: { url: pp },
    caption: teks,
    mentions: participants.map(p => p.id)
  }, { quoted: m });
};

handler.help = ['todos *<mensaje opcional>*'];
handler.tags = ['group'];
handler.command = ['todos', 'invocar', 'tagall', /^@$/i];
handler.admin = true;
handler.group = true;

export default handler;