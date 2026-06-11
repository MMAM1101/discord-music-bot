import { SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('شغّل أغنية من يوتيوب أو SoundCloud')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('رابط أو اسم الأغنية')
        .setRequired(true)
    ),

  async execute(interaction, client) {
    await interaction.deferReply();

    const voiceChannel = interaction.member.voice?.channel;
    if (!voiceChannel) {
      return interaction.editReply('❌ يجب أن تكون في قناة صوتية أولاً!');
    }

    const perms = voiceChannel.permissionsFor(interaction.client.user);
    if (!perms.has('Connect') || !perms.has('Speak')) {
      return interaction.editReply('❌ ليس لدي صلاحية الانضمام أو التحدث في قناتك!');
    }

    const query = interaction.options.getString('query');

    try {
      let player = client.lavalink.getPlayer(interaction.guildId);

      if (!player) {
        player = await client.lavalink.createPlayer({
          guildId: interaction.guildId,
          voiceChannelId: voiceChannel.id,
          textChannelId: interaction.channelId,
          selfDeaf: true,
          volume: 80,
        });
      }

      if (!player.connected) await player.connect();

      const res = await player.search(
        { query, source: 'ytsearch' },
        interaction.user
      );

      if (!res || !res.tracks?.length) {
        return interaction.editReply('❌ لم يتم إيجاد نتائج!');
      }

      if (res.loadType === 'playlist') {
        for (const track of res.tracks) {
          await player.queue.add(track);
        }
        await interaction.editReply(`✅ تمت إضافة playlist: **${res.playlist?.title}** (${res.tracks.length} أغنية)`);
      } else {
        const track = res.tracks[0];
        await player.queue.add(track);
        if (player.queue.tracks.length > 1 || player.playing) {
          await interaction.editReply(`✅ تمت الإضافة: **${track.info.title}** — الموضع: ${player.queue.tracks.length}`);
        } else {
          await interaction.editReply(`▶️ جاري التحميل...`);
        }
      }

      if (!player.playing) await player.play();
    } catch (error) {
      console.error('خطأ في /play:', error);
      await interaction.editReply('❌ حدث خطأ. تأكد أن Lavalink server شغال.');
    }
  },
};
