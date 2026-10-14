# Farzona — Admin: Guruhlar (Kurslar) Boshqaruvi
**Branch:** `feat/farzona/admin-groups`

---

## Sen nima qilasan?

Sen **admin panelining guruhlar bo'limini** qurasан.
Admin bu sahifadan:
- Yangi guruh (kurs) yaratadi
- Guruhga talabalarni qo'shadi/chiqaradi
- Guruhning darslarini ko'radi
- Guruhni tahrirlaydi yoki o'chiradi

---

## 1-VAZIFA — Admin guruhlar sahifasi

**Fayl:** `src/pages/admin/groups/AdminGroupsPage.jsx`

URL: `/admin/groups`

`api.js` dagi `getAllGroups()` funksiyasini chaqiradi.

### Ko'rinishi:

```
┌──────────────────────────────────────────────────────────┐
│  Guruhlar boshqaruvi                [ + Yangi guruh ]    │
│                                                          │
│  Jami: 8 ta guruh  ·  Aktiv: 6  ·  Yopilgan: 2          │
│                                                          │
│  [Qidirish: guruh nomi bo'yicha...]                      │
│                                                          │
│  ┌───────────────────────────────────────────────────┐   │
│  │  React Dasturlash    12 dars   18 talaba  Aktiv   │   │
│  │  JavaScript Asoslari  8 dars   12 talaba  Aktiv   │   │
│  │  CSS va HTML          6 dars    7 talaba  Aktiv   │   │
│  │  Python kirish        5 dars    5 talaba  Yopiq   │   │
│  └───────────────────────────────────────────────────┘   │
└──────────────────────────────────────────────────────────┘
```

### Uch holat:
1. **Yuklanmoqda** → jadval skeleton
2. **Bo'sh** → "Hali guruh yaratilmagan. [ + Yangi guruh ] "
3. **To'lgan** → jadval yoki kartochkalar

---

## 2-VAZIFA — Guruh ro'yxat qatori komponenti

**Fayl:** `src/components/groups/AdminGroupRow.jsx`

Props: `{ group, onEdit, onDelete, onClick }`

```
┌─────────────────────────────────────────────────────────────┐
│  [🖼]  React Dasturlash         12 dars  18 talaba  ✅      │
│        React va hooks asoslari                   [✏] [🗑]  │
└─────────────────────────────────────────────────────────────┘
```

- Qatorga bosish → guruh detail sahifasiga o'tish
- `[✏]` → Guruhni tahrirlash modali ochilsin
- `[🗑]` → O'chirish tasdiqlash dialogi (Behruz yozgan `ConfirmDialog` ishlatilsin)
- Aktiv/Yopiq holat badge ko'rinishida (yashil/kulrang)

---

## 3-VAZIFA — Guruh yaratish modali

**Fayl:** `src/components/groups/CreateGroupModal.jsx`

"+ Yangi guruh" tugmasi bosilganda Shadcn `Dialog` ochiladi.

### Ko'rinishi:

```
┌──────────────────────────────────────────────────┐
│  Yangi guruh yaratish                      [✕]   │
│                                                  │
│  Guruh nomi *                                    │
│  [ ____________________________________________ ] │
│                                                  │
│  Tavsif                                          │
│  [ ____________________________________________ ] │
│  [ ____________________________________________ ] │
│                                                  │
│  Muqova rasm                                     │
│  [ + Rasm tanlang ]   (preview ko'rinsin)        │
│                                                  │
│  Holat                                           │
│  (●) Aktiv   (○) Yopiq                           │
│                                                  │
│         [Bekor qilish]   [Yaratish]              │
└──────────────────────────────────────────────────┘
```

### Qoidalar:
- Guruh nomi majburiy (bo'sh bo'lsa xato)
- Muqova rasm tanlanganda preview ko'rinsin
- "Yaratish" bosilganda `api.js` dagi `createGroup(data)` chaqirilsin
- Muvaffaqiyatli bo'lsa: modal yopilsin, guruhlar ro'yxati yangilansin
- Yuklanish paytida: "Yaratish" tugmasi disabled va spinner

---

## 4-VAZIFA — Guruhni tahrirlash modali

**Fayl:** `src/components/groups/EditGroupModal.jsx`

`CreateGroupModal` ga o'xshash, lekin mavjud ma'lumotlar bilan to'ldirilgan.

```
┌──────────────────────────────────────────────────┐
│  Guruhni tahrirlash                        [✕]   │
│                                                  │
│  Guruh nomi *                                    │
│  [ React Dasturlash___________________________ ] │
│                                                  │
│  Tavsif                                          │
│  [ React hooks, components va boshqalar....   ] │
│                                                  │
│  Muqova rasm                                     │
│  [mavjud rasm preview]  [ Rasmni o'zgartirish ]  │
│                                                  │
│  Holat                                           │
│  (●) Aktiv   (○) Yopiq                           │
│                                                  │
│         [Bekor qilish]   [Saqlash]               │
└──────────────────────────────────────────────────┘
```

`api.js` dagi `updateGroup(id, data)` chaqirilsin.

---

## 5-VAZIFA — Guruh detail sahifasi (Admin)

**Fayl:** `src/pages/admin/groups/AdminGroupDetailPage.jsx`

