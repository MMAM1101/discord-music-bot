import { REST, Routes } from 'discord.js';
import { readdirSync } from 'fs';
import { fileURLToPath, pathToFileURL } from 'url';
import { dirname, join } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));

const token = process.env.DISCORD_TOKEN;
const clientId = process.env.DISCORD_CLIENT_ID;

if (!token || !clientId) {
  console.error('خطأ: DISCORD_TOKEN أو DISCORD_CLIENT_ID غير موجودين');
  process.exit(1);
}

const commands = [];
const commandFiles = readdirSync(join(__dirname, 'commands')).filter(f => f.endsWith('.js'));

for (const file of commandFiles) {
  const command = await import(pathToFileURL(join(__dirname, 'commands', file)).href);
  if (command.default?.data) {
    commands.push(command.default.data.toJSON());
  }
}

const rest = new REST().setToken(token);

try {
  console.log(`جاري تسجيل ${commands.length} أوامر...`);
  const data = await rest.put(
    Routes.applicationCommands(clientId),
    { body: commands },
  );
  console.log(`تم تسجيل ${data.length} أوامر بنجاح!`);
} catch (error) {
  console.error('خطأ في تسجيل الأوامر:', error);
}
