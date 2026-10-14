# Behruz — Loyiha Asosi, Auth, Layout va Dashboard
**Branch:** `feat/behruz/foundation`

---

## Bu loyiha nima?

Bu **ta'lim ERP tizimi** (LMS — Learning Management System).
- **Bitta Admin** bor — u guruhlar ochadi, darslar yuklaydi, talabalarni boshqaradi.
- **Talabalar** — guruhga qo'shilgandan keyin o'sha guruhning darslarini ko'ra oladi.
- Talabalar o'zlari guruh ocha olmaydi, video yuklay olmaydi.

---

## Tizimda ikki xil foydalanuvchi:

| | Admin | Talaba |
|--|-------|--------|
| Login | Ha | Ha |
| Video yuklash | ✅ | ❌ |
| Guruh ochish | ✅ | ❌ |
| Talaba qo'shish | ✅ | ❌ |
| Darslarni ko'rish | ✅ | ✅ (faqat o'z guruhi) |
| Barcha guruhlarni ko'rish | ✅ | ❌ |

---

## 1-VAZIFA — Papkalar tuzilishi

`src/` ichida quyidagi papkalarni yarating:

```
src/
├── components/
│   ├── ui/               ← Shadcn (o'zgartirma)
│   ├── layout/
│   │   ├── admin/        ← Admin uchun sidebar, header
│   │   └── student/      ← Talaba uchun sidebar, header
│   ├── video/            ← Shakarboyev va Shaxruz to'ldiradi
│   ├── groups/           ← Shaxruz va Farzona to'ldiradi
│   ├── students/         ← Fariza to'ldiradi
│   └── shared/           ← Hamma uchun: LoadingSpinner, EmptyState, ErrorState
├── pages/
│   ├── auth/             ← LoginPage (bitta login, rol bo'yicha yo'naltiriladi)
│   ├── admin/
│   │   ├── dashboard/    ← Admin bosh sahifasi (statistika)
│   │   ├── groups/       ← Guruhlar boshqaruvi
│   │   ├── students/     ← Talabalar boshqaruvi
│   │   └── videos/       ← Videolar boshqaruvi
│   └── student/
│       ├── home/         ← Talabaning bosh sahifasi (o'z guruhlari)
│       ├── group/        ← Guruh darslar ro'yxati
│       └── lesson/       ← Dars ko'rish sahifasi
├── hooks/
├── context/              ← AuthContext
├── lib/
│   ├── mockData.js
│   ├── api.js
│   └── utils.js
└── router/
    └── router.jsx
```

### O'rnatish kerak bo'lgan paketlar:
```
npm install react-router-dom clsx tailwind-merge
```

---

## 2-VAZIFA — `src/lib/utils.js`

Barcha dasturchilar ishlatiladigan yordamchi funksiyalar.

### `cn()` funksiyasi
Tailwind klasslarini birlashtiradi. `clsx` va `tailwind-merge` ishlatiladi.
Misol ishlatish: `cn("px-4", isActive && "bg-primary", className)`

### `formatDate()` funksiyasi
ISO sana → o'qilishi oson format.
- `"2025-01-12T10:00:00Z"` → `"3 kun oldin"`
- `"2025-01-14T13:55:00Z"` → `"5 daqiqa oldin"`
- 1 daqiqadan kam → `"Hozirgina"`

### `formatDuration()` funksiyasi
Soniyalar → `"daqiqa:soniya"` yoki `"soat:daqiqa:soniya"`.
- `125` → `"2:05"`
- `3725` → `"1:02:05"`

### `formatFileSize()` funksiyasi
Baytlar → o'qilishi oson format.
- `1_048_576` → `"1.0 MB"`
- `2_500_000_000` → `"2.3 GB"`

---

## 3-VAZIFA — `src/lib/mockData.js`

Backend yo'q, shu sababli test ma'lumotlari shu yerda.

