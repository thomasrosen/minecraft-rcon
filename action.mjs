import { Rcon } from "rcon-client"

await import("dotenv").then((m) => m.config())

async function sendMessage2discord(content) {
  const webhook = process.env.DISCORD_WEBHOOK

  if (!webhook) {
    console.log('No webhook provided')
    return
  }

  await fetch(webhook, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ content }),
  })
}

async function sendPlayerInfo2discord() {
  if (!process.env.RCON_HOST || !process.env.RCON_PORT || !process.env.RCON_PASSWORD) {
    console.error("Missing RCON_HOST, RCON_PORT, or RCON_PASSWORD")
    return
  }

  const rcon = await Rcon.connect({
    host: process.env.RCON_HOST,
    port: process.env.RCON_PORT,
    password: process.env.RCON_PASSWORD
  })

  const playersInfo = await rcon.send("list")
  console.log(playersInfo)
  sendMessage2discord(playersInfo)

  rcon.end()
}

sendPlayerInfo2discord()
