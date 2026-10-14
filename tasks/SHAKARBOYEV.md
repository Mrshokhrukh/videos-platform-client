# Shakarboyev — Video Yuklash (Bunny.net) va Video Player
**Branch:** `feat/shakarboyev/video-upload`

---

## Sen nima qilasan?

Sen platformaning video tizimini qurasан:
- Admin darsni Bunny.net ga yuklaydi — **shu jarayonning UI** sening vazifang
- Yuklangan video stream qilib ko'rsatiladi — **player** ham sening vazifang

---

## Muhim: Bu tizimda kim video yuklaydi?

**Faqat Admin!** Talabalar video yuklamaydi.
Shu sababli video yuklash sahifasi faqat `/admin/...` yo'lida bo'ladi.

---

## 1-VAZIFA — `.env.local` fayli

Loyiha papkasida `.env.local` fayli yarating (git ga yuklanmaydi):

```
VITE_BUNNY_STREAM_API_KEY=...
VITE_BUNNY_LIBRARY_ID=...
VITE_BUNNY_STORAGE_API_KEY=...
VITE_BUNNY_STORAGE_ZONE=...
VITE_BUNNY_STORAGE_HOSTNAME=storage.bunnycdn.com
VITE_BUNNY_PULL_ZONE=https://sizning-pullzone.b-cdn.net
```

`README.md` faylida bu o'zgaruvchilarni qayerdan olishni yozing.

---

## 2-VAZIFA — `src/lib/bunny.js`

Bunny.net bilan muloqot funksiyalari. Bu faqat frontend kodi — HTTP so'rovlar.

### Bunny.net da video yuklash 3 qadam:

```
1-qadam: Bunny.net da video "slot" yaratish  →  guid (video ID) olamiz
                    ↓
2-qadam: Shu ID ga haqiqiy video faylini yuklash (tus protokoli)
                    ↓
3-qadam: Bunny.net videoни o'zi encode qiladi → stream uchun tayyor bo'ladi
```

---

### Funksiya 1: `createVideo(title)`

**Nima qiladi:** Bunny.net da bo'sh video slot yaratadi, uning IDsini qaytaradi.

**So'rov qilish kerak bo'lgan URL:**
```
POST https://video.bunnycdn.com/library/{LIBRARY_ID}/videos
```

**Headerlar:**
```
AccessKey: {VITE_BUNNY_STREAM_API_KEY}
Content-Type: application/json
```

**Body:**
```json
{ "title": "Dars nomi" }
```

**Javobdan nima olasiz:**
JSON ob'ekt qaytadi, uning ichidan `guid` olasan — bu video ID.

---

### Funksiya 2: `uploadVideoTus(videoId, file, onProgress)`

**Nima qiladi:** Video faylni Bunny.net ga `tus` protokoli orqali yuklaydi.

**O'rnatish kerak:**
```
npm install tus-js-client crypto-js
```

**Tus endpoint:**
```
https://video.bunnycdn.com/tusupload
```

**Tus headerlar (Bunny docs dan):**
- `AuthorizationSignature` — SHA256 hash:
  - hash = SHA256( libraryId + apiKey + expirationTime + videoId )
  - `crypto-js` paketi bilan hisoblash
- `AuthorizationExpire` — 1 soatdan keyingi vaqt (Unix timestamp)
- `VideoId` — yaratilgan video IDsi
- `LibraryId` — kutubxona IDsi

**`onProgress` parametri:**
Yuklash jarayonida bu funksiya chaqiriladi.
Parametrlar: `(uploadedBytes, totalBytes)`
Foiz: `Math.round((uploadedBytes / totalBytes) * 100)`

**Bekor qilish:**
tus upload ob'ektini `useRef` da saqlash kerak — `cancel()` chaqirilganda `upload.abort()` deyiladi.

---

### Funksiya 3: `uploadThumbnail(lessonId, file)`

**Nima qiladi:** Dars uchun thumbnail rasmni Bunny Storage ga yuklaydi.

**So'rov:**
```
PUT https://{hostname}/{storageZone}/thumbnails/{lessonId}.jpg
```

**Headerlar:**
```
AccessKey: {VITE_BUNNY_STORAGE_API_KEY}
Content-Type: image/jpeg
```

