import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('تغيير وضع التكرار')
    .addStringOption(o =>
      o.setName('mode')
        .setDescription('وضع التكرار')
        .setRequired(true)
        .addChoices(
          { name: 'إيقاف', value: 'off' },
          { name: 'الأغنية الحالية', value: 'track' },
          { name: 'كامل القائمة', value: 'queue' },
        )
    ),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player) {
      return interaction.reply({ content: '❌ لا يوجد شيء يعمل!', ephemeral: true });
    }
    const mode = interaction.options.getString('mode');
    await player.setRepeatMode(mode);
    const labels = { off: '➡️ إيقاف', track: '🔂 الأغنية الحالية', queue: '🔁 كامل القائمة' };
    await interaction.reply(`وضع التكرار: ${labels[mode]}`);
  },
};
