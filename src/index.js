import { Client, GatewayIntentBits, Collection } from 'discord.js';
import { LavalinkManager } from 'lavalink-client';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildVoiceStates,
    GatewayIntentBits.MessageContent,
  ],
});

client.commands = new Collection();

client.lavalink = new LavalinkManager({
  nodes: [
    {
      authorization: process.env.LAVALINK_PASSWORD || 'youshallnotpass',
      host: process.env.LAVALINK_HOST || 'localhost',
      port: Number(process.env.LAVALINK_PORT) || 2333,
      id: 'main-node',
      ssl: process.env.LAVALINK_SSL === 'true',
    },
  ],
  sendToShard: (guildId, payload) =>
    client.guilds.cache.get(guildId)?.shard?.send(payload),
  client: {
    id: process.env.DISCORD_CLIENT_ID,
    username: 'Music Bot',
  },
  playerOptions: {
    defaultSearchPlatform: 'ytsearch',
    onDisconnect: { autoReconnect: true, destroyPlayer: false },
    onEmptyQueue: { destroyAfterMs: 30_000 },
  },
});

client.lavalink.nodeManager.on('connect', (node) => {
  console.log(`✅ Lavalink متصل: ${node.id}`);
});

client.lavalink.nodeManager.on('error', (node, error) => {
  console.error(`❌ خطأ في Lavalink node ${node.id}:`, error?.message);
});

client.lavalink.nodeManager.on('disconnect', (node) => {
  console.warn(`⚠️ Lavalink انقطع: ${node.id}`);
});

client.lavalink.on('trackStart', (player, track) => {
  const channel = client.channels.cache.get(player.textChannelId);
  channel?.send(`🎵 جاري التشغيل: **${track.info.title}** (${formatDuration(track.info.duration)})`);
});

client.lavalink.on('queueEnd', (player) => {
  const channel = client.channels.cache.get(player.textChannelId);
  channel?.send('✅ انتهت قائمة التشغيل!');
  setTimeout(() => player.destroy().catch(() => {}), 30_000);
});

client.lavalink.on('trackError', (player, track, error) => {
  const channel = client.channels.cache.get(player.textChannelId);
  channel?.send(`❌ خطأ في تشغيل: **${track?.info?.title ?? 'غير معروف'}**`);
  console.error('trackError:', error);
});

const commandFiles = readdirSync(join(__dirname, 'commands')).filter(f => f.endsWith('.js'));
for (const file of commandFiles) {
  const command = await import(pathToFileURL(join(__dirname, 'commands', file)).href);
  if (command.default?.data && command.default?.execute) {
    client.commands.set(command.default.data.name, command.default);
    console.log(`Loaded command: ${command.default.data.name}`);
  }
}

const eventFiles = readdirSync(join(__dirname, 'events')).filter(f => f.endsWith('.js'));
for (const file of eventFiles) {
  const event = await import(pathToFileURL(join(__dirname, 'events', file)).href);
  if (event.default?.once) {
    client.once(event.default.name, (...args) => event.default.execute(...args, client));
  } else if (event.default?.name) {
    client.on(event.default.name, (...args) => event.default.execute(...args, client));
  }
}

client.once('clientReady', async (c) => {
  console.log(`✅ البوت شغال كـ ${c.user.tag}`);
  c.user.setActivity('🎵 /play لتشغيل الموسيقى');
  await client.lavalink.init({ ...c.user });
  console.log('🔄 جاري الاتصال بـ Lavalink...');
});

const token = process.env.DISCORD_TOKEN;
if (!token) {
  console.error('خطأ: DISCORD_TOKEN غير موجود');
  process.exit(1);
}

client.login(token);

function formatDuration(ms) {
  if (!ms) return 'مباشر';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
