import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('عرض قائمة التشغيل'),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player || (!player.queue.current && !player.queue.tracks.length)) {
      return interaction.reply({ content: '❌ قائمة التشغيل فارغة!', ephemeral: true });
    }

    const current = player.queue.current;
    const upcoming = player.queue.tracks.slice(0, 9);

    const embed = new EmbedBuilder()
      .setTitle('🎵 قائمة التشغيل')
      .setColor(0x7289DA);

    let desc = '';
    if (current) {
      desc += `▶️ **${current.info.title}** (${formatDuration(current.info.duration)})\n\n`;
    }
    if (upcoming.length) {
      desc += upcoming.map((t, i) => `${i + 1}. **${t.info.title}** (${formatDuration(t.info.duration)})`).join('\n');
    }

    embed.setDescription(desc || 'لا يوجد أغاني قادمة');
    embed.setFooter({ text: `إجمالي: ${player.queue.tracks.length + (current ? 1 : 0)} أغنية` });

    await interaction.reply({ embeds: [embed] });
  },
};

function formatDuration(ms) {
  if (!ms) return 'مباشر';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}
