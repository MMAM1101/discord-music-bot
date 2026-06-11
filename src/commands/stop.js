import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('إيقاف الموسيقى ومسح القائمة'),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player) {
      return interaction.reply({ content: '❌ لا يوجد شيء يعمل الآن!', ephemeral: true });
    }
    await player.destroy();
    await interaction.reply('⏹️ تم إيقاف الموسيقى ومسح القائمة!');
  },
};
