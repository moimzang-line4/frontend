import { useState } from 'react'
import type { CategoryOption } from '../../types/schedules/schedule'

const storageKey = 'moimzang.schedule.categories.v1'
export default function useCategories() {
  const [categories, setCategories] = useState<CategoryOption[]>(() => {
    try {
      const saved: unknown = JSON.parse(localStorage.getItem(storageKey) ?? 'null')
      if (Array.isArray(saved)) {
        const valid = saved.filter((item): item is CategoryOption => item && typeof item.id === 'string' && typeof item.label === 'string' && item.kind === 'custom')
        return valid
      }
    } catch { /* Start empty if storage is unavailable. */ }
    return []
  })
  function addCategory(label: string) {
    const existing = categories.find(item => item.label === label.trim())
    if (existing) return existing
    const option: CategoryOption = { id: crypto.randomUUID(), label: label.trim(), kind: 'custom' }
    const next = [...categories, option]
    localStorage.setItem(storageKey, JSON.stringify(next.filter(item => item.kind === 'custom')))
    setCategories(next)
    return option
  }
  return { categories, addCategory }
}
