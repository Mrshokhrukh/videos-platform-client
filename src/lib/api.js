import { adminUser, comments, groups, lessons, students, users } from './mockData'
import { delay } from './utils'

export const AUTH_TOKEN_KEY = 'edu-platform-token'
export const AUTH_ROLE_KEY = 'edu-platform-role'
const wait = () => delay(250)
const clone = (value) => structuredClone(value)
const currentId = () => localStorage.getItem(AUTH_TOKEN_KEY)

export async function login(email, password) {
  await wait()
  const user = users.find((item) => item.email.toLowerCase() === email.trim().toLowerCase() && item.password === password)
  if (!user || (user.role === 'student' && !user.isActive)) throw new Error('Email yoki parol noto‘g‘ri')
  return { user: clone(user), role: user.role, token: user.id }
}

export async function getCurrentUser() {
  await wait()
  const user = users.find((item) => item.id === currentId())
  return user ? clone(user) : null
}

export async function getAdminStats() {
  await wait()
  return { totalStudents: students.length, totalGroups: groups.length, totalLessons: lessons.length, activeStudents: students.filter((item) => item.isActive).length }
}
export async function getAllGroups() { await wait(); return clone(groups) }
export async function getAllStudents() { await wait(); return clone(students) }
export async function getStudentById(id) { await wait(); return clone(students.find((item) => item.id === id) ?? null) }

export async function createGroup(data) {
  await wait()
  const group = { id: `group-${crypto.randomUUID()}`, studentIds: [], lessonCount: 0, isActive: true, createdAt: new Date().toISOString(), adminId: adminUser.id, ...data }
  groups.push(group)
  return clone(group)
}
export async function updateGroup(id, data) {
  await wait(); const group = groups.find((item) => item.id === id)
  if (!group) throw new Error('Guruh topilmadi')
  Object.assign(group, data); return clone(group)
}
export async function deleteGroup(id) {
  await wait(); const index = groups.findIndex((item) => item.id === id)
  if (index < 0) return false
  groups.splice(index, 1); lessons.splice(0, lessons.length, ...lessons.filter((item) => item.groupId !== id))
  students.forEach((student) => { student.groupIds = student.groupIds.filter((groupId) => groupId !== id) })
  return true
}
export async function addStudentToGroup(studentId, groupId) {
  await wait(); const student = students.find((item) => item.id === studentId); const group = groups.find((item) => item.id === groupId)
  if (!student || !group) throw new Error('Talaba yoki guruh topilmadi')
  if (!student.groupIds.includes(groupId)) student.groupIds.push(groupId)
  if (!group.studentIds.includes(studentId)) group.studentIds.push(studentId)
  return clone({ student, group })
}
export async function removeStudentFromGroup(studentId, groupId) {
  await wait(); const student = students.find((item) => item.id === studentId); const group = groups.find((item) => item.id === groupId)
  if (student) student.groupIds = student.groupIds.filter((id) => id !== groupId)
  if (group) group.studentIds = group.studentIds.filter((id) => id !== studentId)
  return Boolean(student && group)
}
export async function toggleStudentActive(studentId) {
  await wait(); const student = students.find((item) => item.id === studentId)
  if (!student) throw new Error('Talaba topilmadi')
  student.isActive = !student.isActive; return clone(student)
}
export async function getGroupLessons(groupId) {
  await wait()
  const isStudent = localStorage.getItem(AUTH_ROLE_KEY) === 'student'
  if (isStudent) {
    const user = students.find((item) => item.id === currentId())
    if (!user?.groupIds.includes(groupId)) return []
  }
  return clone(lessons.filter((item) => item.groupId === groupId && (!isStudent || item.isPublished)))
}
export async function deleteLesson(id) {
  await wait(); const index = lessons.findIndex((item) => item.id === id)
  if (index < 0) return false
  const groupId = lessons[index].groupId
  lessons.splice(index, 1); comments.splice(0, comments.length, ...comments.filter((item) => item.lessonId !== id))
  const group = groups.find((item) => item.id === groupId)
  if (group) group.lessonCount = lessons.filter((item) => item.groupId === group.id).length
  return true
}
export async function updateLesson(id, data) {
  await wait(); const lesson = lessons.find((item) => item.id === id)
  if (!lesson) throw new Error('Dars topilmadi')
  Object.assign(lesson, data); return clone(lesson)
}
export async function getMyGroups() {
  await wait(); const user = students.find((item) => item.id === currentId())
  return clone(groups.filter((group) => user?.groupIds.includes(group.id)))
}
export async function getLessonById(id) {
  await wait(); const lesson = lessons.find((item) => item.id === id)
  if (!lesson) return null
  const isStudent = localStorage.getItem(AUTH_ROLE_KEY) === 'student'
  if (isStudent && !lesson.isPublished) return null
  if (isStudent) {
    const user = students.find((item) => item.id === currentId())
    if (!user?.groupIds.includes(lesson.groupId)) return null
  }
  return clone(lesson)
}
export async function getComments(lessonId) {
  await wait(); return clone(comments.filter((item) => item.lessonId === lessonId).map((comment) => ({ ...comment, author: users.find((user) => user.id === comment.authorId) })))
}
export async function addComment(lessonId, text) {
  await wait(); const user = users.find((item) => item.id === currentId())
  if (!user || user.role !== 'student') throw new Error('Izoh qoldirish uchun talaba sifatida kiring')
  if (!lessons.some((item) => item.id === lessonId && item.isPublished)) throw new Error('Dars topilmadi')
  const comment = { id: `comment-${crypto.randomUUID()}`, text: text.trim(), lessonId, authorId: user.id, createdAt: new Date().toISOString() }
  comments.push(comment); return clone(comment)
}