### Admin foydalanuvchi — BITTA:
```
{
  id: "admin-1",
  role: "admin",
  fullName: "Administrator",
  email: "admin@platform.uz",
  password: "admin123",   ← faqat mock uchun, haqiqiy API da bo'lmaydi
  avatar: rasm URL
}
```

### Talabalar — kamida 10 ta:
Har birida:
- `id`, `role: "student"`, `fullName`, `email`, `password` (mock uchun)
- `avatar` — rasm URL
- `groupIds` — qaysi guruhlarga qo'shilgan (massiv)
- `phone`, `createdAt`
- `isActive` — true/false (admin bloklashi mumkin)

### Guruhlar — kamida 4 ta:
- `id`, `name` — guruh/kurs nomi ("React Dasturlash", "JavaScript Asoslari")
- `description` — kurs haqida
- `coverImage` — kurs muqovasi
- `studentIds` — a'zo talabalar id lari
- `lessonCount` — darslar soni
- `isActive` — kurs faolmi
- `createdAt`
- `adminId` — yaratgan admin

### Darslar (videolar) — kamida 12 ta:
- `id`, `title` — dars sarlavhasi
- `description` — dars haqida
- `thumbnail` — preview rasm
- `videoId` — Bunny.net GUID
- `duration` — soniyalarda
- `order` — tartib raqami (1, 2, 3...)
- `groupId` — qaysi guruhga tegishli
- `isPublished` — nashr qilinganmi
- `createdAt`

### Izohlar — kamida 15 ta:
- `id`, `text`, `lessonId`, `authorId`
- `createdAt`

---

## 4-VAZIFA — `src/lib/api.js`

Barcha API funksiyalari. Hozircha `mockData.js` dan qaytaradi.
Har bir funksiya `async` va 200-400ms kutish simulyatsiyasi qilsin.

### Auth:
- `login(email, password)` — admin bo'lsa `{ user: adminUser, role: "admin" }`, talaba bo'lsa `{ user: studentUser, role: "student" }` qaytarsin. Email/parol noto'g'ri bo'lsa xato tashlaysin.
- `getCurrentUser()` — localStorage dagi token ga qarab foydalanuvchini qaytarsin

### Admin funksiyalari:
- `getAdminStats()` — `{ totalStudents, totalGroups, totalLessons, activeStudents }` qaytarsin
- `getAllGroups()` — barcha guruhlar ro'yxati
- `getAllStudents()` — barcha talabalar ro'yxati
- `getStudentById(id)` — bitta talaba
- `createGroup(data)` — yangi guruh yaratish
- `updateGroup(id, data)` — guruhni tahrirlash
- `deleteGroup(id)` — guruhni o'chirish
- `addStudentToGroup(studentId, groupId)` — talabani guruhga qo'shish
- `removeStudentFromGroup(studentId, groupId)` — guruhdan chiqarish
- `toggleStudentActive(studentId)` — blok/blokdan chiqarish
- `getGroupLessons(groupId)` — guruh darslari
- `deleteLesson(id)` — darsni o'chirish
- `updateLesson(id, data)` — darsni tahrirlash

### Talaba funksiyalari:
- `getMyGroups()` — talabaning guruhlari
- `getGroupLessons(groupId)` — guruh darslari (faqat nashr qilinganlar)
- `getLessonById(id)` — bitta dars
- `getComments(lessonId)` — dars izohlari
- `addComment(lessonId, text)` — izoh qoldirish

---

## 5-VAZIFA — `src/context/AuthContext.jsx`

Barcha komponentlarga login ma'lumotlarini beradi.

### Saqlash kerak:
- `user` — login qilingan foydalanuvchi ob'ekti yoki `null`
- `role` — `"admin"` yoki `"student"` yoki `null`
- `loading` — ilk tekshirish paytida `true`
- `isAuthenticated` — `user !== null`

### Funksiyalar:

**`login(email, password)`:**
1. `api.js` dagi `login()` ni chaqir
2. Muvaffaqiyatli bo'lsa — token va rolni `localStorage` ga saqlash
3. `user` va `role` ni state ga saqlash

