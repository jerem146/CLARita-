/* 
- tagall By Angel-OFC  
- etiqueta en un grupo a todos
- https://whatsapp.com/channel/0029VaJxgcB0bIdvuOwKTM2Y
*/
import fetch from 'node-fetch';

const handler = async (m, { conn, participants, args, command, usedPrefix }) => {
  if (!m.isGroup) throw '✳️ Este comando solo puede usarse en grupos.';
  const groupMetadata = await conn.groupMetadata(m.chat);
  const groupName = groupMetadata.subject;
  const groupIcon = await conn.profilePictureUrl(m.chat, 'image').catch(() => 'https://i.imgur.com/JHrmYFy.jpeg');

  const mensaje = args.join(' ') || '» INFO :';
  const total = participants.length;
  const emoji = '🍫';

  let texto = `*❖ MENCION GENERAL ❖*\n*𓆩 PARA ${total} MIEMBROS 𓆪*\n\n${mensaje}\n\n┌──「 *${groupName}* 」──⊷\n`;

  for (const user of participants) {
    texto += `${emoji} @${user.id.split('@')[0]}\n`;
  }

  texto += `└─────────────⳹`;

  await conn.sendMessage(m.chat, {
    image: await (await fetch(groupIcon)).buffer(),
    caption: texto,
    mentions: participants.map(p => p.id)
  }, { quoted: m });
};

handler.help = ['todos *<mensaje>*'];
handler.tags = ['group'];
handler.command = ['todos', 'tagall', 'invocar'];
handler.group = true;
handler.admin = true;

export default handler;