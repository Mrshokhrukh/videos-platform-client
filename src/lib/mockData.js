const avatar = (id) => `https://i.pravatar.cc/120?img=${id}`
const image = (id) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=900&q=80`

export const adminUser = {
  id: 'admin-1', role: 'admin', fullName: 'Administrator', email: 'admin@platform.uz',
  password: 'admin123', avatar: avatar(12),
}

const names = [
  'Behruz Toshmatov', 'Shaxruz Yusupov', 'Farzona Karimova', 'Azizbek Rasulov',
  'Madina Sobirova', 'Jasur Ahmedov', 'Nilufar Aliyeva', 'Sardor Ergashev',
  'Sevara Ismoilova', 'Kamron Qodirov', 'Diyora Akbarova', 'Muhammad Saidov',
]
const groupIdsByStudent = [
  ['group-1'], ['group-2'], ['group-1', 'group-3'], ['group-1'], ['group-2'], ['group-3'],
  ['group-4'], ['group-4'], ['group-2', 'group-4'], ['group-3'], ['group-1'], ['group-2'],
]
export const students = names.map((fullName, index) => ({
  id: `student-${index + 1}`, role: 'student', fullName,
  email: `student${index + 1}@platform.uz`, password: 'student123', avatar: avatar(index + 1),
  groupIds: groupIdsByStudent[index], phone: `+998 90 123 45 ${String(index + 10).slice(-2)}`,
  createdAt: new Date(Date.now() - index * 86400000).toISOString(), isActive: index !== 9,
}))

export const groups = [
  { id: 'group-1', name: 'React Dasturlash', description: 'React va zamonaviy frontend dasturlash asoslari.', coverImage: image('photo-1633356122544-f134324a6cee'), studentIds: [], lessonCount: 3, isActive: true, createdAt: '2025-01-10T10:00:00Z', adminId: adminUser.id },
  { id: 'group-2', name: 'JavaScript Asoslari', description: 'JavaScript tilining asosiy tushunchalari va amaliyoti.', coverImage: image('photo-1627398242454-45a1465c2479'), studentIds: [], lessonCount: 3, isActive: true, createdAt: '2025-02-02T10:00:00Z', adminId: adminUser.id },
  { id: 'group-3', name: 'UI/UX Dizayn', description: 'Foydalanuvchi interfeysi va tajribasi dizayni.', coverImage: image('photo-1558655146-d09347e92766'), studentIds: [], lessonCount: 3, isActive: true, createdAt: '2025-02-15T10:00:00Z', adminId: adminUser.id },
  { id: 'group-4', name: 'HTML va CSS', description: 'Veb sahifa tuzilishi va vizual bezash.', coverImage: image('photo-1507721999472-8ed4421c4af2'), studentIds: [], lessonCount: 3, isActive: true, createdAt: '2025-03-01T10:00:00Z', adminId: adminUser.id },
]
groups.forEach((group) => { group.studentIds = students.filter((student) => student.groupIds.includes(group.id)).map((student) => student.id) })

const lessonTitles = [
  ['React bilan tanishuv', 'Komponentlar va JSX', 'Props va state'],
  ['JavaScriptga kirish', 'O‘zgaruvchilar va turlar', 'Funksiyalar'],
  ['Dizayn tamoyillari', 'Figma bilan ishlash', 'Prototiplash'],
  ['HTML hujjat tuzilishi', 'CSS selektorlar', 'Flexbox va Grid'],
]
export const lessons = groups.flatMap((group, groupIndex) => lessonTitles[groupIndex].map((title, index) => ({
  id: `lesson-${groupIndex * 3 + index + 1}`, title,
  description: `${title} bo‘yicha amaliy dars va asosiy tushunchalar.`,
  thumbnail: group.coverImage, videoId: `bunny-demo-${groupIndex + 1}-${index + 1}`,
  duration: 420 + groupIndex * 55 + index * 125, order: index + 1, groupId: group.id,
  isPublished: !(groupIndex === 3 && index === 2),
  createdAt: new Date(Date.now() - (groupIndex * 3 + index) * 86400000).toISOString(),
})))

export const comments = Array.from({ length: 18 }, (_, index) => ({
  id: `comment-${index + 1}`,
  text: [
    'Tushunarli va foydali dars, rahmat!', 'Amaliy misollar mavzuni yaxshi ochib berdi.',
    'Shu mavzu bo‘yicha qo‘shimcha material bormi?', 'Darsni qayta ko‘rib, topshiriqni bajardim.',
    'Juda yaxshi tushuntirilgan.', 'Keyingi darsni kutaman!',
  ][index % 6],
  lessonId: `lesson-${(index % 12) + 1}`, authorId: students[index % students.length].id,
  createdAt: new Date(Date.now() - index * 3600000).toISOString(),
}))

export const users = [adminUser, ...students]
