const { Client, GatewayIntentBits } = require('discord.js');
require('dotenv').config();
const express = require('express');

const client = new Client({
  intents: Object.keys(GatewayIntentBits).map((a) => GatewayIntentBits[a]),
});

const app = express();
const port = 3000;

app.get('/', (req, res) => {
  res.send('YaY Your Bot Description Changed✨');
});

app.listen(port, () => {
  console.log(`🔗 Listening: http://localhost:${port}`);
  console.log(`🔗 Powered By Robinayush`);
});


const descriptions = [
  "This bot helps the Axiom community by answering questions",
  "Guides users with scripts and externals",
  "Provides updates, tips, and resources",
  "Your friendly Axiom assistant!",
];

let currentIndex = 0;

async function login() {
  try {
    await client.login(process.env.TOKEN);
    console.log(`✅ Logged in as ${client.user.tag}`);
  } catch (error) {
    console.error('Failed to log in:', error);
    process.exit(1);
  }
}

async function loopDescription() {
  const currentDescription = descriptions[currentIndex];

  try {
    await client.user.setDescription(currentDescription);
    console.log(`📝 Updated About Me to: ${currentDescription}`);
  } catch (error) {
    console.error('Failed to update description:', error);
  }

  currentIndex = (currentIndex + 1) % descriptions.length;
}

client.once('ready', () => {
  console.log(`✅ Bot is ready as ${client.user.tag}`);
  loopDescription();
  setInterval(loopDescription, 10000);
});

login();
