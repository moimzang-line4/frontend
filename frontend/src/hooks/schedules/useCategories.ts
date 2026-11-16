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
  // 이름만 수정 (삭제는 지원하지 않음). 같은 이름이 이미 있으면 에러
  function renameCategory(id: string, label: string) {
    const name = label.trim()
    const target = categories.find(item => item.id === id)
    if (!target) throw new Error('카테고리를 찾을 수 없어요.')
    if (categories.some(item => item.id !== id && item.label === name)) throw new Error('이미 있는 카테고리 이름이에요.')
    const option: CategoryOption = { ...target, label: name }
    const next = categories.map(item => (item.id === id ? option : item))
    localStorage.setItem(storageKey, JSON.stringify(next.filter(item => item.kind === 'custom')))
    setCategories(next)
    return option
  }
  return { categories, addCategory, renameCategory }
}
