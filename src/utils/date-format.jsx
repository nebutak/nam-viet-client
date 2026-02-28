const padZero = (num) => num.toString().padStart(2, '0')

const formatDate = (date, hasTime) => {
  const day = padZero(date.getDate())
  const month = padZero(date.getMonth() + 1)
  const year = date.getFullYear()

  const datePart = `${day}/${month}/${year}`

  if (!hasTime) return datePart

  const timePart = `${padZero(date.getHours())}:${padZero(date.getMinutes())}:${padZero(date.getSeconds())}`

  return `${datePart} ${timePart}`
}

export const dateFormat = (date, hasTime = false) =>
  formatDate(new Date(date), hasTime)

export const diffForHumans = (timestamp, unix = true) => {
  const now = new Date()
  const past = unix ? new Date(timestamp * 1000) : new Date(timestamp)
  const diffInSeconds = Math.floor((now - past) / 1000)

  const intervals = [
    { label: 'năm', seconds: 31536000 },
    { label: 'tháng', seconds: 2592000 },
    { label: 'tuần', seconds: 604800 },
    { label: 'ngày', seconds: 86400 },
    { label: 'giờ', seconds: 3600 },
    { label: 'phút', seconds: 60 },
    { label: 'giây', seconds: 1 },
  ]

  const pad = (n) => (n < 10 ? '0' + n : n)

  if (diffInSeconds >= intervals[3].seconds * 3) {
    const hours = pad(past.getHours())
    const minutes = pad(past.getMinutes())
    const day = pad(past.getDate())
    const month = pad(past.getMonth() + 1)
    const year = past.getFullYear()
    return `${hours}:${minutes} ${day}-${month}-${year}`
  }

  for (const interval of intervals) {
    const time = Math.floor(diffInSeconds / interval.seconds)
    if (time >= 1) {
      return `${time} ${interval.label}${time > 1 ? '' : ''} trước`
    }
  }

  return 'vừa xong'
}

export const formatDateToYYYYMMDD = (date) => {
  const newDate = new Date(date)
  const year = newDate.getFullYear()
  const month = String(newDate.getMonth() + 1).padStart(2, '0')
  const day = String(newDate.getDate()).padStart(2, '0')

  return `${year}/${month}/${day}`
}

// Helper function
// Thêm 1 ngày vào ISO date (chuẩn hóa về đầu ngày)
export const addDays = (dateStr, days = 1) => {
  const date = new Date(dateStr)
  date.setDate(date.getDate() + days)
  date.setHours(0, 0, 0, 0)
  return date
}

export const getStartOfCurrentMonth = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth(), 1, 0, 0, 0, 0)
}

export const getEndOfCurrentMonth = () => {
  const now = new Date()
  return new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999)
}

export const getStartOfMonth = (date = new Date()) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth(), 1, 0, 0, 0, 0)
}

export const getEndOfMonth = (date = new Date()) => {
  const d = new Date(date)
  return new Date(d.getFullYear(), d.getMonth() + 1, 0, 23, 59, 59, 999)
}
