# 🎵 بوت الموسيقى - Discord Music Bot

بوت موسيقى لـ Discord مبني بـ discord.js v14 و @discordjs/voice

## الأوامر

| الأمر | الوصف |
|-------|-------|
| `/play [اسم أو رابط]` | تشغيل أغنية من يوتيوب |
| `/skip` | تخطي الأغنية الحالية |
| `/stop` | إيقاف الموسيقى ومسح القائمة |
| `/pause` | إيقاف مؤقت |
| `/resume` | استئناف التشغيل |
| `/queue` | عرض قائمة التشغيل |
| `/volume [1-100]` | ضبط مستوى الصوت |
| `/loop` | تفعيل/إلغاء التكرار |
| `/nowplaying` | عرض الأغنية الحالية |
| `/leave` | مغادرة القناة الصوتية |

## النشر على Railway

### متغيرات البيئة المطلوبة
```
DISCORD_TOKEN=your_bot_token
DISCORD_CLIENT_ID=your_client_id
```

### خطوات النشر
1. ارفع الملفات على GitHub
2. أنشئ مشروع جديد في Railway
3. اربط الـ Repository
4. أضف متغيرات البيئة
5. Railway سيبني ويشغل البوت تلقائياً عبر nixpacks.toml

### ملاحظات Railway
- ffmpeg مثبّت تلقائياً عبر nixpacks.toml
- البوت يعمل كـ worker (بدون HTTP server)
- تأكد من تعطيل "Generate Domain" في Railway لأن البوت لا يحتاج HTTP
