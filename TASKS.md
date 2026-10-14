# Video Platform — Frontend Jamoa Vazifalari

> **Stack:** React 19 · Vite · Tailwind CSS v4 · Shadcn UI · Lucide React · React Router v6  
> **Video CDN:** Bunny.net (Stream + Storage)  
> **Muhim:** Bu faqat **frontend** repo. Backend alohida repoda. Hozircha barcha ma'lumotlar `src/lib/mockData.js` dan keladi.

---

## Umumiy Qoidalar (Hammaga)

### Papka tuzilishi
```
src/
├── components/
│   ├── ui/           # Shadcn komponentlari (o'zgartirmang)
│   ├── layout/       # Header, Sidebar, MainLayout
│   ├── auth/         # Login, Register formlari
│   ├── video/        # VideoCard, VideoPlayer, VideoGrid...
│   ├── groups/       # GroupCard, GroupDetail...
│   ├── comments/     # CommentItem, CommentsSection...
│   └── chat/         # ChatList, ChatWindow...
├── pages/
│   ├── auth/         # LoginPage, RegisterPage
│   ├── home/         # HomePage
│   ├── video/        # VideoPage, UploadPage, SearchPage
│   ├── groups/       # GroupsPage, GroupDetailPage
│   ├── profile/      # ProfilePage
│   └── chat/         # ChatPage
├── hooks/            # useAuth, useVideos, useComments...
├── context/          # AuthContext, ThemeContext
├── lib/
│   ├── mockData.js   # Barcha mock ma'lumotlar
│   ├── api.js        # API funksiyalari (hozircha mock qaytaradi)
│   ├── bunny.js      # Bunny.net video yuklash
│   └── utils.js      # cn(), formatDate(), formatDuration()...
└── router/
    └── router.jsx    # Barcha route'lar
```

### API qatlami haqida
`src/lib/api.js` faylida barcha funksiyalar yoziladi. **Hozircha** bu funksiyalar `mockData.js` dan ma'lumot qaytaradi. Backend tayyor bo'lganda faqat `api.js` ichidagi funksiyalar o'zgartiriladi — komponentlar, hooklar o'zgarmaydi.

```js
// src/lib/api.js — namuna ko'rinishi
import { MOCK_VIDEOS, MOCK_USERS } from './mockData.js'

export async function getVideos(filters) {
  // Hozircha mock, keyinchalik: return fetch('/api/videos')
  await delay(500) // yuklanish effekti uchun
  return MOCK_VIDEOS
}

export async function getVideoById(id) {
  await delay(300)
  return MOCK_VIDEOS.find(v => v.id === id)
}
```

### Mock ma'lumotlar shakli
`src/lib/mockData.js` faylida quyidagi tuzilmada ma'lumotlar bo'lsin:

```js
// Foydalanuvchi
{ id, username, fullName, avatar, bio, coverImage,
  subscribersCount, subscriptionsCount, videosCount, createdAt }

// Video
{ id, title, description, thumbnail, videoId, // Bunny videoId
  duration, views, likes, dislikes, tags, category,
  visibility, // 'public' | 'group' | 'private'
  authorId, groupId, // null bo'lishi mumkin
  createdAt }

// Guruh
{ id, name, description, avatar, coverImage,
  visibility, // 'open' | 'closed' | 'secret'
  membersCount, category, ownerId, createdAt }

// Izoh
{ id, text, videoId, authorId, parentId, // null = asosiy izoh
  likes, createdAt, updatedAt }

// Chat xabari
{ id, text, chatId, senderId,
  type, // 'text' | 'image' | 'video'
  imageUrl, videoId, // type ga qarab
  status, // 'sent' | 'delivered' | 'read'
  createdAt }

// Chat
{ id, type, // 'direct' | 'group'
  name, avatar, // guruh chati uchun
  participantIds, lastMessage, unreadCount, updatedAt }
```

### Har bir komponentda uchta holat bo'lsin
```jsx
if (loading) return <SkeletonComponent />
if (error)   return <ErrorState message={error} onRetry={refetch} />
if (!data.length) return <EmptyState message="Hozircha hech narsa yo'q" />
return <ActualComponent />
```

### Branch nomlash
```
feat/behruz/foundation
feat/shakarboyev/video-upload
feat/shaxruz/video-player
feat/farzona/groups
feat/fariza/comments
feat/otabek/chat-profile
```

### Git commit qoidasi
```
feat(auth): add login form with validation
fix(video): fix player iframe aspect ratio
style(groups): update card hover animation
refactor(comments): extract CommentInput to separate file
```

### Tailwind + Shadcn qoidalari
- Klasslarni `cn()` (`src/lib/utils.js`) orqali birlashtiring
- Shadcn komponentlarini `npx shadcn add <component>` bilan qo'shing
- Dark mode uchun `dark:` prefixini ishlating, ThemeContext dan `theme` o'qing
- Ranglar uchun Tailwind o'zgaruvchilarini ishlating (`bg-primary`, `text-muted-foreground` va h.k.)

---

## Dasturchi 1 — Behruz
### Loyiha Asosi, Routing, Auth, Layout
**Branch:** `feat/behruz/foundation`

---

### Vazifa 1.1 — Yuqoridagi papka tuzilishini yarating

Barcha papkalarni bo'sh holda yarating (har biriga `.gitkeep` qo'ying).  
`src/lib/utils.js` faylini yarating:

```js
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// "2025-01-15T10:30:00Z" → "3 kun oldin"
export function formatDate(isoString) { ... }

// 125 → "2:05"
export function formatDuration(seconds) { ... }

// 1500000 → "1.5M", 25000 → "25K"
export function formatCount(number) { ... }
```

`npm install clsx tailwind-merge` o'rnating.

