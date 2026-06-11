import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('استئناف التشغيل'),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player?.paused) {
      return interaction.reply({ content: '❌ الأغنية ليست موقوفة!', ephemeral: true });
    }
    await player.resume();
    await interaction.reply('▶️ تم الاستئناف!');
  },
};
