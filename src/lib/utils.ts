import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Utility functions for the BharatAid Copilot app
export function generateId(): string {
  return crypto.randomUUID()
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim()
}

export function formatCurrency(amount: number, locale: string = 'en-IN'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: string | Date, locale: string = 'en-IN'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat(locale, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(dateObj)
}

export function formatRelativeTime(date: string | Date, locale: string = 'en-IN'): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date
  const now = new Date()
  const diffInMs = now.getTime() - dateObj.getTime()
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60))
  const diffInHours = Math.floor(diffInMinutes / 60)
  const diffInDays = Math.floor(diffInHours / 24)

  if (diffInMinutes < 1) return 'Just now'
  if (diffInMinutes < 60) return `${diffInMinutes}m ago`
  if (diffInHours < 24) return `${diffInHours}h ago`
  if (diffInDays < 7) return `${diffInDays}d ago`
  
  return formatDate(dateObj, locale)
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - 3) + '...'
}

export function highlightText(text: string, searchQuery: string): string {
  if (!searchQuery.trim()) return text
  
  const regex = new RegExp(`(${searchQuery.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  return text.replace(regex, '<mark class="bg-yellow-200 px-0.5 rounded">$1</mark>')
}

export function extractKeywords(text: string, maxKeywords: number = 5): string[] {
  // Simple keyword extraction - split by words, filter common words, take most frequent
  const commonWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for', 'of', 'with', 'by', 
    'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had', 'do', 'does', 'did',
    'will', 'would', 'could', 'should', 'may', 'might', 'can', 'must', 'this', 'that', 'these', 'those'
  ])
  
  const words = text
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 3 && !commonWords.has(word))
  
  const frequency = words.reduce((acc, word) => {
    acc[word] = (acc[word] || 0) + 1
    return acc
  }, {} as Record<string, number>)
  
  return Object.entries(frequency)
    .sort(([,a], [,b]) => b - a)
    .slice(0, maxKeywords)
    .map(([word]) => word)
}

export function calculateMatchScore(query: string, text: string): number {
  const queryKeywords = extractKeywords(query, 10)
  const textKeywords = extractKeywords(text, 20)
  
  if (queryKeywords.length === 0 || textKeywords.length === 0) return 0
  
  const matches = queryKeywords.filter(keyword => textKeywords.includes(keyword))
  return matches.length / queryKeywords.length
}

export function normalizeLanguageCode(code: string): string {
  // Normalize language codes to ISO 639-1 format
  const langMap: Record<string, string> = {
    'hindi': 'hi',
    'bengali': 'bn', 
    'tamil': 'ta',
    'telugu': 'te',
    'marathi': 'mr',
    'gujarati': 'gu',
    'kannada': 'kn',
    'malayalam': 'ml',
    'punjabi': 'pa',
  }
  
  const normalized = code.toLowerCase().trim()
  return langMap[normalized] || normalized
}

export function getLanguageLabel(code: string, languages: Array<{code: string, label: string, nativeName: string}>): string {
  const lang = languages.find(l => l.code === code)
  return lang ? lang.label : code.toUpperCase()
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => func(...args), delay)
  }
}

export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let lastCallTime = 0
  
  return (...args: Parameters<T>) => {
    const now = Date.now()
    if (now - lastCallTime >= limit) {
      lastCallTime = now
      func(...args)
    }
  }
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function isValidPhoneNumber(phone: string): boolean {
  // Indian phone number validation
  const phoneRegex = /^(\+91|91)?[6-9]\d{9}$/
  return phoneRegex.test(phone.replace(/\s|-/g, ''))
}

export function sanitizeInput(input: string): string {
  return input
    .trim()
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/[<>]/g, '') // Remove angle brackets
    .slice(0, 10000) // Limit length
}

export function getConfidenceColor(confidence: number): string {
  if (confidence >= 0.8) return 'text-green-600 bg-green-50'
  if (confidence >= 0.6) return 'text-yellow-600 bg-yellow-50' 
  return 'text-red-600 bg-red-50'
}

export function getConfidenceLabel(confidence: number): string {
  if (confidence >= 0.8) return 'High'
  if (confidence >= 0.6) return 'Medium'
  return 'Low'
}

export function generatePagination(currentPage: number, totalPages: number, maxVisible: number = 5): (number | '...')[] {
  const pages: (number | '...')[] = []
  
  if (totalPages <= maxVisible) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i)
    }
    return pages
  }
  
  pages.push(1)
  
  if (currentPage > 3) {
    pages.push('...')
  }
  
  for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
    pages.push(i)
  }
  
  if (currentPage < totalPages - 2) {
    pages.push('...')
  }
  
  if (totalPages > 1) {
    pages.push(totalPages)
  }
  
  return pages
}

export function downloadAsCSV(data: Record<string, any>[], filename: string): void {
  if (!data.length) return
  
  const headers = Object.keys(data[0])
  const csvContent = [
    headers.join(','),
    ...data.map(row => headers.map(header => {
      const value = row[header] ?? ''
      // Escape commas and quotes in CSV
      if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
        return `"${value.replace(/"/g, '""')}"`
      }
      return value
    }).join(','))
  ].join('\n')
  
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', `${filename}.csv`)
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export function pickRandom<T>(array: T[]): T | undefined {
  return array.length > 0 ? array[Math.floor(Math.random() * array.length)] : undefined
}

export function groupBy<T, K extends string | number>(
  array: T[], 
  keyFn: (item: T) => K
): Record<K, T[]> {
  return array.reduce((groups, item) => {
    const key = keyFn(item)
    if (!groups[key]) {
      groups[key] = []
    }
    groups[key].push(item)
    return groups
  }, {} as Record<K, T[]>)
}