---

### Vazifa 1.2 — Mock ma'lumotlar va API qatlami

**`src/lib/mockData.js`** — kamida quyidagilarni yozing:
- 12 ta video (turli kategoriyalar, authorlar)
- 6 ta foydalanuvchi (o'zingizni ham qo'shing — bu login qiladigan user bo'ladi)
- 4 ta guruh (2 ta ochiq, 1 ta yopiq, 1 ta maxfiy)
- 20 ta izoh (bir nechta videoga, nested javoblar bilan)
- 3 ta chat (2 ta shaxsiy, 1 ta guruh)
- 15 ta chat xabari

**`src/lib/api.js`** — quyidagi funksiyalarni yozing (hozircha mock qaytaradi):

```js
// Auth
export async function loginUser(email, password) {}
export async function registerUser(data) {}
export async function getCurrentUser() {}

// Videolar
export async function getVideos(filters) {}  // { category, sort, page }
export async function getVideoById(id) {}
export async function getTrendingVideos() {}
export async function searchVideos(query) {}
export async function likeVideo(id) {}
export async function dislikeVideo(id) {}
export async function saveVideo(id) {}

// Foydalanuvchilar
export async function getUserByUsername(username) {}
export async function getUserVideos(userId) {}
export async function subscribeToUser(userId) {}

// Guruhlar
export async function getGroups() {}
export async function getGroupById(id) {}
export async function joinGroup(id) {}
export async function leaveGroup(id) {}
export async function createGroup(data) {}

// Izohlar
export async function getComments(videoId) {}
export async function addComment(videoId, text, parentId) {}
export async function deleteComment(id) {}
export async function likeComment(id) {}

// Chat
export async function getChats() {}
export async function getChatMessages(chatId) {}
export async function sendMessage(chatId, data) {}
```

Har bir funksiya `await delay(200-600)` bilan kutish effekti qilsin.

---

### Vazifa 1.3 — React Router sozlash

`npm install react-router-dom` o'rnating.

**`src/router/router.jsx`:**

```jsx
import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <ProtectedRoute><MainLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'video/:id', element: <VideoPage /> },
      { path: 'upload', element: <UploadPage /> },
      { path: 'search', element: <SearchPage /> },
      { path: 'groups', element: <GroupsPage /> },
      { path: 'groups/:id', element: <GroupDetailPage /> },
      { path: 'profile/:username', element: <ProfilePage /> },
      { path: 'chat', element: <ChatPage /> },
      { path: 'chat/:id', element: <ChatPage /> },
    ]
  },
  { path: '/login', element: <LoginPage /> },
  { path: '/register', element: <RegisterPage /> },
  { path: '*', element: <NotFoundPage /> },
])
```

**`src/router/ProtectedRoute.jsx`** — login qilmagan foydalanuvchini `/login` ga yo'naltirsin. `AuthContext` dan `isAuthenticated` va `loading` ni o'qisin. `loading === true` da spinner ko'rsatsin.

**`src/pages/*/index.jsx`** — har bir sahifa uchun bo'sh placeholder komponent yozing (boshqa dasturchilar to'ldiradi).

---

### Vazifa 1.4 — AuthContext

**`src/context/AuthContext.jsx`:**

```jsx
const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)      // { id, username, fullName, avatar, email }
  const [loading, setLoading] = useState(true) // birinchi tekshirish uchun

  // App yuklanayotganda localStorage token tekshirish
  useEffect(() => {
    const token = localStorage.getItem('token')
    if (token) {
      getCurrentUser().then(setUser).finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    const { user, token } = await loginUser(email, password)
    localStorage.setItem('token', token)
    setUser(user)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
```

---

### Vazifa 1.5 — ThemeContext (Dark/Light)

**`src/context/ThemeContext.jsx`:**
- `theme`: `'light'` yoki `'dark'`
- `toggleTheme()` funksiyasi
- `localStorage` ga saqlash
- `document.documentElement` ga `class="dark"` qo'yish/olib tashlash

---

### Vazifa 1.6 — Login sahifasi

**`src/pages/auth/LoginPage.jsx`**

Sahifa markazda, ikki ustunli (katta ekranda):
- **Chap ustun** — loyiha tasviri, slogan (dekorativ)
- **O'ng ustun** — login forma

Forma ichida Shadcn `Card` ishlatilsin:
```
Logo
"Xush kelibsiz" sarlavha

Email   [ input ]
Parol   [ input type=password, ko'rish/yashirish tugmasi ]
        [ ] Meni eslab qol          [Parolni unutdim?]

        [ Kirish (Button, full width) ]

"Akkauntingiz yo'qmi?  Ro'yxatdan o'ting"
```

- Forma yuborilganda `useAuth().login()` chaqirilsin
- Yuklanish: button `disabled`, ichida `Loader2` ikonka aylansin
- Xato: Shadcn `Alert` (variant="destructive") formaning tepasida
- Muvaffaqiyatli: `/` ga yo'naltirilsin

---

### Vazifa 1.7 — Register sahifasi

**`src/pages/auth/RegisterPage.jsx`**

```
Avatar yuklash (doira, 100px, "+" ikonka, bosib fayl tanlansin, preview ko'rinsin)

Ism            [ input ]    Familiya    [ input ]
Username       [ input, @ prefiks bilan ]
Email          [ input ]
Parol          [ input type=password ]
               Parol kuchi: [==        ] (kuchsiz/o'rta/kuchli — rang bilan)
Parolni tasdir [ input type=password ]

               [ Ro'yxatdan o'tish ]

"Akkauntingiz bormi?  Kiring"
```

