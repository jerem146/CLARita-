import axios from 'axios'
import fetch from 'node-fetch'

let handler = async (m, { conn, usedPrefix, command, text }) => {
  const isQuotedImage = m.quoted && (m.quoted.msg || m.quoted).mimetype && (m.quoted.msg || m.quoted).mimetype.startsWith('image/')
  const username = `${conn.getName(m.sender)}`
  const basePrompt = `Tu nombre es ${botname} y fuiste creada por ${etiqueta}. Tu versión actual es ${vs}, tú usas el idioma Español. Llamarás a las personas por su nombre: ${username}. Te gusta ser divertida y te encanta aprender. Lo más importante es que debes ser amigable con la persona con la que estás hablando.`

  if (isQuotedImage) {
    const q = m.quoted
    const img = await q.download?.()
    if (!img) {
      return conn.reply(m.chat, '✘ No se pudo descargar la imagen.', m)
    }

    const content = `${emoji} ¿Qué se observa en la imagen?`
    try {
      const imageAnalysis = await fetchImageBuffer(content, img)
      const query = `Descríbeme la imagen y dime por qué actúan así. ¿Quién eres tú?`
      const prompt = `${basePrompt}. La imagen contiene: ${imageAnalysis.result}`
      const description = await luminsesi(query, username, prompt)

      await conn.sendMessage(m.chat, { text: description }, { quoted: m })
    } catch (e) {
      await conn.reply(m.chat, '✘ No se pudo analizar la imagen.', m)
    }

  } else {
    if (!text) {
      return conn.reply(m.chat, `${emoji} Por favor, ingresa tu petición.`, m)
    }

    try {
      const query = text
      const prompt = `${basePrompt}. Responde lo siguiente: ${query}`
      const response = await luminsesi(query, username, prompt)

      await conn.sendMessage(m.chat, { text: response }, { quoted: m })
    } catch (e) {
      await conn.reply(m.chat, '✘ No puedo responder a eso ahora.', m)
    }
  }
}

handler.help = ['ia', 'chatgpt']
handler.tags = ['ai']
handler.command = ['ia', 'chatgpt', 'luminai']
handler.register = false
handler.group = true

export default handler

// ✅ Constantes necesarias
const botname = '🎧 CARLY | BOT'
const etiqueta = '© ⍴᥆ᥕᥱrᥱძ ᑲᥡ ᗪ卂尺Ҝ'
const vs = '1.0.0'
const emoji = '🧠'

// ✅ Análisis de imagen
async function fetchImageBuffer(content, imageBuffer) {
  try {
    const response = await axios.post('https://Luminai.my.id', {
      content: content,
      imageBuffer: imageBuffer.toString('base64')
    }, {
      headers: { 'Content-Type': 'application/json' }
    })
    return response.data
  } catch (error) {
    console.error('Error en fetchImageBuffer:', error)
    throw error
  }
}

// ✅ Consulta a Luminai
async function luminsesi(q, username, logic) {
  try {
    const response = await axios.post("https://Luminai.my.id", {
      content: q,
      user: username,
      prompt: logic,
      webSearchMode: false
    })
    return response.data.result
  } catch (error) {
    console.error('Error en luminsesi:', error)
    throw error
  }
}