"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./src/db");
dotenv_1.default.config(); // Load .env from current folder
const client = new discord_js_1.Client({
    intents: [
        discord_js_1.GatewayIntentBits.Guilds,
        discord_js_1.GatewayIntentBits.GuildMembers,
        discord_js_1.GatewayIntentBits.GuildMessages,
        discord_js_1.GatewayIntentBits.MessageContent, // Required for message counting, though content is ignored
    ],
});
// 1. Ready Event: Sync Servers
client.once(discord_js_1.Events.ClientReady, async (readyClient) => {
    console.log(`Bot is ready! Logged in as ${readyClient.user.tag}`);
    // Sync guilds (servers) to DB
    for (const [guildId, guild] of readyClient.guilds.cache) {
        try {
            await db_1.prisma.server.upsert({
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
            console.log(`Synced server: ${guild.name} (${guildId})`);
        }
        catch (error) {
            console.error(`Failed to sync server ${guild.name}:`, error);
        }
    }
});
// 2. Guild Member Add Event
client.on(discord_js_1.Events.GuildMemberAdd, async (member) => {
    if (member.user.bot)
        return;
    try {
        await db_1.prisma.member.upsert({
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
    }
    catch (error) {
        console.error(`Failed to record member join for ${member.user.username}:`, error);
    }
});
// 3. Guild Member Remove Event
client.on(discord_js_1.Events.GuildMemberRemove, async (member) => {
    if (member.user.bot)
        return;
    try {
        await db_1.prisma.member.update({
            where: { id: member.id },
            data: { leftAt: new Date() },
        });
        console.log(`Recorded member leave: ${member.user.username} from ${member.guild.name}`);
    }
    catch (error) {
        // Member might not exist in DB if they joined before the bot was added, ignore or log
        console.warn(`Member ${member.user.username} left, but wasn't found in DB.`);
    }
});
// 4. Message Create Event
client.on(discord_js_1.Events.MessageCreate, async (message) => {
    if (message.author.bot || !message.guildId)
        return;
    try {
        // Make sure the author exists in the Member table before associating the message
        // If not, we might need to upsert the member here as a fallback
        await db_1.prisma.member.upsert({
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
        await db_1.prisma.message.create({
            data: {
                id: message.id,
                channelId: message.channelId,
                channelName: message.channel.name ?? 'unknown-channel',
                authorId: message.author.id,
                serverId: message.guildId,
                createdAt: message.createdAt,
            },
        });
        // Silently log or do nothing, to avoid console spam in highly active servers
    }
    catch (error) {
        console.error(`Failed to record message metadata for ${message.id}:`, error);
    }
});
client.login(process.env.DISCORD_BOT_TOKEN);
//# sourceMappingURL=index.js.map