Validatsiyalar:
- Username: faqat a-z, 0-9, _ (regex bilan tekshiring)
- Parol: kamida 8 belgi, 1 raqam
- Parollar mos kelishi

---

### Vazifa 1.8 — Asosiy Layout

**`src/components/layout/MainLayout.jsx`**

```
┌─────────────────────────────────────────────┐
│  HEADER (fixed, 64px balandlik)             │
├──────────┬──────────────────────────────────┤
│          │                                  │
│ SIDEBAR  │   <Outlet /> (kontent)           │
│ (270px)  │                                  │
│          │                                  │
└──────────┴──────────────────────────────────┘
```

**Header komponent** (`src/components/layout/Header.jsx`):
- Chap: hamburger (sidebar yopish/ochish), Logo
- O'rta: qidiruv input (Enter bosganda `/search?q=...` ga o'tsin)
- O'ng: dark/light toggle, qo'ng'iroq (bildirishnomalar), avatar dropdown
- Avatar dropdown: Profil, Sozlamalar, Chiqish

**Sidebar komponent** (`src/components/layout/Sidebar.jsx`):
- Collapsible (faqat ikonkalar qoladi, 64px ga siqiladi)
- Navigatsiya elementlari (Lucide ikonkalar bilan):
  - `Home` — Asosiy sahifa `/`
  - `TrendingUp` — Trendlar `/trending`
  - `Users` — Guruhlar `/groups`
  - `MessageCircle` — Chatlar `/chat`
  - `Upload` — Yuklash `/upload`
  - `User` — Profil `/profile/:mening_username`
- Faol link highlight (Tailwind `bg-accent`)
- Pastda: foydalanuvchi avatar + ism (kichik)

---

### Vazifa 1.9 — NotFound va boshqa yordamchi sahifalar

**`src/pages/NotFoundPage.jsx`** — 404 sahifa (ikonka, "Sahifa topilmadi", Bosh sahifaga qaytish tugmasi)

---

## Dasturchi 2 — Shakarboyev
### Video Yuklash va Bunny.net
**Branch:** `feat/shakarboyev/video-upload`

---

### Vazifa 2.1 — Bunny.net konfiguratsiya

`npm install tus-js-client` o'rnating.

**`src/lib/bunny.js`** to'liq yozing:

```js
const CONFIG = {
  streamApiKey: import.meta.env.VITE_BUNNY_STREAM_API_KEY,
  libraryId: import.meta.env.VITE_BUNNY_LIBRARY_ID,
  storageApiKey: import.meta.env.VITE_BUNNY_STORAGE_API_KEY,
  storageZone: import.meta.env.VITE_BUNNY_STORAGE_ZONE,
  hostname: import.meta.env.VITE_BUNNY_STORAGE_HOSTNAME, // storage.bunnycdn.com
  pullZone: import.meta.env.VITE_BUNNY_PULL_ZONE,        // CDN URL
}
```

**Funksiya 1: `createVideo(title)`**
```
POST https://video.bunnycdn.com/library/{libraryId}/videos
Headers: { AccessKey: streamApiKey }
Body: { title }
Returns: { guid, title, ... }  ← guid bu videoId
```

**Funksiya 2: `uploadVideoTus(videoId, file, onProgress)`**
```js
// tus-js-client ishlatiladi
// endpoint: https://video.bunnycdn.com/tusupload
// Headers:
//   AuthorizationSignature: sha256(libraryId + apiKey + expirationTime + videoId)
//   AuthorizationExpire: unixTimestamp (1 soatdan keyin)
//   VideoId: videoId
//   LibraryId: libraryId
// onProgress(bytesUploaded, bytesTotal) — foizni hisoblang
```

**Funksiya 3: `uploadThumbnail(videoId, file)`**
```
PUT https://{hostname}/{storageZone}/thumbnails/{videoId}.jpg
Headers: { AccessKey: storageApiKey }
Body: file (binary)
```

