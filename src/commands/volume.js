import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('ضبط الصوت')
    .addIntegerOption(o =>
      o.setName('level').setDescription('1-100').setRequired(true).setMinValue(1).setMaxValue(100)
    ),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player?.playing) {
      return interaction.reply({ content: '❌ لا يوجد شيء يعمل!', ephemeral: true });
    }
    const level = interaction.options.getInteger('level');
    await player.setVolume(level);
    await interaction.reply(`🔊 الصوت: ${level}%`);
  },
};
