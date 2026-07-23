import { Client, GatewayIntentBits } from 'discord.js';
import dotenv from 'dotenv';

dotenv.config(); // Load .env from current folder

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

client.once('ready', () => {
  console.log(`Bot is ready! Logged in as ${client.user?.tag}`);
});

// Avoid saving message content as per Data Privacy rules
client.on('messageCreate', async (message) => {
  if (message.author.bot) return;
  // TODO: Save message metadata to DB
  console.log(`Message from ${message.author.username} in ${message.channelId}`);
});

client.login(process.env.DISCORD_BOT_TOKEN);
