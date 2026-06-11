import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('إيقاف مؤقت'),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player?.playing || player.paused) {
      return interaction.reply({ content: '❌ لا يوجد شيء يعمل الآن!', ephemeral: true });
    }
    await player.pause();
    await interaction.reply('⏸️ تم الإيقاف المؤقت!');
  },
};
