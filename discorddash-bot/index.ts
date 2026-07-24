import 'dotenv/config'; // MUST BE FIRST
import { Client, GatewayIntentBits, Events } from 'discord.js';
import { prisma } from './src/db.js';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent, // Required for message counting, though content is ignored
  ],
});

// 1. Ready Event: Sync Servers
client.once(Events.ClientReady, async (readyClient) => {
  console.log(`Bot is ready! Logged in as ${readyClient.user.tag}`);

  // Sync guilds (servers) to DB
  for (const [guildId, guild] of readyClient.guilds.cache) {
    try {
      await prisma.server.upsert({
        where: { id: guildId },
        update: {
          name: guild.name,
          iconUrl: guild.iconURL(),
          ownerId: guild.ownerId,
        },
        create: {
          id: guildId,
          name: guild.name,
          iconUrl: guild.iconURL(),
          ownerId: guild.ownerId,
        },
      });
      // Sync members
      console.log(`Fetching members for ${guild.name}...`);
      const members = await guild.members.fetch();
      let memberCount = 0;
      for (const [memberId, member] of members) {
        if (!member.user.bot) {
          try {
            await prisma.member.upsert({
              where: { id: memberId },
              update: { username: member.user.username },
              create: {
                id: memberId,
                username: member.user.username,
                joinedAt: member.joinedAt ?? new Date(),
                serverId: guildId,
              },
            });
            memberCount++;
          } catch (e) {
            console.error(`Error syncing member ${member.user.username}:`, e);
          }
        }
      }
      console.log(`Synced server: ${guild.name} (${guildId}) with ${memberCount} members`);
    } catch (error) {
      console.error(`Failed to sync server ${guild.name}:`, error);
    }
  }
});

// 2. Guild Member Add Event
client.on(Events.GuildMemberAdd, async (member) => {
  if (member.user.bot) return;

  try {
    await prisma.member.upsert({
      where: { id: member.id },
      update: {
        username: member.user.username,
        joinedAt: member.joinedAt ?? new Date(),
        leftAt: null, // Reset leftAt if they rejoin
      },
      create: {
        id: member.id,
        username: member.user.username,
        joinedAt: member.joinedAt ?? new Date(),
        serverId: member.guild.id,
      },
    });
    console.log(`Recorded member join: ${member.user.username} in ${member.guild.name}`);
  } catch (error) {
    console.error(`Failed to record member join for ${member.user.username}:`, error);
  }
});

// 3. Guild Member Remove Event
client.on(Events.GuildMemberRemove, async (member) => {
  if (member.user.bot) return;

  try {
    await prisma.member.update({
      where: { id: member.id },
      data: { leftAt: new Date() },
    });
    console.log(`Recorded member leave: ${member.user.username} from ${member.guild.name}`);
  } catch (error) {
    // Member might not exist in DB if they joined before the bot was added, ignore or log
    console.warn(`Member ${member.user.username} left, but wasn't found in DB.`);
  }
});

// 4. Message Create Event
client.on(Events.MessageCreate, async (message) => {
  if (message.author.bot || !message.guildId) return;

  try {
    // Make sure the author exists in the Member table before associating the message
    // If not, we might need to upsert the member here as a fallback
    await prisma.member.upsert({
      where: { id: message.author.id },
      update: { username: message.author.username },
      create: {
        id: message.author.id,
        username: message.author.username,
        joinedAt: message.member?.joinedAt ?? new Date(),
        serverId: message.guildId,
      },
    });

    // Save message metadata (strictly NO content)
    await prisma.message.create({
      data: {
        id: message.id,
        channelId: message.channelId,
        channelName: (message.channel as any).name ?? 'unknown-channel',
        authorId: message.author.id,
        serverId: message.guildId,
        createdAt: message.createdAt,
      },
    });
    
    // Silently log or do nothing, to avoid console spam in highly active servers
  } catch (error) {
    console.error(`Failed to record message metadata for ${message.id}:`, error);
  }
});

client.login(process.env.DISCORD_BOT_TOKEN);
