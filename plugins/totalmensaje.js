let handler = async (m, { conn, participants, isGroup, chat }) => {
  if (!isGroup) return conn.reply(m.chat, 'Este comando solo funciona en grupos.', m)

  const contador = global.db.data.msgContador?.[chat] || {}

  if (!Object.keys(contador).length) {
    return conn.reply(m.chat, 'AÃºn no se han contado mensajes en este grupo.', m)
  }

  let lista = Object.entries(contador)
    .map(([jid, count]) => ({ jid, count }))
    .sort((a, b) => b.count - a.count)

  let texto = `ðŸ“Š *EstadÃ­sticas de mensajes en el grupo:*

`

  for (let i = 0; i < lista.length; i++) {
    let user = lista[i]
    texto += `*${i + 1}.* @${user.jid.split('@')[0]} âž¤ *${user.count}* mensajes\n`
  }

  conn.reply(m.chat, texto, m, {
    mentions: lista.map(u => u.jid)
  })
}

handler.command = ['totalmensaje', 'totalmsg']
handler.help = ['totalmensaje']
handler.tags = ['group']
handler.group = true

export default handler