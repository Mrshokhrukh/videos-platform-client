import { delay } from "./utils"

const STORAGE_KEY = "edumanage-groups"
const CURRENT_STUDENT_KEY = "current_student_id"

const initialStudents = [
  { id: "student-1", name: "Behruz Toshmatov", email: "behruz@example.com" },
  { id: "student-2", name: "Shaxruz Yusupov", email: "shaxruz@example.com" },
  { id: "student-3", name: "Otabek Ergashev", email: "otabek@example.com" },
  { id: "student-4", name: "Fariza Nazarova", email: "fariza@example.com" },
  { id: "student-5", name: "Shakarboyev Karimov", email: "shakarboyev@example.com" },
]

const initialGroups = [
  {
    id: "group-1",
    name: "React dasturlash",
    description: "React va zamonaviy frontend asoslari.",
    coverImage: "",
    status: "active",
    members: ["student-1", "student-3"],
    lessons: [
      { id: "lesson-1", title: "React bilan tanishuv", duration: 625 },
      { id: "lesson-2", title: "Komponentlar va props", duration: 1120 },
      { id: "lesson-3", title: "State va hodisalar", duration: 1340 },
    ],
  },
  {
    id: "group-2",
    name: "JavaScript asoslari",
    description: "JavaScript tilining asosiy tushunchalari.",
    coverImage: "",
    status: "active",
    members: ["student-2", "student-4"],
    lessons: [
      { id: "lesson-4", title: "O'zgaruvchilar va turlar", duration: 840 },
      { id: "lesson-5", title: "Funksiyalar", duration: 960 },
    ],
  },
  {
    id: "group-3",
    name: "HTML va CSS",
    description: "Veb sahifalar yaratish asoslari.",
    coverImage: "",
    status: "closed",
    members: ["student-5"],
    lessons: [],
  },
]

function readGroups() {
  const storedGroups = localStorage.getItem(STORAGE_KEY)
  if (storedGroups === null) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initialGroups))
    return initialGroups
  }

  const groups = JSON.parse(storedGroups)
  if (!Array.isArray(groups)) {
    throw new Error("Guruhlar ma'lumotini o'qib bo'lmadi.")
  }
  return groups
}

function writeGroups(groups) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(groups))
}

function withCounts(group) {
  const lessons = Array.isArray(group.lessons) ? group.lessons : []
  return {
    ...group,
    lessons,
    lessonCount: lessons.length,
    memberCount: group.members.length,
  }
}

function normalizeLesson(lesson, index, groupId) {
  const order = Number(lesson.order)
  return {
    ...lesson,
    groupId,
    order: Number.isInteger(order) && order > 0 ? order : index + 1,
    description: lesson.description ?? "",
    isPublished: lesson.isPublished !== false,
  }
}

function getCurrentStudentId() {
  return localStorage.getItem(CURRENT_STUDENT_KEY) || "student-1"
}

export async function getAllGroups() {
  await delay(200)
  return readGroups().map(withCounts)
}

export async function getGroupById(id) {
  await delay(150)
  const group = readGroups().find((item) => item.id === id)
  if (!group) throw new Error("Guruh topilmadi.")
  return withCounts(group)
}

export async function getMyGroups() {
  await delay(200)
  const studentId = getCurrentStudentId()
  return readGroups()
    .filter((group) => group.members.includes(studentId))
    .map((group) => {
      const lessons = group.lessons
        .map((lesson, index) => normalizeLesson(lesson, index, group.id))
        .filter((lesson) => lesson.isPublished)
      return { ...withCounts(group), lessons, lessonCount: lessons.length }
    })
}

export async function getGroupLessons(id, { includeUnpublished = false } = {}) {
  await delay(150)
  const group = readGroups().find((item) => item.id === id)
  if (!group) throw new Error("Guruh topilmadi.")
  const lessons = group.lessons
    .map((lesson, index) => normalizeLesson(lesson, index, group.id))
    .sort((first, second) => first.order - second.order)
  return includeUnpublished ? lessons : lessons.filter((lesson) => lesson.isPublished)
}

