export function formatDateTime(dateString, locale = 'fr-FR', options = {}) {
  if (!dateString) return ''
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString
  return date.toLocaleString(locale, {
    weekday: 'short',
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
    ...options
  })
}

export function isToday(dateString) {
  if (!dateString) return false
  const date = new Date(dateString)
  const today = new Date()
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
}

