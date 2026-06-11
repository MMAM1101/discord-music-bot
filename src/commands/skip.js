import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('تخطي الأغنية الحالية'),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player?.playing) {
      return interaction.reply({ content: '❌ لا يوجد شيء يعمل الآن!', ephemeral: true });
    }
    await player.skip();
    await interaction.reply('⏭️ تم تخطي الأغنية!');
  },
};
