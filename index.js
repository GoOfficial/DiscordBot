require('dotenv').config();
const { Client, GatewayIntentBits, ActivityType, TextChannel } = require('discord.js');
const express = require('express');

const client = new Client({
  intents: Object.keys(GatewayIntentBits).map(key => GatewayIntentBits[key]),
});

const app = express();
const port = 3000;

app.get('/', (req, res) => res.send('YaY Your Bot Status Changed✨'));
app.listen(port, () => {
  console.log(`🔗 Listening at http://localhost:${port}`);
  console.log('🔗 Powered By Foulz');
});

const statusMessages = ["axiomsoftworks.com", "foulz.xyz"];
let currentIndex = 0;

const channelId = '';

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log(`✅ Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

async function setBotStatus() {
  try {
    const currentStatus = statusMessages[currentIndex];
    await client.user.setPresence({
      activities: [{ name: currentStatus, type: ActivityType.Custom }],
      status: 'dnd',
    });
    console.log(`🔄 Status updated to "${currentStatus}"`);

    if (channelId) {
      const channel = client.channels.cache.get(channelId);
      if (channel instanceof TextChannel) {
        channel.send(`Bot status is: ${currentStatus}`);
      }
    }

    currentIndex = (currentIndex + 1) % statusMessages.length;
  } catch (err) {
    console.error('Error updating status:', err);
  }
}

const DEFAULT_BIO = "Axiom Support for Axiom Softworks";
let bioBackoffMs = 60_000; 

async function setAboutMeSafe() {
  try {
    if (!client.application || !client.application.id) await client.application.fetch();
    await client.application.edit({ description: DEFAULT_BIO });
    console.log('📝 About Me updated:', DEFAULT_BIO);
    bioBackoffMs = 60_000; // reset backoff on success
  } catch (err) {
    if (err?.status === 429 || err?.response?.status === 429) {
      const retryAfter = err.response?.headers?.['retry-after'] || err?.retry_after;
      const wait = retryAfter ? Number(retryAfter) * 1000 : bioBackoffMs;
      console.warn(`⚠️ Rate limited. Backing off ${wait}ms`);
      bioBackoffMs = Math.min(bioBackoffMs * 2, 10 * 60_000); 
      setTimeout(setAboutMeSafe, wait);
      return;
    }
    console.error('Failed to set About Me:', err?.response?.data || err?.message || err);
  }
}

client.once('ready', async () => {
  console.log(`✅ Bot is ready as ${client.user.tag}`);
  console.log('💉 Status enforcer running...');

  await setAboutMeSafe();

  setInterval(setAboutMeSafe, 60_000);

  await setBotStatus();

  setInterval(setBotStatus, 10_000);
});

login();
