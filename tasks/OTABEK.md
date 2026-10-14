# Otabek — Bildirishnomalar, Profil va Umumiy UI elementlar
**Branch:** `feat/otabek/notifications-profile`

---

## Sen nima qilasan?

Sen platformaning **qo'shimcha lekin muhim** qismlarini qurasан:

1. **Bildirishnomalar tizimi** — admin va talabalar bildirishnomalar oladi
2. **Talaba profil sahifasi** — talaba o'z ma'lumotlarini ko'radi va tahrirlaydi
3. **Umumiy UI elementlar** — barcha dasturchilar ishlatiladigan komponentlar

---

# QISM 1 — BILDIRISHNOMALAR

---

## 1-VAZIFA — Bildirishnomalar paneli (Header da)

**Fayl:** `src/components/layout/NotificationPanel.jsx`

Header dagi qo'ng'iroq ikonkasi bosilganda Shadcn `Popover` ochiladi.
Bu komponent **ham admin, ham talaba** layoutidagi headerda ishlatiladi.

### Ko'rinishi:

```
┌─────────────────────────────────────────────────┐
│  Bildirishnomalar           [Barchasini o'qi]   │
├─────────────────────────────────────────────────┤
│                                                 │
│  ● [👤] Shaxruz yangi dars ko'rdi       2 daq  │  ← o'qilmagan
│  ● [💬] Farzona izoh qoldirdi           15 daq │  ← o'qilmagan
│    [📚] "React" kursiga qo'shildingiz    1 soat │  ← o'qilgan
│    [👤] Admin yangi dars yukladi         1 kun  │  ← o'qilgan
│                                                 │
│              [Barcha bildirishnomalar →]        │
└─────────────────────────────────────────────────┘
```

### Qoidalar:
- O'qilmagan bildirishnomalar: chap tomonda rangli nuqta `●` va hafif fon rangi
- Header dagi qo'ng'iroq ikonkasida o'qilmagan soni: qizil badge `3`
- `3` dan ko'p bo'lsa: `9+`
- "Barchasini o'qi" bosilganda hammasi o'qilgan bo'lib ko'rinsin
- Bitta bildirishnomaga bosish → tegishli sahifaga o'tish (masalan: dars bildirishnomasi → o'sha darsgа)
- Popover tashqarisiga bosish → yopilsin

### Bildirishnoma turlari va ikonkalari:
| Tur | Ikonka | Misol matn |
|-----|--------|------------|
| `new_lesson` | 📚 | "React kursiga yangi dars qo'shildi" |
| `added_to_group` | 👥 | "Siz React kursiga qo'shildingiz" |
| `comment` | 💬 | "Behruz 3-darsga izoh qoldirdi" |
| `removed_from_group` | 🚫 | "Siz React kursidan chiqarildingiz" |

### `api.js` ga qo'shish kerak:
- `getNotifications()` — bildirishnomalar ro'yxati
- `markAllRead()` — barchasini o'qilgan deb belgilash
- `markRead(id)` — bittasini o'qilgan deb belgilash

---

## 2-VAZIFA — Barcha bildirishnomalar sahifasi

**Fayl:** `src/pages/student/NotificationsPage.jsx`
va
**Fayl:** `src/pages/admin/NotificationsPage.jsx`

URL (talaba): `/notifications`
URL (admin): `/admin/notifications`

Popover dagi "Barcha bildirishnomalar →" havolasi shu sahifaga olib boradi.

```
┌──────────────────────────────────────────────────────────┐
│  Bildirishnomalar                   [Barchasini o'qi]    │
│                                                          │
│  Bugun                                                   │
│  ─────────────────────────────────────────────────       │
│  ● [📚] React kursiga yangi dars qo'shildi   09:30       │
│  ● [💬] Behruz 3-darsga izoh qoldirdi        08:15       │
│                                                          │
│  Kecha                                                   │
│  ─────────────────────────────────────────────────       │
│    [👥] Siz JavaScript kursiga qo'shildingiz  15:30      │
│    [👥] Siz React kursiga qo'shildingiz       10:00      │
└──────────────────────────────────────────────────────────┘
```

Bildirishnomalar sanasi bo'yicha guruhlangan: "Bugun", "Kecha", sanasi.

---

# QISM 2 — TALABA PROFILI

---

## 3-VAZIFA — Talaba profil sahifasi

**Fayl:** `src/pages/student/profile/StudentProfilePage.jsx`

URL: `/profile`

Talaba o'z profil ma'lumotlarini ko'radi va tahrirlaydi.
`api.js` dagi `getCurrentUser()` ma'lumotlarini ishlatadi.