**`logout()`:**
1. `localStorage` tozalash
2. `user = null`, `role = null`
3. `/login` ga yo'naltirish

**App yuklanayotganda (useEffect):**
1. `localStorage` da token va rol bormi tekshir
2. Bor bo'lsa — `getCurrentUser()` chaqir
3. `loading = false` qil

### Qo'shimcha: `isAdmin` va `isStudent` computed qiymatlar:
```
isAdmin   = role === "admin"
isStudent = role === "student"
```

---

## 6-VAZIFA — `src/router/router.jsx`

Ikki xil foydalanuvchi uchun alohida route'lar.

### Route tuzilmasi:

**Ommaviy sahifalar (login shart emas):**
- `/login` → `LoginPage`

**Admin sahifalari (faqat admin):**
- `/admin` → `AdminLayout` (admin uchun sidebar va header)
  - `/admin` (index) → `AdminDashboard`
  - `/admin/groups` → `AdminGroupsPage`
  - `/admin/groups/:id` → `AdminGroupDetailPage`
  - `/admin/groups/:id/upload` → `UploadLessonPage` (Shakarboyev yozadi)
  - `/admin/students` → `AdminStudentsPage`
  - `/admin/students/:id` → `StudentDetailPage`

**Talaba sahifalari (faqat student):**
- `/` → `StudentLayout` (talaba uchun sidebar va header)
  - `/` (index) → `StudentHomePage`
  - `/group/:id` → `StudentGroupPage`
  - `/lesson/:id` → `LessonPage` (Shaxruz yozadi)

**Ruxsatsiz kirish:**
- Admin sahifasiga talaba kirmoqchi bo'lsa → `/` ga qayt
- Talaba sahifasiga admin kirmoqchi bo'lsa → `/admin` ga qayt
- Login qilinmagan → `/login` ga qayt
- `*` → `NotFoundPage`

---

## 7-VAZIFA — Login sahifasi

**Fayl:** `src/pages/auth/LoginPage.jsx`

**Bitta login sahifasi** — admin ham, talaba ham shu yerdan kiradi.
Login qilingandan keyin `role` ga qarab yo'naltiriladi:
- Admin → `/admin`
- Talaba → `/`

### Ko'rinishi:

```
┌──────────────────────────────────────────────────┐
│                                                  │
│           🎓  EduPlatform                        │
│        Ta'lim boshqaruv tizimi                   │
│                                                  │
│   Email                                          │
│   [ ______________________________________ ]     │
│                                                  │
│   Parol                                  [👁]    │
│   [ ______________________________________ ]     │
│                                                  │
│         [ Tizimga kirish ]                       │
│                                                  │
│   ⚠️  Akkauntingiz yo'qmi? Admin bilan bog'laning │
│   (O'z-o'zidan ro'yxatdan o'tish mumkin emas)    │
│                                                  │
└──────────────────────────────────────────────────┘
```

### Qoidalar:
- Email va parol bo'sh bo'lsa xato ko'rsat
- Yuklanish paytida button `disabled` va spinner
- Xato bo'lsa: "Email yoki parol noto'g'ri" xabari
- "Parolni ko'rish" ko'z ikonkasi bilan ishlashi kerak

---

## 8-VAZIFA — Admin Layout

**Fayl:** `src/components/layout/admin/AdminLayout.jsx`

```
┌──────────────────────────────────────────────────────────┐
│  🎓 EduPlatform          Administrator       [🔔] [👤▼] │  ← Header
├───────────────┬──────────────────────────────────────────┤
│               │                                          │
│  📊 Dashboard │                                          │
│  👥 Guruhlar  │   <sahifa kontenti>                      │
│  👨‍🎓 Talabalar │                                          │
│               │                                          │
│               │                                          │
└───────────────┴──────────────────────────────────────────┘
```

**Admin Sidebar:**
- 📊 Dashboard → `/admin`
- 👥 Guruhlar → `/admin/groups`
- 👨‍🎓 Talabalar → `/admin/students`
- Chiqish tugmasi (pastda)

