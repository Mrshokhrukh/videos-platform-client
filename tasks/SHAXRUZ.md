# Shaxruz — Talaba darslari sahifasi va darsni ko'rish
**Branch:** `feat/shaxruz/lesson-view`

---

## Sen nima qilasan?

Sen **talabalar** tomonidan ko'riladigan sahifalarni qurasан:
- Talaba tizimga kirganida o'zining guruhlarini ko'radi
- Guruhni ochganda darslar ro'yxatini ko'radi
- Darsni ochganda video o'ynaydi, izoh qoldiradi

**Shakarboyev** (D2) video yuklaydigan admin qismini va player komponentini yozadi.
**Sen** esa o'sha player ni ishlatib talaba sahifalarini qurasан.

---

## 1-VAZIFA — Talaba bosh sahifasi

**Fayl:** `src/pages/student/home/StudentHomePage.jsx`

Talaba tizimga kirganida birinchi ko'radigan sahifa.
`api.js` dagi `getMyGroups()` funksiyasini chaqiradi.

### Ko'rinishi:

```
┌──────────────────────────────────────────────────────────┐
│  Salom, Behruz! 👋                                       │
│                                                          │
│  Mening kurslarim (3)                                    │
│                                                          │
│  ┌────────────────┐  ┌────────────────┐  ┌────────────┐  │
│  │ [muqova rasm]  │  │ [muqova rasm]  │  │ [muqova]   │  │
│  │ React          │  │ JavaScript     │  │ CSS        │  │
│  │ Dasturlash     │  │ Asoslari       │  │ Asoslari   │  │
│  │                │  │                │  │            │  │
│  │ 12 ta dars     │  │ 8 ta dars      │  │ 6 ta dars  │  │
│  │ [Ochish →]     │  │ [Ochish →]     │  │ [Ochish →] │  │
│  └────────────────┘  └────────────────┘  └────────────┘  │
│                                                          │
│  Hech qanday kurs yo'q (bo'sh holat):                    │
│         📚                                               │
│    Siz hali hech qanday kursga qo'shilmagansiz.          │
│    Administrator bilan bog'laning.                       │
└──────────────────────────────────────────────────────────┘
```

### Uch holat ko'rsatish:
1. **Yuklanmoqda** → 3 ta kurs kartochkasi skeleton (Shadcn `Skeleton`)
2. **Bo'sh** → ikonka va "Administrator bilan bog'laning" xabari
3. **To'lgan** → kurs kartochkalari grid da

---

## 2-VAZIFA — Kurs kartochkasi (Talaba uchun)

**Fayl:** `src/components/groups/StudentGroupCard.jsx`

Props: `{ group }` — guruh ob'ekti

```
┌──────────────────────────────────────────────────┐
│  [muqova rasm — 16:9, object-cover]              │
├──────────────────────────────────────────────────┤
│  React Dasturlash                                │
│  12 ta dars                                      │
│                                                  │
│                        [Darslarni ko'rish →]     │
└──────────────────────────────────────────────────┘
```

- Kurs nomini 2 qatorda qisqartirish (`line-clamp-2`)
- Bosib `/group/:id` sahifasiga o'tish

---

## 3-VAZIFA — Guruh darslari sahifasi (Talaba uchun)

**Fayl:** `src/pages/student/group/StudentGroupPage.jsx`

URL: `/group/:id`

`api.js` dagi `getGroupLessons(groupId)` funksiyasini chaqiradi.
Faqat `isPublished: true` bo'lgan darslar ko'rinadi.

### Ko'rinishi:

```
┌──────────────────────────────────────────────────────────┐
│                                                          │
│  [← Orqaga]    React Dasturlash                          │
│                12 ta dars                                │
│                                                          │
│  ┌───────────────────────────────────────────────────┐   │
│  │  1.  React nima? — Kirish darsi            10:25  │   │
│  │  2.  JSX sintaksisi                        18:40  │   │
│  │  3.  Komponentlar va Props                 22:15  │   │
│  │  4.  useState hook                         35:00  │   │
│  │  5.  useEffect hook                        28:30  │   │
│  │      ...                                          │   │
│  └───────────────────────────────────────────────────┘   │
│                                                          │
└──────────────────────────────────────────────────────────┘
```

### Dars ro'yxati elementi ko'rinishi:

```
┌───────────────────────────────────────────────────────┐
│  [▶] 3.  Komponentlar va Props            22:15       │
│          Qo'shilgan: 5 kun oldin                      │
└───────────────────────────────────────────────────────┘
```

- Bosilganda `/lesson/:id` sahifasiga o'tish
- Hover qilganda hafif rang o'zgarishi

---

## 4-VAZIFA — Dars ko'rish sahifasi

**Fayl:** `src/pages/student/lesson/LessonPage.jsx`

URL: `/lesson/:id`

Bu eng muhim sahifa — talaba shu yerda dars ko'radi.
`api.js` dagi `getLessonById(id)` funksiyasini chaqiradi.

### Ko'rinishi (katta ekran):