URL: `/admin/groups/:id`

`getGroupById(id)`, `getGroupLessons(id)`, `getGroupMembers(id)` chaqiriladi.

### Ko'rinishi:

```
┌──────────────────────────────────────────────────────────┐
│  [← Guruhlar]                                            │
│                                                          │
│  [muqova rasm]                                           │
│  React Dasturlash          [✏ Tahrirlash]  [🗑 O'chirish]│
│  12 ta dars  ·  18 ta talaba  ·  Aktiv ✅                │
│                                                          │
│  [  Darslar (12)  |  Talabalar (18)  ]  ← Tabs           │
│  ──────────────────────────────────────                  │
│                                                          │
│  (DARSLAR TAB — default):                                │
│  [ + Dars qo'shish ] → `/admin/groups/:id/upload`        │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ 1.  React nima? — kirish               10:25  [⋮] │  │
│  │ 2.  JSX sintaksisi                     18:40  [⋮] │  │
│  │ 3.  Komponentlar va Props              22:15  [⋮] │  │
│  └────────────────────────────────────────────────────┘  │
│                                                          │
│  (TALABALAR TAB):                                        │
│  [ + Talaba qo'shish ]                                   │
│                                                          │
│  ┌────────────────────────────────────────────────────┐  │
│  │ [👤] Behruz Toshmatov  behruz@ex.com    [Chiqarish]│  │
│  │ [👤] Shaxruz Yusupov   shaxruz@ex.com   [Chiqarish]│  │
│  └────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────┘
```

### Darslar tab:
- "Dars qo'shish" tugmasi → `/admin/groups/:id/upload` sahifasiga o'tish (Shakarboyev yozadi)
- Dars ro'yxati — Shakarboyev yozgan `LessonCard` komponentini ishlatish
- Drag & drop bilan tartibini o'zgartirish (ixtiyoriy, bonus)

### Talabalar tab:
- "Talaba qo'shish" tugmasi → `AddStudentModal` ni ochish (6-vazifa)
- Har bir talaba yonida "Guruhdan chiqarish" tugmasi
- Chiqarishdan oldin `ConfirmDialog` ko'rsat

---

## 6-VAZIFA — Guruhga talaba qo'shish modali

**Fayl:** `src/components/groups/AddStudentModal.jsx`

Admin guruh detail sahifasidan "Talaba qo'shish" bosganda Shadcn `Dialog` ochiladi.

```
┌──────────────────────────────────────────────────┐
│  Guruhga talaba qo'shish                   [✕]   │
│                                                  │
│  [🔍 Talabani qidirish: ism yoki email...]        │
│                                                  │
│  ──────────────────────────────────────────────  │
│  Qidiruv natijalari:                             │
│                                                  │
│  [👤] Otabek Ergashev    otabek@ex.com   [+ Qo'sh]│
│  [👤] Fariza Nazarova    fariza@ex.com   [+ Qo'sh]│
│                                                  │
│  (Allaqachon guruhda bo'lganlar yashiriladi)      │
│  (Natija topilmasa: "Talaba topilmadi")          │
│                                                  │
│                             [Yopish]             │
└──────────────────────────────────────────────────┘
```

### Qoidalar:
- Qidiruv: kamida 2 ta harf kiritilganda natijalar chiqsin
- Qidiruv mock: `getAllStudents()` chaqirib, frontendda filter qilsin
- "Qo'sh" bosilganda: `addStudentToGroup(studentId, groupId)` chaqirilsin
- Qo'shilgandan keyin shu talaba ro'yxatdan o'chsin va "✓ Qo'shildi" ko'rinsin
- Bir necha talabani birma-bir qo'shish mumkin

---

## 7-VAZIFA — Guruhni o'chirish

Guruh o'chirilganda Behruz yozgan `ConfirmDialog` ishlatilsin:

```
"React Dasturlash guruhini o'chirmoqchimisiz?

Bu amal qaytarib bo'lmaydi. Guruh va unga tegishli
barcha darslar o'chiriladi. 18 ta talaba guruhdan
chiqariladi.

[Bekor qilish]    [Ha, o'chirish]"
```

`deleteGroup(id)` chaqirilsin → guruhlar ro'yxatiga qaytish.

---

## Farzona uchun eslatmalar

1. **Birinchi kun:** `AdminGroupsPage`, `AdminGroupRow` komponenti
2. **Ikkinchi kun:** `CreateGroupModal`, `EditGroupModal`
3. **Uchinchi kun:** `AdminGroupDetailPage` — Darslar tab
4. **To'rtinchi kun:** Talabalar tab, `AddStudentModal`

**Muhim:**
- Behruz yozgan `ConfirmDialog` komponentini o'chirish amallarida ishlatasan
- Shakarboyev yozgan `LessonCard` komponentini Darslar tabida ishlatasan
- Fariza (D5) yozadigan talaba ma'lumotlari sening Talabalar tabingda ko'rinadi — ular bilan kelishib ishlaganingiz ma'qul

**Tekshirish:**
- Admin akkaunt bilan kir
- Guruh yaratib, uni tahrirlang
- Guruhga talabalar qo'shing
- Guruhni o'chiring — tasdiqlash dialogi chiqishi kerak