**Funksiya 4: `getVideoEmbedUrl(videoId)`**
```
return `https://iframe.mediadelivery.net/embed/${CONFIG.libraryId}/${videoId}`
```

**Funksiya 5: `deleteVideo(videoId)`**
```
DELETE https://video.bunnycdn.com/library/{libraryId}/videos/{videoId}
```

`.env.local` faylini yarating va README.md ga qaysi o'zgaruvchilar kerakligini yozing.

---

### Vazifa 2.2 — useVideoUpload hook

**`src/hooks/useVideoUpload.js`**

```js
export function useVideoUpload() {
  const [status, setStatus]     = useState('idle')
  // 'idle' | 'creating' | 'uploading' | 'done' | 'error'
  const [progress, setProgress] = useState(0)   // 0-100
  const [speed, setSpeed]       = useState(0)   // bytes/s
  const [videoId, setVideoId]   = useState(null)
  const [error, setError]       = useState(null)
  const uploadRef = useRef(null) // tus upload instance

  const upload = async (file, metadata) => {
    // 1. setStatus('creating') — Bunny da video yaratish
    // 2. setStatus('uploading') — tus bilan yuklash
    //    onProgress da progress, speed hisoblash
    // 3. setStatus('done') — videoId ni saqlash
    // Xato bo'lsa setStatus('error'), setError(message)
  }

  const cancel = () => {
    uploadRef.current?.abort()
    setStatus('idle')
    setProgress(0)
  }

  const reset = () => {
    setStatus('idle')
    setProgress(0)
    setSpeed(0)
    setVideoId(null)
    setError(null)
  }

  return { status, progress, speed, videoId, error, upload, cancel, reset }
}
```

---

### Vazifa 2.3 — Video yuklash sahifasi (4 bosqich)

**`src/pages/video/UploadPage.jsx`**

Yuqorida **Stepper** (4 qadam ko'rsatadigan progress indicator):
```
[1. Fayl] ——— [2. Ma'lumot] ——— [3. Yuklash] ——— [4. Tayyor]
```

**1-bosqich — Fayl tanlash:**
```
┌─────────────────────────────────────────────────────┐
│                                                     │
│         ☁  Faylni shu yerga tashlang                │
│                    yoki                             │
│           [ Fayl tanlash ]                          │
│                                                     │
│    MP4, MOV, AVI, MKV, WebM · Maksimal 10 GB       │
└─────────────────────────────────────────────────────┘
```
- `onDragOver`, `onDrop` event handlerlari
- `accept="video/*"` input
- Fayl tanlanganda: fayl nomi, hajmi, formati ko'rinsin
- Noto'g'ri format yoki 10 GB dan katta bo'lsa xato xabari
- "Keyingi" tugmasi (fayl tanlanmasa disabled)

**2-bosqich — Ma'lumotlar:**
```
Sarlavha *     [ _______________________ ] 0/100
Tavsif         [ _______________________ ]
               [ _______________________ ] 0/5000

Thumbnail      [ + Rasm yuklash ] → tanlanganda preview ko'rinsin

Kategoriya     [ Tanlang ▼ ]
  Ta'lim | Ko'ngilochar | Yangiliklar | Sport | Musiqa | Boshqa

Teglar         [ teg yozing + Enter ]
               [react] [x]  [javascript] [x]  ...

Ko'rinish      ( ) Hammaga ochiq
               ( ) Faqat guruh a'zolari
               ( ) Shaxsiy

               [ Orqaga ]  [ Yuklashni boshlash ]
```

**3-bosqich — Yuklash (useVideoUpload hook bilan):**
```
"Avatar.mp4 yuklanmoqda..."

[████████████░░░░░░░░░░░░] 62%

234.5 MB / 380 MB · 4.2 MB/s · ~35 soniya qoldi

                    [ Bekor qilish ]
```
- Sahifadan chiqishda "Yuklash to'xtatiladi, davom etasizmi?" confirm

**4-bosqich — Tayyor:**
```
✓ Video muvaffaqiyatli yuklandi!

Bunny.net da qayta ishlanmoqda (1-2 daqiqa)

[ Video sahifasini ochish ]   [ Yana video yuklash ]
```

---

### Vazifa 2.4 — VideoCard komponenti

**`src/components/video/VideoCard.jsx`**

Props: `{ video }` (mockData.js dagi video shakli)

```
┌─────────────────────────┐
│  [thumbnail 16:9]       │  ← hover da duration ko'rinsin (pastki o'ngda)
│              [  2:35  ] │
├─────────────────────────┤
│ [avatar] Sarlavha matni │  ← 2 qatorda qisqartirilsin (line-clamp-2)
│          Muallif ismi   │
│          1.2K · 3 kun   │  ← formatCount, formatDate
│                    [...] │  ← dropdown: Saqlash, Ulashish, Shikoyat
└─────────────────────────┘
```

- Thumbnail `aspect-video object-cover` bilan
- Hover: `hover:scale-[1.02] transition-transform duration-200`
- Duration badge: `bg-black/80 text-white text-xs px-1.5 py-0.5 rounded`
- `[...]` bosilganda Shadcn `DropdownMenu`

---

### Vazifa 2.5 — VideoGrid komponenti

**`src/components/video/VideoGrid.jsx`**

Props: `{ videos, loading, error, onLoadMore, hasMore }`

```jsx
// Loading holati
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {Array(8).fill(0).map((_, i) => <VideoCardSkeleton key={i} />)}
</div>

// To'lgan holat
<div className="grid ...">
  {videos.map(v => <VideoCard key={v.id} video={v} />)}
