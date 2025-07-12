import { WAMessageStubType } from '@whiskeysockets/baileys'
import fetch from 'node-fetch'

export async function before(m, { conn, participants, groupMetadata }) {
  if (!m.messageStubType || !m.isGroup) return !0;

  const fkontak = {
    key: {
      participants: "0@s.whatsapp.net",
      remoteJid: "status@broadcast",
      fromMe: false,
      id: "Halo"
    },
    message: {
      contactMessage: {
        vcard: `BEGIN:VCARD\nVERSION:3.0\nN:Sy;Bot;;;\nFN:y\nitem1.TEL;waid=${m.sender.split('@')[0]}:${m.sender.split('@')[0]}\nitem1.X-ABLabel:Ponsel\nEND:VCARD`
      }
    },
    participant: "0@s.whatsapp.net"
  }

  const chat = global.db.data.chats[m.chat]
  const who = m.messageStubParameters[0]
  const username = `@${who.split('@')[0]}`
  const groupSize = m.messageStubType == 27
    ? participants.length + 1
    : (m.messageStubType == 28 || m.messageStubType == 32)
    ? participants.length - 1
    : participants.length

  const pp = await conn.profilePictureUrl(who, 'image').catch(_ => 'https://files.catbox.moe/xr2m6u.jpg')
  const img = await (await fetch(pp)).buffer()

  const defaultWelcome = 'Bienvenido/a 😺'
  const defaultBye = 'Se fue del grupo...'

  const welcomeMsg = chat.welcomeMessage || global.welcom1 || defaultWelcome
  const byeMsg = chat.despMessage || global.welcom2 || defaultBye

  const txt = 'ゲ◜៹ New Member ៹◞ゲ'
  const txt1 = 'ゲ◜៹ Bye Member ៹◞ゲ'

  if (chat.welcome && m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_ADD) {
    let bienvenida = `┏╼★ Bienvenido
┋ 「 ${username} 」
┗╼★ 「 ${groupMetadata.subject} 」
┋❖ ${welcomeMsg}
┋❀ Miembros actuales: ${groupSize}
┗━━━━━━━━━━━━━━━┅ ⳹
> ✐ Usa *#help* para ver mis comandos.`
    await conn.sendMini(m.chat, txt, global.dev, bienvenida, img, img, global.redes, fkontak)
  }

  if (chat.welcome && (m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_REMOVE || m.messageStubType == WAMessageStubType.GROUP_PARTICIPANT_LEAVE)) {
    let bye = `┏╼★ Adiós
┋ 「 ${username} 」
┗╼★ 「 ${groupMetadata.subject} 」
┋❖ ${byeMsg}
┋❀ Miembros actuales: ${groupSize}
┗━━━━━━━━━━━━━━━┅ ⳹
> > ${global.dev}`
    await conn.sendMini(m.chat, txt1, global.dev, bye, img, img, global.redes, fkontak)
  }
}