export async function getLessonById(id) {
  await delay(150)
  const group = readGroups().find((item) => item.lessons.some((lesson) => lesson.id === id))
  if (!group) throw new Error("Dars topilmadi.")
  const lessons = group.lessons
    .map((lesson, index) => normalizeLesson(lesson, index, group.id))
    .sort((first, second) => first.order - second.order)
  const lesson = lessons.find((item) => item.id === id)
  if (!lesson?.isPublished) throw new Error("Dars topilmadi.")
  return { ...lesson, groupName: group.name, lessons }
}

export async function updateLesson(id, data) {
  await delay(250)
  const groups = readGroups()
  const group = groups.find((item) => item.lessons.some((lesson) => lesson.id === id))
  if (!group) throw new Error("Tahrirlanadigan dars topilmadi.")

  const lessonIndex = group.lessons.findIndex((lesson) => lesson.id === id)
  const current = normalizeLesson(group.lessons[lessonIndex], lessonIndex, group.id)
  const title = String(data.title ?? current.title).trim()
  const order = Number(data.order ?? current.order)
  if (!title) throw new Error("Dars sarlavhasi bo'sh bo'lmasligi kerak.")
  if (!Number.isInteger(order) || order < 1) throw new Error("Tartib raqami 1 yoki undan katta butun son bo'lishi kerak.")

  const updatedLesson = {
    ...current,
    title,
    description: String(data.description ?? current.description).trim(),
    order,
    isPublished: Boolean(data.isPublished ?? current.isPublished),
  }
  group.lessons[lessonIndex] = updatedLesson
  writeGroups(groups)
  return updatedLesson
}

export async function getGroupMembers(id) {
  await delay(150)
  const group = readGroups().find((item) => item.id === id)
  if (!group) throw new Error("Guruh topilmadi.")
  const members = new Set(group.members)
  return initialStudents.filter((student) => members.has(student.id))
}

export async function getAllStudents() {
  await delay(150)
  return initialStudents
}

export async function createGroup(data) {
  await delay(300)
  const groups = readGroups()
  const group = {
    id: `group-${Date.now()}`,
    name: data.name.trim(),
    description: data.description.trim(),
    coverImage: data.coverImage,
    status: data.status,
    members: [],
    lessons: [],
  }
  writeGroups([group, ...groups])
  return withCounts(group)
}

export async function updateGroup(id, data) {
  await delay(300)
  const groups = readGroups()
  const index = groups.findIndex((group) => group.id === id)
  if (index === -1) throw new Error("Tahrirlanadigan guruh topilmadi.")
  const group = {
    ...groups[index],
    name: data.name.trim(),
    description: data.description.trim(),
    coverImage: data.coverImage,
    status: data.status,
  }
  groups[index] = group
  writeGroups(groups)
  return withCounts(group)
}

export async function deleteGroup(id) {
  await delay(250)
  const groups = readGroups()
  if (!groups.some((group) => group.id === id)) {
    throw new Error("O'chiriladigan guruh topilmadi.")
  }
  writeGroups(groups.filter((group) => group.id !== id))
}

export async function addStudentToGroup(studentId, groupId) {
  await delay(250)
  const groups = readGroups()
  const group = groups.find((item) => item.id === groupId)
  if (!group) throw new Error("Guruh topilmadi.")
  if (!initialStudents.some((student) => student.id === studentId)) {
    throw new Error("Talaba topilmadi.")
  }
  if (!group.members.includes(studentId)) {
    group.members = [...group.members, studentId]
    writeGroups(groups)
  }
  return getGroupMembers(groupId)
}

export async function removeStudentFromGroup(studentId, groupId) {
  await delay(250)
  const groups = readGroups()
  const group = groups.find((item) => item.id === groupId)
  if (!group) throw new Error("Guruh topilmadi.")
  group.members = group.members.filter((id) => id !== studentId)
  writeGroups(groups)
  return getGroupMembers(groupId)
}
