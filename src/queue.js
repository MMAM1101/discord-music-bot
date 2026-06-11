import {
  createAudioPlayer,
  createAudioResource,
  AudioPlayerStatus,
  VoiceConnectionStatus,
  entersState,
  NoSubscriberBehavior,
} from '@discordjs/voice';
import playdl from 'play-dl';

export class MusicQueue {
  constructor(guildId, voiceChannel, textChannel, connection) {
    this.guildId = guildId;
    this.voiceChannel = voiceChannel;
    this.textChannel = textChannel;
    this.connection = connection;
    this.songs = [];
    this.playing = false;
    this.loop = false;
    this.volume = 1;

    this.player = createAudioPlayer({
      behaviors: { noSubscriber: NoSubscriberBehavior.Pause },
    });

    this.connection.subscribe(this.player);

    this.player.on(AudioPlayerStatus.Idle, () => {
      if (this.loop && this.songs.length > 0) {
        this.play();
      } else {
        this.songs.shift();
        if (this.songs.length > 0) {
          this.play();
        } else {
          this.playing = false;
          this.textChannel.send('✅ انتهت قائمة التشغيل!');
          setTimeout(() => {
            if (!this.playing) {
              this.connection.destroy();
            }
          }, 30000);
        }
      }
    });

    this.player.on('error', (error) => {
      console.error('خطأ في المشغل:', error);
      this.textChannel.send('❌ حدث خطأ في التشغيل، جاري التخطي...');
      this.songs.shift();
      if (this.songs.length > 0) this.play();
    });

    this.connection.on(VoiceConnectionStatus.Disconnected, async () => {
      try {
        await Promise.race([
          entersState(this.connection, VoiceConnectionStatus.Signalling, 5_000),
          entersState(this.connection, VoiceConnectionStatus.Connecting, 5_000),
        ]);
      } catch {
        this.connection.destroy();
      }
    });
  }

  async play() {
    if (this.songs.length === 0) return;
    const song = this.songs[0];
    this.playing = true;

    try {
      let stream;
      if (song.url.includes('youtube.com') || song.url.includes('youtu.be')) {
        const source = await playdl.stream(song.url, { quality: 2 });
        stream = createAudioResource(source.stream, {
          inputType: source.type,
          inlineVolume: true,
        });
      } else {
        const source = await playdl.stream(song.url, { quality: 2 });
        stream = createAudioResource(source.stream, {
          inputType: source.type,
          inlineVolume: true,
        });
      }

      stream.volume?.setVolume(this.volume);
      this.player.play(stream);
      this.textChannel.send(`🎵 جاري التشغيل: **${song.title}** (${song.duration})`);
    } catch (error) {
      console.error('خطأ في تشغيل الأغنية:', error);
      this.textChannel.send(`❌ تعذر تشغيل: **${song.title}**`);
      this.songs.shift();
      if (this.songs.length > 0) this.play();
    }
  }

  addSong(song) {
    this.songs.push(song);
  }

  skip() {
    this.player.stop();
  }

  stop() {
    this.songs = [];
    this.player.stop();
    this.playing = false;
  }

  pause() {
    this.player.pause();
  }

  resume() {
    this.player.unpause();
  }

  setVolume(vol) {
    this.volume = vol / 100;
    const resource = this.player.state?.resource;
    resource?.volume?.setVolume(this.volume);
  }

  toggleLoop() {
    this.loop = !this.loop;
    return this.loop;
  }

  getQueue() {
    return this.songs;
  }

  isPlaying() {
    return this.player.state.status === AudioPlayerStatus.Playing;
  }

  isPaused() {
    return this.player.state.status === AudioPlayerStatus.Paused;
  }
}
