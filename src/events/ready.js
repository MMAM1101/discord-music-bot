export default {
  name: 'clientReady',
  once: true,
  execute(client) {
    console.log(`✅ البوت شغال كـ ${client.user.tag}`);
    client.user.setActivity('🎵 /play لتشغيل الموسيقى');
  },
};
