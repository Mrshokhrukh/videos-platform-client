# Fariza — Admin: Talabalar Boshqaruvi va Izohlar
**Branch:** `feat/fariza/students-comments`

---

## Sen nima qilasan?

Sen **ikki muhim qismni** qurasان:

1. **Admin talabalar paneli** — admin barcha talabalarni ko'radi, qo'shadi, bloklaydi
2. **Izohlar tizimi** — talabalar darsga izoh qoldiradi, admin ko'ra oladi

---

# QISM 1 — TALABALAR BOSHQARUVI (Admin)

---

## 1-VAZIFA — Admin talabalar sahifasi

**Fayl:** `src/pages/admin/students/AdminStudentsPage.jsx`

URL: `/admin/students`

`api.js` dagi `getAllStudents()` funksiyasini chaqiradi.

### Ko'rinishi:

```
┌──────────────────────────────────────────────────────────┐
│  Talabalar boshqaruvi              [ + Yangi talaba ]    │
│                                                          │
│  Jami: 42 ta talaba  ·  Aktiv: 38  ·  Bloklangan: 4     │
│                                                          │
│  [🔍 Qidirish: ism yoki email...]     [Holat: Barchasi ▼]│
│                                                          │
│  ┌──────────────────────────────────────────────────┐    │
│  │ Ism              Email            Kurslar  Holat │    │
│  ├──────────────────────────────────────────────────┤    │
│  │[👤] Behruz T.    behruz@ex.com    2 kurs   ✅[⋮]│    │
│  │[👤] Shaxruz Y.   shaxruz@ex.com   1 kurs   ✅[⋮]│    │
│  │[👤] Otabek E.    otabek@ex.com    3 kurs   🚫[⋮]│    │
│  └──────────────────────────────────────────────────┘    │
│                                                          │
│                  [< 1  2  3 >]  ← pagination             │
└──────────────────────────────────────────────────────────┘
```

### Filtr va qidiruv:
- **Qidiruv:** ism yoki email bo'yicha (`api.js` chaqirmay, frontendda filter qilish)
- **Holat filter:** Barchasi / Aktiv / Bloklangan

### Jadval `[⋮]` dropdown:
- Ko'rish → talaba detail sahifasiga o'tish
- Kurslarni boshqarish → talabaning kurslarini tahrirlash modali
- Bloklash / Blokdan chiqarish
- O'chirish (tasdiqlash dialogi bilan)

### Uch holat:
1. **Yuklanmoqda** → jadval skeleton (5 qator)
2. **Bo'sh** → "Hali talaba qo'shilmagan"
3. **To'lgan** → jadval

---

## 2-VAZIFA — Yangi talaba qo'shish modali

**Fayl:** `src/components/students/AddStudentModal.jsx`

"+ Yangi talaba" tugmasi bosilganda Shadcn `Dialog` ochiladi.

```
┌──────────────────────────────────────────────────┐
│  Yangi talaba qo'shish                     [✕]   │
│                                                  │
│  Ism *                                           │
│  [ ____________________________________________ ] │
│                                                  │
│  Familiya *                                      │
│  [ ____________________________________________ ] │
│                                                  │
│  Email *                                         │
│  [ ____________________________________________ ] │
│                                                  │
│  Telefon                                         │
│  [ +998 __ ___ __ __ ]                           │
│                                                  │
│  Parol *                                         │
│  [ ____________________________________________ ] │
│  (Talaba bu parol bilan tizimga kiradi)           │
│                                                  │
│  Darhol kursga qo'shish (ixtiyoriy)              │
│  [ Kurs tanlang ▼ ]                              │
│                                                  │
│         [Bekor qilish]   [Qo'shish]              │
└──────────────────────────────────────────────────┘
```

### Validatsiyalar:
- Email format to'g'ri bo'lsin (@ belgisi va nuqta)
- Parol kamida 6 belgi
- Ism va familiya bo'sh bo'lmasin
- Bir xil email bilan ikkinchi talaba qo'shib bo'lmaydi (mock: tekshirib xato bering)

`api.js` ga `createStudent(data)` funksiyasini qo'sh va shu yerdan chaqir.

---