```
┌────────────────────────────────────────────────────────────────┐
│  [← React Dasturlash kursiga qaytish]                          │
├───────────────────────────────────┬────────────────────────────┤
│                                   │                            │
│  ┌────────────────────────────┐   │   Darslar ro'yxati         │
│  │                            │   │   ─────────────────        │
│  │  [Bunny.net Video Player]  │   │   1. React nima?  ✓       │
│  │                            │   │   2. JSX          ✓       │
│  │                            │   │ → 3. Komponentlar ◀       │
│  └────────────────────────────┘   │   4. useState             │
│                                   │   5. useEffect            │
│  Komponentlar va Props            │   ...                      │
│  Darsi 3 · 22:15                  │                            │
│                                   │   [← Oldingi dars]         │
│  Tavsif:                          │   [Keyingi dars →]         │
│  Bu darsda React komponentlari... │                            │
│                                   │                            │
│  ──────────────────────────────   │                            │
│  IZOHLAR                          │                            │
│  (Fariza yozadi — joy qoldiring)  │                            │
│                                   │                            │
└───────────────────────────────────┴────────────────────────────┘
```

### Mobil ko'rinish (600px dan kichik):
Darslar ro'yxati yuqoriga chiqsin (collapsible panel), video va izohlar pastda.

### Tafsilotlar:

**Video Player:**
Shakarboyev yozgan `VideoPlayer` komponentini import qil va ishlatib qo'y.

**"Oldingi" va "Keyingi" tugmalari:**
- Hozirgi darsning `order` sini bilgan holda oldingi/keyingi darslarni topish
- Oldingi dars yo'q bo'lsa — "Oldingi dars" tugmasi yashirilsin
- Keyingi dars yo'q bo'lsa — "Bu kursning oxirgi darsi" xabari

**O'ng panel — Darslar ro'yxati:**
- Hozirgi dars yonida `▶` belgisi va ajratilgan rang
- Ro'yxatdagi darsga bosilganda shu dars yuklansin (sahifa yangilanmasdan)
- 70% kenglikda video, 30% kenglikda darslar ro'yxati

**Izohlar:**
Fariza (D5) izohlar komponentini yozadi.
Sen shunchaki shu joy uchun: `{/* <CommentsSection lessonId={id} /> */}` yoz va joy qoldир.

---

## 5-VAZIFA — Dars ko'rish sahifasiga qo'shimcha: Progress

Talaba qaysi darslarni ko'rganini ko'rsatish.

**`localStorage` da saqlash:**
```
key: "watched_lessons"
value: ["lesson-id-1", "lesson-id-3", "lesson-id-5", ...]
```

Dars sahifasi ochilganda shu darsning IDsini ro'yxatga qo'sh.

**Guruh sahifasida:**
```
┌───────────────────────────────────────────────────────┐
│  ✓  1.  React nima? — Kirish darsi            10:25  │  ← ko'rilgan
│  ✓  2.  JSX sintaksisi                        18:40  │  ← ko'rilgan
│  ▶  3.  Komponentlar va Props                 22:15  │  ← hozirgi
│     4.  useState hook                         35:00  │  ← ko'rilmagan
└───────────────────────────────────────────────────────┘
```

Ko'rilgan darslar — qoʻshimcha `✓` belgi va kulrang rang.

**Guruh kartochkasida progress:**
```
┌──────────────────────────────────────────────┐
│  [muqova rasm]                               │
│  React Dasturlash                            │
│  3 / 12 ta dars ko'rildi                     │
│  [███░░░░░░░░░░░░] 25%                        │
│                       [Davom etish →]        │
└──────────────────────────────────────────────┘
```

---

## 6-VAZIFA — Dars ma'lumotlarini tahrirlash (Admin uchun)

**Fayl:** `src/components/video/EditLessonModal.jsx`

Admin dars kartochkasidagi `[⋮]` → "Tahrirlash" bosganida ochiladi.

Shadcn `Dialog` ichida:

```
┌──────────────────────────────────────────────────┐
│  Darsni tahrirlash                               │
│                                                  │
│  Sarlavha *                                      │
│  [ _________________________________ ]           │
│                                                  │
│  Tavsif                                          │
│  [ _________________________________ ]           │
│                                                  │
│  Tartib raqami                                   │
│  [ 3 ]                                           │
│                                                  │
│  Holat                                           │
│  (●) Nashr qilingan   (○) Qoralama               │
│                                                  │
│  [Bekor qilish]             [Saqlash]            │
└──────────────────────────────────────────────────┘
```

`api.js` dagi `updateLesson(id, data)` chaqirilsin.
Muvaffaqiyatli bo'lsa modal yopilsin va dars ro'yxati yangilansin.

---

## Shaxruz uchun eslatmalar

1. **Birinchi kun:** `StudentHomePage`, `StudentGroupCard`
2. **Ikkinchi kun:** `StudentGroupPage` (darslar ro'yxati)
3. **Uchinchi kun:** `LessonPage` asosiy ko'rinishi
4. **To'rtinchi kun:** Progress, `EditLessonModal`

**Muhim:**
- Shakarboyev `VideoPlayer` komponentini yozadi — sen uni import qilib ishlatasan
- Fariza `CommentsSection` komponentini yozadi — sen uchun joy qoldirasan
- Talaba faqat o'zi a'zo bo'lgan guruhlarni ko'ra olishi kerak — bu tekshiruv backend da bo'ladi, frontendda ham `api.js` orqali faqat o'z guruhlari keladi

**Tekshirish:**
- Talaba akkaunt bilan kir
- Guruhlar ko'rinishi kerak
- Guruhni ochib darslar ko'rinishi kerak
- Darsni ochib video player ishlashi kerak
- Oldingi/keyingi dars navigatsiyasi ishlashi kerak
