import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...inputs) => twMerge(clsx(inputs))

export function formatDate(value) {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
  if (seconds < 0) return date.toLocaleDateString('uz-UZ')
  if (seconds < 60) return 'Hozirgina'
  if (seconds < 3600) return `${Math.floor(seconds / 60)} daqiqa oldin`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} soat oldin`
  if (seconds < 604800) return `${Math.floor(seconds / 86400)} kun oldin`
  if (seconds < 2592000) return `${Math.floor(seconds / 604800)} hafta oldin`
  if (seconds < 31536000) return `${Math.floor(seconds / 2592000)} oy oldin`
  return `${Math.floor(seconds / 31536000)} yil oldin`
}

export function formatDuration(value = 0) {
  const total = Math.max(0, Math.floor(Number(value) || 0))
  const hours = Math.floor(total / 3600)
  const minutes = Math.floor((total % 3600) / 60)
  const seconds = total % 60
  return hours
    ? `${hours}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
    : `${minutes}:${String(seconds).padStart(2, '0')}`
}

export function formatFileSize(bytes = 0) {
  const size = Math.max(0, Number(bytes) || 0)
  if (size < 1024) return `${size} B`
  const units = ['KB', 'MB', 'GB', 'TB']
  let value = size / 1024
  let unit = 0
  while (value >= 1024 && unit < units.length - 1) { value /= 1024; unit += 1 }
  return `${value.toFixed(1)} ${units[unit]}`
}

export function formatCount(value = 0) {
  const number = Number(value) || 0
  if (number >= 1_000_000) return `${(number / 1_000_000).toFixed(1)}M`
  if (number >= 1_000) return `${(number / 1_000).toFixed(1)}K`
  return String(number)
}

export const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))
export function truncate(value = '', maxLength = 100) {
  return value.length <= maxLength ? value : `${value.slice(0, maxLength)}...`
}
export function getInitials(name = '') {
  return name.trim().split(/\s+/).filter(Boolean).slice(0, 2).map((part) => part[0].toUpperCase()).join('') || '?'
}