### Ko'rinishi:

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│         [👤 Avatar — 100px doira]                        │
│         Behruz Toshmatov                                 │
│         behruz@example.com                               │
│         +998 90 123 45 67                                │
│         Qo'shilgan: 15 Yanvar 2025                       │
│                                                          │
│                 [✏ Profilni tahrirlash]                  │
│                                                          │
│  ──────────────────────────────────────────────────      │
│  Mening kurslarim (3)                                    │
│                                                          │
│  📚 React Dasturlash          3/12 dars ko'rildi         │
│  📚 JavaScript Asoslari       8/8 dars ko'rildi  ✓       │
│  📚 CSS Asoslari              0/6 dars ko'rildi          │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Kurslar ro'yxati:
- Ko'rilgan darslar nisbati: `3/12 dars ko'rildi`
- Progress bar: `[████████░░░░░░░░░░] 25%`
- Barcha darslar ko'rilsa: yashil `✓` belgi
- Kurs nomiga bosish → shu kurs sahifasiga o'tish (`/group/:id`)

---

## 4-VAZIFA — Profil tahrirlash modali

**Fayl:** `src/components/profile/EditProfileModal.jsx`

Shadcn `Dialog` ichida.

```
┌──────────────────────────────────────────────────┐
│  Profilni tahrirlash                       [✕]   │
│                                                  │
│        [👤 Avatar — 100px]                       │
│         [Rasmni o'zgartirish]                    │
│                                                  │
│  Ism *          [ Behruz_____________________ ]  │
│  Familiya *     [ Toshmatov_________________ ]   │
│  Telefon        [ +998 90 123 45 67_________ ]   │
│                                                  │
│  Parolni o'zgartirish (ixtiyoriy)                │
│  Hozirgi parol  [ _________________________ ]   │
│  Yangi parol    [ _________________________ ]   │
│  Tasdiqlash     [ _________________________ ]   │
│                                                  │
│         [Bekor qilish]   [Saqlash]               │
└──────────────────────────────────────────────────┘
```

### Qoidalar:
- Avatar tanlanganda doira ichida preview ko'rinsin
- Email o'zgartirib bo'lmaydi (faqat ko'rsatiladi — `disabled`)
- Parol o'zgartirish ixtiyoriy: faqat "Hozirgi parol" to'g'ri bo'lsa yangi parol qabul qilinsin
- Mock da: parolni tekshirmay saqlab qo'ysa ham bo'ladi (haqiqiy tekshiruv backend da)
- Saqlanganda `AuthContext` dagi `user` state ham yangilansin

`api.js` ga `updateProfile(data)` funksiyasini qo'sh.

---

# QISM 3 — UMUMIY UI ELEMENTLAR

---

## 5-VAZIFA — Qidiruv komponenti

**Fayl:** `src/components/shared/SearchInput.jsx`

Props: `{ value, onChange, placeholder, onSearch }`

```
┌──────────────────────────────────────────────────┐
│  🔍  [ Qidirish..._____________________________ ] │
└──────────────────────────────────────────────────┘
```

- Kiritilgandan `300ms` keyin `onChange` chaqirilsin (debounce — har harf bosilganda emas)
- `Esc` bosilganda maydon tozalansın
- `Enter` bosilganda `onSearch` chaqirilsin (agar berilgan bo'lsa)

Bu komponent `AdminStudentsPage`, `AdminGroupsPage` kabi sahifalarda ishlatiladi.

---

## 6-VAZIFA — Pagination komponenti

**Fayl:** `src/components/shared/Pagination.jsx`

Props: `{ currentPage, totalPages, onPageChange }`

```
[← Oldingi]   [1]  [2]  [3]  ...  [8]  [9]  [Keyingi →]
```

### Qoidalar:
- Birinchi sahifada "← Oldingi" `disabled`
- Oxirgi sahifada "Keyingi →" `disabled`
- Ko'p sahifa bo'lsa: `[1] [2] [3] [...] [8] [9] [10]` ko'rinishda
- Hozirgi sahifa boshqacha rang bilan ajratilgan

Bu komponent `AdminStudentsPage` da ishlatiladi.

---

## 7-VAZIFA — Avatar komponenti

**Fayl:** `src/components/shared/Avatar.jsx`

Props: `{ src, name, size }` — size: `"sm"` | `"md"` | `"lg"`

```
Rasm bor:              Rasm yo'q (fallback):
┌──────────────┐       ┌──────────────┐
│              │       │              │
│   [Rasm]     │       │    BT        │  ← ismi bosh harflari
│              │       │              │
└──────────────┘       └──────────────┘
```

- Rasm yuklanmasa → `getInitials(name)` funksiyasi bilan harflar ko'rinsin
- Harflar foni: nomga qarab rang (deterministik — har doim bir xil rang)
- Razmerlar: sm=32px, md=40px, lg=80px

Barcha joyda foydalanuvchi avatari shu komponent orqali ko'rsatilsin.

---

## 8-VAZIFA — StatusBadge komponenti

**Fayl:** `src/components/shared/StatusBadge.jsx`

Props: `{ status }` — `"active"` | `"blocked"` | `"published"` | `"draft"`

```
Aktiv:        ● Aktiv        (yashil)
Bloklangan:   ● Bloklangan   (qizil)
Nashr qilingan: ● Nashr      (ko'k)
Qoralama:     ● Qoralama     (kulrang)
```

Shadcn `Badge` komponentini asosga olish mumkin.

---

## Otabek uchun eslatmalar

1. **Birinchi kun:** `Avatar`, `StatusBadge`, `SearchInput`, `Pagination` — bular kerak bo'ladi, birinchi yoz
2. **Ikkinchi kun:** `NotificationPanel` (header da, popover)
3. **Uchinchi kun:** `NotificationsPage` (to'liq sahifa)
4. **To'rtinchi kun:** `StudentProfilePage`, `EditProfileModal`

**Muhim:**
- `Avatar` va `StatusBadge` komponentlarini **birinchi kuni** yoz — boshqa dasturchilar ishlatishi kerak
- Behruz headerga `NotificationPanel` ni qo'yish uchun joy qoldiradi
- `api.js` ga `getNotifications()`, `markAllRead()`, `updateProfile()` funksiyalarini qo'sh

**Tekshirish:**
- Talaba kursga qo'shilganda bildirishnoma kelishi kerak (mock: mockData ga bildirishnoma qo'shib test qil)
- Bildirishnomalar barchasini o'qilgan qilish ishlashi kerak
- Profil ma'lumotlarini tahrirlash va saqlash ishlashi kerak
- Parolni o'zgartirish ishlashi kerak