**Body:** fayl binary (to'g'ridan-to'g'ri fayl ob'ekti)

---

### Funksiya 4: `getVideoEmbedUrl(videoId)`

Video ko'rish uchun iframe URL qaytaradi.
```
https://iframe.mediadelivery.net/embed/{LIBRARY_ID}/{videoId}?autoplay=false&responsive=true&preload=true
```

---

### Funksiya 5: `deleteVideo(videoId)`

Bunny.net dan videoni o'chiradi.
```
DELETE https://video.bunnycdn.com/library/{LIBRARY_ID}/videos/{videoId}
```

---

## 3-VAZIFA — `src/hooks/useVideoUpload.js`

Yuklash jarayonini boshqaradigan React hook.

### Nima saqlashi kerak (state):

| State | Nima | Qiymatlar |
|-------|------|-----------|
| `status` | Hozirgi holat | `"idle"` `"creating"` `"uploading"` `"done"` `"error"` |
| `progress` | Foiz | 0 dan 100 gacha |
| `speed` | Tezlik | Bayt/soniya |
| `timeLeft` | Qolgan vaqt | Soniyalarda |
| `videoId` | Bunny video ID | String yoki null |
| `error` | Xato xabari | String yoki null |

### Funksiyalar:

**`upload(file, lessonData)`** — asosiy:
1. `status = "creating"` — `createVideo()` chaqir, guid ol
2. `status = "uploading"` — `uploadVideoTus()` chaqir
   - `onProgress` da progress, speed, timeLeft hisoblash
   - Speed: `(newBytes - oldBytes) / timeDiff`
   - TimeLeft: `remainingBytes / speed`
3. Thumbnail bor bo'lsa — `uploadThumbnail()` chaqir
4. `status = "done"`, `videoId` ni saqlash

**`cancel()`:**
- tus upload ni to'xtatish (`uploadRef.current.abort()`)
- `status = "idle"`, `progress = 0`

**`reset()`:**
- Hamma statelarni boshlang'ich holatga qaytarish

---

## 4-VAZIFA — Dars yuklash sahifasi (Admin)

**Fayl:** `src/pages/admin/videos/UploadLessonPage.jsx`

URL: `/admin/groups/:groupId/upload`

Bu sahifa **faqat admin** ko'ra oladi.
Yuqori qismda qaysi guruhga yuklanayotgani ko'rinsin: "React guruhi → Yangi dars qo'shish"

---

### Ko'rinishi — 4 bosqichli:

**Stepper:**
```
  [1. Fayl ✓]───[2. Ma'lumot ✓]───[3. Yuklash ...]───[4. Tayyor]
```

---

### 1-bosqich: Video fayl tanlash

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│              ☁️                                        │
│      Video faylni shu yerga tashlang                   │
│                   yoki                                 │
│            [ 📂 Fayl tanlash ]                         │
│                                                        │
│   Qabul qilinadi: MP4, MOV, AVI, MKV, WebM            │
│   Maksimal hajm: 10 GB                                 │
│                                                        │
└────────────────────────────────────────────────────────┘
```

Fayl tanlangandan keyin:
```
✅ dars1_react_hooks.mp4
   2.3 GB  ·  MP4        [ ✕ O'zgartirish ]
```

**Tekshirish:**
- Format `video/` bilan boshlanishi kerak
- 10 GB dan katta bo'lsa xato: "Fayl hajmi 10 GB dan oshmasligi kerak"

---

### 2-bosqich: Dars ma'lumotlari

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  Dars sarlavhasi *                                     │
│  [ ____________________________________________ ] 0/100 │
│                                                        │
│  Dars haqida                                           │
│  [ ____________________________________________ ]      │
│  [ ____________________________________________ ] 0/2000│
│                                                        │
│  Tartib raqami *                                       │
│  [ 1 ]   (guruh darslar ro'yxatidagi o'rni)            │
│                                                        │
│  Thumbnail (ixtiyoriy)                                 │
│  [ + Rasm yuklash ]  →  [👁 preview]                   │
│  JPEG yoki PNG, maks 5 MB                              │
│                                                        │
│  Holat                                                 │
│  (●) Nashr qilish (talabalar ko'ra oladi)              │
│  (○) Qoralama (hozircha yashirin)                      │
│                                                        │
│  [← Orqaga]               [Keyingi →]                  │
└────────────────────────────────────────────────────────┘
```

---

### 3-bosqich: Yuklash jarayoni

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  📹 dars1_react_hooks.mp4 yuklanmoqda...               │
│                                                        │
│  ██████████████████░░░░░░░░░░░░░  62%                  │
│                                                        │
│  1.42 GB / 2.3 GB                                      │
│  Tezlik: 4.2 MB/s   ·   Qoldi: ~3 daqiqa              │
│                                                        │
│              [ ✕ Bekor qilish ]                        │
│                                                        │
└────────────────────────────────────────────────────────┘
```

"Bekor qilish" bosilganda tasdiqlash dialogi chiqsin:
```
"Yuklashni to'xtatmoqchimisiz?
Hozircha yuklangan qism saqlanmaydi."

[Davom eting]   [Ha, to'xtat]
```

---

### 4-bosqich: Muvaffaqiyatli yuklandi

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│              ✅                                        │
│       Dars muvaffaqiyatli yuklandi!                    │
│                                                        │
│  Bunny.net videони qayta ishlamoqda (1-2 daqiqa).      │
│  Talabalar uni tez orada ko'ra olishadi.               │
│                                                        │
│  [ Guruhga qaytish ]    [ + Yana dars qo'shish ]       │
│                                                        │
└────────────────────────────────────────────────────────┘
```

---

## 5-VAZIFA — Video Player komponenti

**Fayl:** `src/components/video/VideoPlayer.jsx`

Bu komponent darsni ko'rsatadi. Bunny.net ning embed player i ishlatiladi.

### Ko'rinishi:

```
┌────────────────────────────────────────────────────────┐
│                                                        │
│  [Bunny.net iframe player — 16:9 nisbat]               │
│                                                        │
│  Yuklanayotganda: markazda aylanuvchi ikonka ko'rinsin  │
│                                                        │
└────────────────────────────────────────────────────────┘
```

### Qoidalar:
- `aspect-video` class bilan 16:9 nisbat saqlansin
- iframe yuklayotganda spinner ko'rinsin, yuklangandan keyin o'chsin
- Xato bo'lsa (iframe load bo'lmasa) xato holati ko'rinsin:
  ```
  ⚠️ Video yuklanmadi.
  [ 🔄 Qayta urinish ]
  ```
- Iframe fullscreen bo'lishi uchun `allowFullScreen` attribute bo'lsin

### Bunny.net iframe URL formati:
```
https://iframe.mediadelivery.net/embed/{LIBRARY_ID}/{videoId}?autoplay=false&responsive=true
```

---

## 6-VAZIFA — Dars kartochkasi (Admin uchun)

**Fayl:** `src/components/video/LessonCard.jsx`

Admin guruh sahifasida darslar ro'yxatida ko'rinadigan kartochka.

```
┌────────────────────────────────────────────────────────┐
│  [🎬]  1. React Hooks asoslari                [⋮]     │
│        Davomiyligi: 45:30   ·   Nashr qilingan ✅      │
│        Qo'shilgan: 3 kun oldin                         │
└────────────────────────────────────────────────────────┘
```

**`[⋮]` dropdown (faqat admin ko'radi):**
- Tahrirlash
- Nashr/Qoralama qilish
- O'chirish (tasdiqlash dialogi bilan)

---

## Shakarboyev uchun eslatmalar

1. **Birinchi kun:** `.env.local` fayli, `bunny.js` (createVideo va uploadVideoTus)
2. **Ikkinchi kun:** `useVideoUpload` hook, yuklash sahifasining 1-2-bosqichi
3. **Uchinchi kun:** Yuklash sahifasining 3-4-bosqichi
4. **To'rtinchi kun:** `VideoPlayer` komponenti, `LessonCard` komponenti

**Bunny.net kalitlarni olish:**
- `app.bunny.net` → Stream → API kalitlar

**Muhim xatolar:**
- `401` → API kalit noto'g'ri
- `400` → so'rov formati noto'g'ri
- CORS xatosi bo'lsa → Bunny.net dashboard da CORS sozlash kerak