</div>
{hasMore && <Button onClick={onLoadMore}>Ko'proq yuklash</Button>}

// Bo'sh holat
<EmptyState icon={<Video />} message="Videolar topilmadi" />
```

**`VideoCardSkeleton`** — Shadcn `Skeleton` bilan:
- Thumbnail maydoni (aspect-video)
- Avatar doira (10x10)
- 2 ta matn qatori

---

### Vazifa 2.6 — Qidiruv sahifasi

**`src/pages/video/SearchPage.jsx`**

URL: `/search?q=<sorov>`

- `useSearchParams()` bilan `q` parametrini o'qish
- `searchVideos(q)` api funksiyasini chaqirish
- "Natijalar: 24 ta video topildi" (yoki "Topilmadi")
- Filtr paneli (kategoriya, sana, saralash)
- VideoGrid bilan natijalar

---

## Dasturchi 3 — Shaxruz
### Video Player va Video Sahifasi
**Branch:** `feat/shaxruz/video-player`

---

### Vazifa 3.1 — VideoPlayer komponenti

**`src/components/video/VideoPlayer.jsx`**

Props: `{ videoId, autoplay }` — bu Bunny.net `videoId` (guid)

```jsx
function VideoPlayer({ videoId, autoplay = false }) {
  const [loading, setLoading] = useState(true)
  const [error, setError]     = useState(false)

  const embedUrl =
    `https://iframe.mediadelivery.net/embed/${BUNNY_CONFIG.libraryId}/${videoId}` +
    `?autoplay=${autoplay}&responsive=true&preload=true`

  return (
    <div className="relative w-full aspect-video bg-black rounded-xl overflow-hidden">
      {loading && <PlayerSkeleton />}  {/* spinner markazda */}
      {error && <PlayerError onRetry={() => setError(false)} />}
      <iframe
        src={embedUrl}
        className={cn("w-full h-full", loading && "opacity-0")}
        allowFullScreen
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope"
        onLoad={() => setLoading(false)}
        onError={() => { setLoading(false); setError(true) }}
      />
    </div>
  )
}
```

---

### Vazifa 3.2 — Video sahifasi

**`src/pages/video/VideoPage.jsx`**

URL: `/video/:id`

`getVideoById(id)` chaqiring, loading/error holatlarini boshqaring.

```
┌─────────────────────────────┐  ┌──────────────┐
│  VideoPlayer                │  │ Keyingi      │
│                             │  │ videolar     │
│  Sarlavha                   │  │              │
│  1.2M ko'rish · 15 Yan 2025 │  │ [mini card]  │
│                             │  │ [mini card]  │
│  [👍 1.2K] [👎] [Ulash] [💾]│  │ [mini card]  │
│                             │  │ ...          │
│  ┌───────────────────────┐  │  │              │
│  │ [avatar] Muallif ismi │  │  │ Autoplay [○] │
│  │ 45.2K obunachi        │  │  └──────────────┘
│  │ [Obuna bo'lish]       │  │
│  └───────────────────────┘  │
│                             │
│  Tavsif (collapsible)       │
│  [react] [tutorial] [teglar]│
│                             │
│  ── Izohlar bo'limi ──      │
│  (Fariza to'ldiradi)        │
└─────────────────────────────┘
```

**Like/Dislike tugmalari:**
- `useState` bilan `liked`/`disliked` holati
- Liked: `ThumbsUp` ikonka `fill-current text-primary` bo'lsin
- `likeVideo(id)` api chaqirilsin, soni yangilansin

**Muallif kartochkasi:**
- `getUserByUsername` bilan muallif ma'lumotlari
- "Obuna bo'lish" → `subscribeToUser()`, tugma "Obuna bo'lingan" ga o'zgarsin

**Tavsif collapsible:**
- 3 qatordan uzun bo'lsa "Ko'proq ko'rish" tugmasi
- `useState(false)` bilan `expanded` holati

**Teglar:**
- Har bir teg bosilganda `/search?q=<teg>` ga o'tsin

**`CommentsSection` komponenti joy qoldiring** (`<CommentsSection videoId={id} />`)

---

### Vazifa 3.3 — Vertikal VideoCard (o'ng panel uchun)

**`src/components/video/VideoCardVertical.jsx`**

Props: `{ video }`

```
┌────────────────────────────────┐
│ [thumb]  Sarlavha 2 qatorda    │
│ 80x45px  Muallif ismi          │
│          245K ko'rish · 2 oy   │
└────────────────────────────────┘
```

- Thumbnail `80x45px`, `object-cover`, `rounded`
- Hover: subtle background change

---

### Vazifa 3.4 — Ulashish modali

**`src/components/video/ShareModal.jsx`**

Props: `{ videoId, title, open, onClose }`

Shadcn `Dialog` ichida:
```
"Videoni ulashing"

Video URL:
[ https://platform.uz/video/abc123        ] [Nusxalash ✓]

Ijtimoiy tarmoqlar:
[Telegram] [WhatsApp] [Twitter/X]

Embed kodi:
[ <iframe src="..." ...></iframe>          ] [Nusxalash]
```

- "Nusxalash" bosilganda `navigator.clipboard.writeText()`, ikonka ✓ ga o'zgarsin (2 soniyadan keyin qaytsin)
- Telegram: `https://t.me/share/url?url=...&text=...`
- WhatsApp: `https://wa.me/?text=...`
- Twitter: `https://twitter.com/intent/tweet?text=...&url=...`

---

### Vazifa 3.5 — VideoFilters komponenti

**`src/components/video/VideoFilters.jsx`**

Props: `{ onFilterChange }`

```
[Barchasi] [Ta'lim] [Ko'ngilochar] [Yangiliklar] [Sport] [Musiqa]
                                           Saralash: [Eng yangi ▼]
```

- Kategoriya filterlari — horizontal scroll, chip ko'rinishida
- Aktiv chip: `bg-primary text-primary-foreground`
- Saralash dropdown: Eng yangi, Eng ko'p ko'rilgan, Eng ko'p liked
- Filtr o'zgarganda `onFilterChange({ category, sort })` chaqirilsin

---

### Vazifa 3.6 — Asosiy sahifa (Home Feed)

**`src/pages/home/HomePage.jsx`**

`getVideos()` va `getTrendingVideos()` api funksiyalarini chaqiring.

```
┌─────────────────────────────────────────────┐
│ VideoFilters                                │
├─────────────────────────────────────────────┤
│ 🔥 Trendlar                    [→ Hammasi]  │
│ ◄ [karta] [karta] [karta] [karta] [karta] ► │  ← horizontal scroll
├─────────────────────────────────────────────┤
│ So'nggi videolar                            │
│ VideoGrid (filter natijasi)                 │
└─────────────────────────────────────────────┘
```

Trend bo'limi — `overflow-x-auto` bilan horizontal scroll, `scroll-smooth`.

---

## Dasturchi 4 — Farzona
### Guruhlar Moduli
**Branch:** `feat/farzona/groups`

---

### Vazifa 4.1 — Guruhlar sahifasi

**`src/pages/groups/GroupsPage.jsx`**

`getGroups()` chaqiring.

```
┌─────────────────────────────────────────────┐
│  [ + Guruh yaratish ]                       │
│                                             │
│  Mening guruhlarim (3)                      │
│  [GroupCard] [GroupCard] [GroupCard]        │
│                                             │
│  Tavsiya etilgan guruhlar                   │
│  [GroupCard] [GroupCard] [GroupCard] ...    │
└─────────────────────────────────────────────┘
```

---

### Vazifa 4.2 — GroupCard komponenti

**`src/components/groups/GroupCard.jsx`**

Props: `{ group, isMember }`

```
┌─────────────────────────┐
│  [muqova rasm 16:9]     │
│  [avatar]               │  ← muqova ustida, pastki chap
├─────────────────────────┤
│  Guruh nomi    [🔒]     │  ← maxfiy guruh uchun qulf
│  1.2K a'zo              │
│  Qisqa tavsif...        │
│  [Qo'shilish] yoki      │
│  [A'zo ✓]               │
└─────────────────────────┘
```

- `isMember` bo'lsa: tugma "A'zo ✓" (outline variant), hover da "Chiqish?"
- Maxfiy guruh: `Lock` ikonka sarlavha yonida
- Yopiq guruh: "Qo'shilish" bosganda "So'rov yuborildi" holatiga o'tsin

---

### Vazifa 4.3 — Guruh yaratish modali

**`src/components/groups/CreateGroupModal.jsx`**

Shadcn `Dialog`, trigger tugmasi tashqaridan beriladi.

**Qadamlar:**
```
1-qadam: Asosiy ma'lumotlar
  Guruh nomi *   [ ______________ ]
  Tavsif         [ ______________ ]
                 [ ______________ ]
  Kategoriya     [ Tanlang ▼     ]

2-qadam: Vizual
  Guruh avatari    [+ Yuklash] → preview doira 100px
  Muqova rasm      [+ Yuklash] → preview 16:9

3-qadam: Ko'rinish
  ( ) Ochiq    — hamma qo'shila oladi
  ( ) Yopiq    — tasdiq kerak
  ( ) Maxfiy   — faqat taklif orqali

[Orqaga]  [Keyingi / Yaratish]
```

- "Yaratish" da `createGroup(data)` chaqiring
- Muvaffaqiyatli: modal yopilsin, yangi guruh sahifasiga o'tsin

---

### Vazifa 4.4 — Guruh sahifasi

**`src/pages/groups/GroupDetailPage.jsx`**

URL: `/groups/:id`

`getGroupById(id)` chaqiring.

```
┌─────────────────────────────────────────────┐
│  [muqova rasm, 280px balandlik]             │
│  [avatar 100px]  Guruh nomi                 │
│                  1.2K a'zo · Ochiq guruh    │
│                  [Qo'shilish] [Ulashish]    │
│           Admin uchun: [⚙ Boshqarish]       │
├─────────────────────────────────────────────┤
│ [Videolar] [A'zolar] [Haqida]               │  ← Shadcn Tabs
├─────────────────────────────────────────────┤
│  (tab kontenti)                             │
└─────────────────────────────────────────────┘
```

**Videolar tab:** VideoGrid bilan (`videos.filter(v => v.groupId === id)`)

**A'zolar tab:** MembersList komponenti (Vazifa 4.5)

**Haqida tab:**
```
Tavsif: ...
Kategoriya: Ta'lim
Yaratilgan: 15 Yanvar 2025
Qoidalar: (agar bo'lsa)
```

**Admin panel** (faqat `group.ownerId === currentUser.id`):
- Shadcn `Sheet` (o'ng tomonda chiqadigan panel)
- Guruh tahrirlash
- A'zo qo'shish (username qidirish)
- Guruhni o'chirish (Shadcn `AlertDialog` confirm bilan)

---

### Vazifa 4.5 — A'zolar ro'yxati

**`src/components/groups/MembersList.jsx`**

Props: `{ groupId, isAdmin }`

```
[Qidirish...]

[avatar] Behruz Toshmatov      Admin    [...]
[avatar] Shakarboyev Mirzo   Moderator  [...]
[avatar] Shaxruz Yusupov       A'zo     [...]
```

- Rol badge: Admin (amber), Moderator (blue), A'zo (gray) — Shadcn `Badge`
- `[...]` (faqat admin ko'radi): "Moderator qilish", "Guruhdan chiqarish"
- "Chiqarish" bosganda `AlertDialog` confirm
- Pagination: 10 tadan ko'rsatish, "Ko'proq" tugmasi

---

### Vazifa 4.6 — Guruhga video yuklash

Guruh sahifasidagi "Videolar" tabga "Video yuklash" tugmasi qo'shing.

Shakarboyev (D2) ning `UploadPage` ni **modal ichida emas**, balki `/upload?groupId=<id>` URL bilan oching. `UploadPage` da `useSearchParams()` bilan `groupId` o'qilsin va formada "Guruh: ..." ko'rinsin.

---

## Dasturchi 5 — Fariza
### Izohlar Moduli
**Branch:** `feat/fariza/comments`

---

### Vazifa 5.1 — useComments hook

**`src/hooks/useComments.js`**

```js
export function useComments(videoId) {
  const [comments, setComments] = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState(null)
  const { user } = useAuth()

  useEffect(() => {
    getComments(videoId).then(setComments).catch(setError).finally(...)
  }, [videoId])

  const addComment = async (text, parentId = null) => {
    const newComment = await addComment(videoId, text, parentId)
    setComments(prev => [newComment, ...prev])
  }

  const deleteComment = async (commentId) => {
    await deleteComment(commentId)
    setComments(prev => prev.filter(c => c.id !== commentId))
  }

  const editComment = async (commentId, text) => {
    // api chaqirib, state yangilash
  }

  const likeComment = async (commentId) => {
    // optimistic update: avval UI yangilansin, keyin api
  }

  return { comments, loading, error, addComment, deleteComment, editComment, likeComment }
}
```

---

### Vazifa 5.2 — CommentsSection (bosh konteyner)

**`src/components/comments/CommentsSection.jsx`**

Props: `{ videoId }`

Bu komponent Shaxruz (D3) ning VideoPage sahifasida ishlatiladi.

```
── 124 ta izoh ──────────────  Saralash: [Eng yangi ▼]

[CommentInput]  (login bo'lgan foydalanuvchi uchun)

[CommentItem]
[CommentItem]
[CommentItem]
...
[ Ko'proq yuklash (18 ta qoldi) ]
```

- Login qilmagan bo'lsa CommentInput o'rniga: `"Izoh qoldirish uchun kiring →"`
- Saralash o'zgarganda izohlar qayta tartiblansın
- "Ko'proq" tugmasi bosilganda keyingi 10 ta ko'rinsin

---

### Vazifa 5.3 — CommentInput

**`src/components/comments/CommentInput.jsx`**

Props: `{ onSubmit, onCancel, placeholder, autoFocus }`

```
[avatar]  [ Izoh yozing...                              ]
                                          450/1000
          [Bekor qilish]  [Izoh qoldirish]
```

- Textarea `rows=1`, yozganda avtomatik balandlik oshsin (`auto-resize`)
- Belgilar sanoqchisi: 900+ bo'lsa sariq, 1000 bo'lsa qizil
- "Izoh qoldirish" — bo'sh bo'lsa disabled
- Submit bosilganda `onSubmit(text)` chaqirilsin, textarea tozalansin

---

### Vazifa 5.4 — CommentItem

**`src/components/comments/CommentItem.jsx`**

Props: `{ comment, depth }` — depth: `0` (asosiy) yoki `1` (javob)

```
[avatar]  Behruz Toshmatov  · 3 soat oldin  [...]
          Izoh matni bu yerda. Uzun bo'lsa "Ko'proq ko'rish"
          bilan qisqartiriladi (3 qatordan ko'p bo'lsa).

          [👍 12]  [Javob berish]

          ▼ 3 ta javob
            [CommentItem depth=1]
            [CommentItem depth=1]
            [Ko'proq javoblar (5)]
```

**`[...]` dropdown (Shadcn DropdownMenu):**
- Har kim: "Shikoyat qilish"
- Faqat muallif: "Tahrirlash", "O'chirish"

**Tahrirlash holati:**
- Izoh matni `CommentInput` ga aylansin (mavjud matn bilan)
- "Saqlash" va "Bekor qilish" tugmalari

**O'chirish:** `AlertDialog` confirm bilan

**depth=1 uchun:**
- Chap chekkada `2px` rangli chiziq (`border-l-2 border-primary/30`)
- Fon: `bg-muted/30`
- "Javob berish" tugmasi yo'q (2 darajadan chuqur ketmasin)

---

### Vazifa 5.5 — Shikoyat modali

**`src/components/comments/ReportModal.jsx`**

Props: `{ open, onClose, commentId }`

Shadcn `Dialog`:
```
"Nima muammo?"

( ) Spam yoki reklama
( ) Munosibsiz kontent
( ) Haqorat yoki tahdid
( ) Yolg'on ma'lumot
( ) Boshqa: [ ____________ ]

[Bekor qilish]  [Shikoyat yuborish]
```

- "Shikoyat yuborish" bosilganda modal yopilsin, Shadcn `toast` bilan "Shikoyatingiz qabul qilindi"

---

## Dasturchi 6 — Otabek
### Chat va Profil
**Branch:** `feat/otabek/chat-profile`

---

### Vazifa 6.1 — useChats va useMessages hooklar

**`src/hooks/useChats.js`**
```js
export function useChats() {
  // getChats() dan chatlar ro'yxatini olish
  // { chats, loading, error }
}
```

**`src/hooks/useMessages.js`**
```js
export function useMessages(chatId) {
  const [messages, setMessages] = useState([])

  const send = async (data) => {
    // Optimistic: avval UI ga qo'shish
    const tempMsg = { id: 'temp-' + Date.now(), ...data, status: 'sent' }
    setMessages(prev => [...prev, tempMsg])
    // Keyin api chaqirish, tempMsg ni real msg bilan almashtirish
    const real = await sendMessage(chatId, data)
    setMessages(prev => prev.map(m => m.id === tempMsg.id ? real : m))
  }

  return { messages, loading, send }
}
```

---

### Vazifa 6.2 — Chat sahifasi

**`src/pages/chat/ChatPage.jsx`**

URL: `/chat` va `/chat/:id`

```
┌──────────────────┬──────────────────────────────┐
│  ChatList        │  ChatWindow                  │
│  (320px)         │  (qolgan joy)                │
│                  │                              │
│  [Qidirish...]   │  (chat tanlang yoki          │
│                  │   "Suhbat tanlang" holati)   │
│  [ChatListItem]  │                              │
│  [ChatListItem]  │                              │
│  [ChatListItem]  │                              │
│                  │                              │
│  [ + Yangi chat] │                              │
└──────────────────┴──────────────────────────────┘
```

Mobile: `/chat` da faqat ChatList, `/chat/:id` da faqat ChatWindow.  
`useMediaQuery('(max-width: 768px)')` bilan aniqlang.

---

### Vazifa 6.3 — ChatListItem

**`src/components/chat/ChatListItem.jsx`**

Props: `{ chat, active }`

```
[avatar + online nuqta]  Behruz Toshmatov      14:32
                         Oxirgi xabar...        [3]
```

- Online nuqta: `absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full border-2 border-background`
- O'qilmagan badge: `bg-primary text-primary-foreground text-xs rounded-full px-1.5`
- Aktiv holat: `bg-accent`
- Oxirgi xabar: o'zi yuborgan bo'lsa "Siz: ..."

---

### Vazifa 6.4 — ChatWindow

**`src/components/chat/ChatWindow.jsx`**

Props: `{ chatId }`

```
┌─────────────────────────────────────────────┐
│ [avatar] Behruz  🟢 online          [⋮]     │  ← header
├─────────────────────────────────────────────┤
│                                             │
│          ── Bugun ──                        │
│                                             │
│  [avatar] Salom, qalaysiz?        10:20     │  ← kiruvchi
│                   Yaxshi, sizchi?  10:21 ✓✓ │  ← chiquvchi
│  [avatar] Men ham!                10:22     │
│                                             │
├─────────────────────────────────────────────┤
│ [😊] [📎]  [ Xabar yozing...    ]  [➤ ]    │  ← input panel
└─────────────────────────────────────────────┘
```

**Xabarlar maydoni:**
- `useRef` + `useEffect` — yangi xabar kelganda pastga scroll
- Sana ajratgichlari: "Bugun", "Kecha", sanani formatlab ko'rsating
- Kiruvchi: chap, `bg-muted rounded-2xl rounded-tl-none`
- Chiquvchi: o'ng, `bg-primary text-primary-foreground rounded-2xl rounded-tr-none`
- Status ikonkalar: `Check` (sent), `CheckCheck` (delivered), `CheckCheck text-blue-500` (read)

**Input paneli:**
- Shadcn `Textarea`, `rows=1`, auto-resize
- `Enter` = yuborish, `Shift+Enter` = yangi qator
- `📎` — rasm yuklash (`input type=file accept="image/*"`), preview thumbnail xabar sifatida
- `😊` — kichik emoji picker (`useState` bilan open/close), 8x6 grid, tez-tez ishlatiladigan 48 emoji

---

### Vazifa 6.5 — Profil sahifasi

**`src/pages/profile/ProfilePage.jsx`**

URL: `/profile/:username`

`getUserByUsername(username)` va `getUserVideos(userId)` chaqiring.

```
┌─────────────────────────────────────────────┐
│  [muqova rasm, 240px]                       │
│  [avatar 120px, doira]                      │
├─────────────────────────────────────────────┤
│  Behruz Toshmatov  @behruz                  │
│  Frontend dasturchi 🚀                       │
│                                             │
│  [124 video]  [45.2K obunachi]  [320 obuna] │
│                                             │
│  [Obuna bo'lish]  [Xabar ✉]               │
│        O'z profilingiz: [✏ Tahrirlash]      │
├─────────────────────────────────────────────┤
│ [Videolar] [Yoqtirilganlar*] [Saqlangan*]   │  ← *faqat o'zi
├─────────────────────────────────────────────┤
│  VideoGrid                                  │
└─────────────────────────────────────────────┘
```

- `useAuth().user.username === username` bo'lsa "Tahrirlash" ko'rinsin
- Obuna tugmasi: `subscribeToUser()` chaqirish, optimistic update

---

### Vazifa 6.6 — Profil tahrirlash modali

**`src/components/profile/EditProfileModal.jsx`**

Shadcn `Dialog`:

```
Avatar:       [doira, 100px, ustiga hover da "O'zgartirish" overlay]
Muqova rasm:  [16:9, ustiga hover da "O'zgartirish" overlay]

Ism *         [ ______________ ]
Familiya *    [ ______________ ]
Username *    [ ______________ ]
Bio           [ ______________ ] 0/200
Vebsayt       [ ______________ ]

Ijtimoiy tarmoqlar:
  Telegram:   [ @username      ]
  Instagram:  [ @username      ]
  YouTube:    [ kanal URL      ]

[Bekor qilish]   [Saqlashni saqlash]
```

- Rasm o'zgarganda `URL.createObjectURL()` bilan preview
- Saqlash bosilganda hozircha `localStorage` ga saqlansin (api tayyor bo'lguncha)

---

### Vazifa 6.7 — Bildirishnomalar paneli

**`src/components/layout/NotificationPanel.jsx`**

Header dagi qo'ng'iroq ikonkasi bosilganda Shadcn `Popover`:

```
Bildirishnomalar         [Barchasini o'qi]

[🔔] Behruz kanalingizga obuna bo'ldi   2 daq
[❤️] Shakarboyev videongizni yoqtirdi   15 daq
[💬] Shaxruz izoh qoldirdi             1 soat
[👥] "React Uzbekistan" guruhiga taklif  3 soat
─────────────────────────────────────────
          [Barcha bildirishnomalar →]
```

- O'qilmagan bildirishnomalar: `bg-primary/5` fon, chap chekkada rangli chiziq
- Qo'ng'iroq ikonkasida o'qilmagan soni badge (`3+`)
- "Barchasini o'qi" bosilganda hammasini o'qilgan deb belgilash

---

## Jadval

| Hafta | Kim | Nima |
|-------|-----|------|
| 1 | **Behruz** | 1.1–1.5: Papkalar, mockData, api.js, router, AuthContext, Login/Register |
| 1 | **Shakarboyev** | 2.1–2.3: Bunny.net, useVideoUpload, Upload sahifasi |
| 2 | **Behruz** | 1.6–1.9: MainLayout, Header, Sidebar, ThemeContext |
| 2 | **Shaxruz** | 3.1–3.4: VideoPlayer, VideoPage, ShareModal |
| 2 | **Shakarboyev** | 2.4–2.6: VideoCard, VideoGrid, SearchPage |
| 3 | **Shaxruz** | 3.5–3.6: VideoFilters, HomePage |
| 3 | **Farzona** | 4.1–4.6: Guruhlar to'liq |
| 3 | **Fariza** | 5.1–5.5: Izohlar to'liq |
| 3 | **Otabek** | 6.1–6.4: Chat to'liq |
| 4 | **Otabek** | 6.5–6.7: Profil, tahrirlash, bildirishnomalar |
| 4 | Hammasi | PR review, responsive test, bug-fix, integratsiya |