## 3-VAZIFA — Talaba detail sahifasi (Admin)

**Fayl:** `src/pages/admin/students/StudentDetailPage.jsx`

URL: `/admin/students/:id`

`getStudentById(id)` chaqiriladi.

```
┌──────────────────────────────────────────────────────────┐
│  [← Talabalar]                                           │
│                                                          │
│  [👤 avatar 80px]   Behruz Toshmatov                     │
│                     behruz@example.com                   │
│                     +998 90 123 45 67                    │
│                     Qo'shilgan: 15 Yanvar 2025           │
│                                                          │
│          [✏ Tahrirlash]   [🚫 Bloklash]                  │
│                                                          │
│  ──────────────────────────────────────────────          │
│  Qo'shilgan kurslar (2 ta)                               │
│                                                          │
│  [📚] React Dasturlash     Qo'shilgan: 10 Yan  [Chiqarish]│
│  [📚] JavaScript Asoslari  Qo'shilgan: 12 Yan  [Chiqarish]│
│                                                          │
│  [ + Kursga qo'shish ]                                   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Talabani bloklash:
- "Bloklash" tugmasi bosilganda tasdiqlash dialogi:
  ```
  "Behruz Toshmatov ni bloklaysizmi?
  Talaba tizimga kira olmaydi."
  [Bekor qilish]  [Ha, bloklash]
  ```
- Bloklangan talaba login qilmoqchi bo'lsa: "Hisobingiz bloklangan. Administrator bilan bog'laning."
- Bloklash → `toggleStudentActive(id)` chaqirilsin

### Kursdan chiqarish:
`removeStudentFromGroup(studentId, groupId)` chaqirilsin.

### Kursga qo'shish:
Farzona yozgan `AddStudentModal` ga o'xshash modal — lekin teskari:
Bu yerda talaba tanlangan, kurs tanlanadi.

---

## 4-VAZIFA — Talabani tahrirlash modali

**Fayl:** `src/components/students/EditStudentModal.jsx`

Admin talaba ma'lumotlarini o'zgartirishi uchun.

```
┌──────────────────────────────────────────────────┐
│  Talabani tahrirlash                       [✕]   │
│                                                  │
│  Ism *        [ Behruz______________________ ]   │
│  Familiya *   [ Toshmatov___________________ ]   │
│  Email *      [ behruz@example.com__________ ]   │
│  Telefon      [ +998 90 123 45 67___________ ]   │
│                                                  │
│  Yangi parol (ixtiyoriy)                         │
│  [ ____________________________________________ ] │
│  (bo'sh qoldirilsa parol o'zgarmaydi)            │
│                                                  │
│         [Bekor qilish]   [Saqlash]               │
└──────────────────────────────────────────────────┘
```

---

# QISM 2 — IZOHLAR TIZIMI (Talabalar uchun)

---

## 5-VAZIFA — `src/hooks/useComments.js`

Izohlar bilan ishlash uchun React hook.

### Nima saqlaydi:
- `comments` — izohlar massivi
- `loading` — yuklanmoqda
- `error` — xato xabari

### Funksiyalar:

**`loadComments(lessonId)`:**
`api.js` dagi `getComments(lessonId)` ni chaqiradi

**`addComment(lessonId, text)`:**
1. `addComment(lessonId, text)` ni chaqiradi
2. Muvaffaqiyatli bo'lsa: yangi izoh kommentarlar ro'yxatining **boshiga** qo'shiladi (optimistic update: avval UI ga qo'sh, keyin API ga yuborish)

**`deleteComment(commentId)`:**
Faqat admin yoki izoh egasi o'chira oladi.
1. `deleteComment(commentId)` chaqiriladi
2. Muvaffaqiyatli bo'lsa: `comments` dan o'chiriladi

---

## 6-VAZIFA — Izohlar bo'limi

**Fayl:** `src/components/comments/CommentsSection.jsx`

Props: `{ lessonId }`

Shaxruz dars sahifasida joy qoldiradi — sen shu joyga `CommentsSection` komponentini yozasан.

```
┌──────────────────────────────────────────────────────────┐
│  Izohlar (24)                    Saralash: [Eng yangi ▼] │
│                                                          │
│  [IZOH YOZISH MAYDONI]                                   │
│  ─────────────────────────────────────────────────────   │
│  [IZOH 1]                                                │
│  [IZOH 2]                                                │
│  [IZOH 3]                                                │
│  ...                                                     │
│                                                          │
│             [ Ko'proq yuklash (18 ta) ]                  │
└──────────────────────────────────────────────────────────┘
```

---

## 7-VAZIFA — Izoh yozish maydoni

**Fayl:** `src/components/comments/CommentInput.jsx`

Props: `{ onSubmit, placeholder }`

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [👤]   [ Izoh yozing...                          ]     │
│                                             450/1000     │
│                              [Izoh qoldirish]            │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Qoidalar:
- `textarea` bo'lib, yozganda avtomatik balandlik oshsin
- Belgilar sanoqchisi: 900+ bo'lsa sariq, 1000 bo'lsa qizil rang
- Bo'sh holda "Izoh qoldirish" tugmasi `disabled`
- Yuborilgandan keyin: textarea tozalansin, fokus saqlansin
- Avatar — `AuthContext` dan hozirgi foydalanuvchi avatari

---

## 8-VAZIFA — Bitta izoh komponenti

**Fayl:** `src/components/comments/CommentItem.jsx`

Props: `{ comment, onDelete }`

```
┌──────────────────────────────────────────────────────────┐
│  [👤]  Behruz Toshmatov         3 soat oldin        [⋮] │
│        Bu darsda useEffect ni juda yaxshi tushuntirdingiz│
│        Rahmat!                                           │
└──────────────────────────────────────────────────────────┘
```

### `[⋮]` dropdown:
- **Talaba o'z izohini ko'rsa:** "Tahrirlash", "O'chirish"
- **Admin har qanday izohni ko'rsa:** "O'chirish"
- **Boshqa birovning izohi:** menyu chiqmaydi

### Izohni tahrirlash:
"Tahrirlash" bosilganda matn `CommentInput` ga aylansin:
```
[👤]  [ Bu darsda useEffect ni...___________]
      [Bekor qilish]   [Saqlash]
```

### Uzun izohlar:
4 qatordan uzun bo'lsa "Ko'proq ko'rish" tugmasi bilan qisqartirilsin.

---

## 9-VAZIFA — Admin: Barcha izohlarni ko'rish

**Fayl:** `src/pages/admin/groups/AdminGroupCommentsPage.jsx`

URL: `/admin/groups/:groupId/comments`

Admin dars izohlarini kuzatib turishi va zarur bo'lsa o'chirishi uchun.

```
┌──────────────────────────────────────────────────────────┐
│  React Dasturlash → Izohlar                              │
│                                                          │
│  Dars:  [Barchasi ▼] → yoki bitta dars bo'yicha          │
│                                                          │
│  [Izoh 1 — Behruz, 3-dars, 2 soat oldin]  [🗑]          │
│  [Izoh 2 — Shaxruz, 1-dars, 1 kun oldin]  [🗑]          │
│  [Izoh 3 — Farzona, 5-dars, 3 kun oldin]  [🗑]          │
└──────────────────────────────────────────────────────────┘
```

---

## Fariza uchun eslatmalar

1. **Birinchi kun:** `AdminStudentsPage` (jadval, qidiruv, filtr)
2. **Ikkinchi kun:** `AddStudentModal`, `EditStudentModal`
3. **Uchinchi kun:** `StudentDetailPage`, bloklash logikasi
4. **To'rtinchi kun:** Izohlar — `useComments`, `CommentsSection`, `CommentInput`, `CommentItem`

**Muhim:**
- Behruz yozgan `ConfirmDialog` ni o'chirish/bloklash amallarida ishlatasan
- Shaxruz `LessonPage` da izohlar uchun joy qoldiradi — `CommentsSection` komponentini o'sha joyga qo'yasан
- `api.js` ga `createStudent()` funksiyasini qo'sh

**Tekshirish:**
- Admin talaba qo'shib, uni guruhga qo'sha olsin
- Talabani bloklash ishlashi kerak
- Talaba akkaunt bilan darsga izoh qoldirish ishlashi kerak
- Izohni o'chirish ishlashi kerak
