// ============================================================
// src/lib/utils.js
// DASTURCHI: BEHRUZ
// Bu fayl barcha dasturchilar ishlatiladigan yordamchi funksiyalar
// ============================================================

import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

// cn() — Tailwind klasslarini birlashtirish uchun
// Misol: cn("px-4 py-2", isActive && "bg-primary", className)
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

// formatDate() — ISO sana stringini "3 kun oldin" formatiga o'tkazadi
// Misol: formatDate("2025-01-12T10:00:00Z") → "3 kun oldin"
export function formatDate(isoString) {
  const date = new Date(isoString)
  const now = new Date()
  const diff = Math.floor((now - date) / 1000) // soniyalarda farq

  if (diff < 60)   return 'Hozirgina'
  if (diff < 3600) return `${Math.floor(diff / 60)} daqiqa oldin`
  if (diff < 86400) return `${Math.floor(diff / 3600)} soat oldin`
  if (diff < 604800) return `${Math.floor(diff / 86400)} kun oldin`
  if (diff < 2592000) return `${Math.floor(diff / 604800)} hafta oldin`
  if (diff < 31536000) return `${Math.floor(diff / 2592000)} oy oldin`
  return `${Math.floor(diff / 31536000)} yil oldin`
}

// formatDuration() — soniyalarni "MM:SS" formatiga o'tkazadi
// Misol: formatDuration(125) → "2:05"
// Misol: formatDuration(3725) → "1:02:05"
export function formatDuration(seconds) {
  if (!seconds) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  }
  return `${m}:${String(s).padStart(2, '0')}`
}

// formatCount() — sonni qisqa formatga o'tkazadi
// Misol: formatCount(1500000) → "1.5M"
// Misol: formatCount(25300)   → "25.3K"
// Misol: formatCount(500)     → "500"
export function formatCount(number) {
  if (!number) return '0'
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`
  if (number >= 1_000)     return `${(number / 1_000).toFixed(1)}K`
  return String(number)
}

// delay() — async funksiyalarda kutish uchun (mock API uchun ishlatiladi)
// Misol: await delay(500)  →  500ms kutadi
export function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

// truncate() — uzun matnni qisqartiradi
// Misol: truncate("Uzun matn...", 50) → "Uzun matn......"
export function truncate(text, maxLength) {
  if (!text || text.length <= maxLength) return text
  return text.slice(0, maxLength) + '...'
}

// getInitials() — ismdan abbreviatura oladi (avatar uchun)
// Misol: getInitials("Behruz Toshmatov") → "BT"
export function getInitials(name) {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}
