import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('leave')
    .setDescription('مغادرة القناة الصوتية'),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (player) await player.destroy();
    await interaction.reply('👋 وداعاً!');
  },
};
