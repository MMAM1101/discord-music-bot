import { SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setDescription('الأغنية الحالية'),

  async execute(interaction, client) {
    const player = client.lavalink.getPlayer(interaction.guildId);
    if (!player?.queue.current) {
      return interaction.reply({ content: '❌ لا يوجد شيء يعمل!', ephemeral: true });
    }

    const track = player.queue.current;
    const pos = player.position;
    const dur = track.info.duration;

    const bar = buildBar(pos, dur, 20);
    const status = player.paused ? '⏸️' : '▶️';

    const embed = new EmbedBuilder()
      .setTitle('🎵 يعمل الآن')
      .setColor(0x7289DA)
      .setDescription(`**[${track.info.title}](${track.info.uri})**`)
      .addFields(
        { name: 'المدة', value: `${status} ${formatDuration(pos)} ${bar} ${formatDuration(dur)}`, inline: false },
        { name: 'الفنان', value: track.info.author || 'غير معروف', inline: true },
        { name: 'الصوت', value: `${player.volume}%`, inline: true },
        { name: 'التكرار', value: { off: '➡️', track: '🔂', queue: '🔁' }[player.repeatMode] || '➡️', inline: true },
      );

    if (track.info.artworkUrl) embed.setThumbnail(track.info.artworkUrl);

    await interaction.reply({ embeds: [embed] });
  },
};

function formatDuration(ms) {
  if (!ms) return '0:00';
  const totalSec = Math.floor(ms / 1000);
  const m = Math.floor(totalSec / 60);
  const s = totalSec % 60;
  return `${m}:${s.toString().padStart(2, '0')}`;
}

function buildBar(pos, dur, size) {
  if (!dur) return '─'.repeat(size);
  const filled = Math.round((pos / dur) * size);
  return '─'.repeat(filled) + '🔘' + '─'.repeat(Math.max(0, size - filled - 1));
}