---

## 9-VAZIFA — Talaba Layout

**Fayl:** `src/components/layout/student/StudentLayout.jsx`

```
┌──────────────────────────────────────────────────────────┐
│  🎓 EduPlatform          Behruz Toshmatov     [🔔] [👤▼] │  ← Header
├───────────────┬──────────────────────────────────────────┤
│               │                                          │
│  🏠 Bosh sahifa│                                         │
│  📚 Mening    │   <sahifa kontenti>                      │
│     Kurslarim │                                          │
│               │                                          │
└───────────────┴──────────────────────────────────────────┘
```

**Talaba Sidebar:**
- 🏠 Bosh sahifa → `/`
- 📚 Mening kurslarim → `/` (bir xil, sidebar uchun)
- Chiqish tugmasi (pastda)

---

## 10-VAZIFA — Admin Dashboard sahifasi

**Fayl:** `src/pages/admin/dashboard/AdminDashboard.jsx`

```
┌──────────────────────────────────────────────────────────┐
│  Assalomu alaykum, Administrator! 👋                      │
│                                                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐ │
│  │ 👨‍🎓       │  │ 📚       │  │ 🎬       │  │ ✅       │ │
│  │   42     │  │    8     │  │   127    │  │   38     │ │
│  │ Jami     │  │ Jami     │  │  Jami    │  │ Aktiv    │ │
│  │ talabalar│  │ guruhlar │  │  darslar │  │ talabalar│ │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘ │
│                                                          │
│  So'nggi qo'shilgan talabalar                            │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [👤] Behruz Toshmatov   React guruhi   Bugun       │  │
│  │ [👤] Shaxruz Yusupov    JS guruhi      Kecha       │  │
│  │ [👤] Farzona Karimova   React guruhi   3 kun oldin │  │
│  └────────────────────────────────────────────────────┘  │
│                  [Barcha talabalar →]                    │
└──────────────────────────────────────────────────────────┘
```

**4 ta statistika kartochkasi** — `getAdminStats()` dan ma'lumot olib ko'rsatsin.

---

## 11-VAZIFA — Umumiy komponentlar

**Fayl:** `src/components/shared/` papkasida

**`LoadingSpinner.jsx`** — markazda aylanuvchi ikonka

**`EmptyState.jsx`**
- Props: `icon`, `title`, `description`, `action` (ixtiyoriy tugma)
- Misol: birorta talaba yo'q, birorta guruh yo'q holatlar uchun

**`ErrorState.jsx`**
- Props: `message`, `onRetry`
- Xato yuz bersa: xabar + "Qayta urinish" tugmasi

**`ConfirmDialog.jsx`**
- Props: `open`, `onClose`, `onConfirm`, `title`, `description`, `confirmText`
- Shadcn `AlertDialog` asosida
- O'chirish amallaridan oldin shu dialog ishlatiladi

---

## Behruz uchun eslatmalar

1. **Birinchi kun:** Papkalar, `utils.js`, `mockData.js`, `api.js`
2. **Ikkinchi kun:** `AuthContext`, `router.jsx`, `LoginPage`
3. **Uchinchi kun:** `AdminLayout`, `StudentLayout`, `AdminDashboard`
4. **To'rtinchi kun:** Umumiy komponentlar (`EmptyState`, `ErrorState`, `ConfirmDialog`)
5. Boshqa 5 dasturchi senin `AuthContext`, `api.js` va shared komponentlaringni ishlatadi — imkon qadar tez yozib tugat
6. Routing to'g'ri ishlashi muhim — har bir dasturchi sahifasini test qilishi uchun

---

## Tekshirish:
- Admin akkaunt bilan kirib `/admin` da dashboard ko'rinishi kerak
- Talaba akkaunt bilan kirib `/` da talaba sahifasi ko'rinishi kerak
- Admin `/` ga kirmoqchi bo'lsa `/admin` ga qaytishi kerak
- Login qilinmagan holda har qanday sahifaga kirsa `/login` ga borishi kerak
