import { useEffect, useState } from 'react'

function localDate(date: Date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

export default function useTodayDate() {
  const [today, setToday] = useState(() => localDate(new Date()))
  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>
    function scheduleMidnight() {
      const now = new Date()
      const midnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)
      timer = setTimeout(refresh, midnight.getTime() - now.getTime() + 20)
    }
    function refresh() {
      clearTimeout(timer)
      setToday(localDate(new Date()))
      scheduleMidnight()
    }
    scheduleMidnight()
    window.addEventListener('focus', refresh)
    document.addEventListener('visibilitychange', refresh)
    return () => {
      clearTimeout(timer)
      window.removeEventListener('focus', refresh)
      document.removeEventListener('visibilitychange', refresh)
    }
  }, [])
  return today
}
