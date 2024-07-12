import { Rcon } from "rcon-client";
import { loadFileFromGit } from './loadFileFromGit.mjs';
import { saveKeyValue } from './saveKeyValue.mjs';

await import("dotenv").then((m) => m.config())

async function sendMessage2discord(content) {
  const webhook = process.env.DISCORD_WEBHOOK

  if (!webhook) {
    console.error('No webhook provided')
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

function loadCachePlayersInfo() {
  return loadFileFromGit({ repoUrl: process.env.GIT_REPO_URL, filePath: process.env.CACHE_FILE_PATH, branch: 'main' })
}
function saveCachePlayersInfo(playersInfo) {
  return saveKeyValue({
    repoUrl: process.env.REPO_GIT_REPO_URLURL,
    key: process.env.CACHE_FILE_PATH,
    value: playersInfo,
  }).then(() => {
    console.info('Key-value pair saved successfully');
  }).catch(error => {
    console.error('Failed to save key-value pair:', error);
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
  rcon.end()

  const cachedPlayersInfo = await loadCachePlayersInfo()
  if (playersInfo === cachedPlayersInfo) {
    console.info('No changes in players info')
    return
  }

  console.info(playersInfo)
  sendMessage2discord(playersInfo)
  saveCachePlayersInfo(playersInfo)
}

sendPlayerInfo2discord()


