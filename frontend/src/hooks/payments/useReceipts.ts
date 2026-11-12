import { useState } from 'react'
import type { Receipt, ReceiptForm } from '../../types/payments/receipt'

const storageKey = (scheduleId: string) => `moimzang.payments.receipts.${scheduleId}`

function load(scheduleId: string): Receipt[] {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(storageKey(scheduleId)) ?? '[]')
    return Array.isArray(saved) ? (saved as Receipt[]) : []
  } catch {
    return []
  }
}

// 일정별 영수증 목록 (API 연결 전까지 localStorage 사용)
export default function useReceipts(scheduleId: string) {
  const [receipts, setReceipts] = useState<Receipt[]>(() => load(scheduleId))

  const update = (updater: (prev: Receipt[]) => Receipt[]) => {
    setReceipts(prev => {
      const next = updater(prev)
      try {
        localStorage.setItem(storageKey(scheduleId), JSON.stringify(next))
      } catch { /* 저장 공간이 부족해도 화면 상태는 유지 */ }
      return next
    })
  }

  const getReceipt = (id: string) => receipts.find(item => item.id === id)

  const addReceipt = (form: ReceiptForm, image?: string) => {
    const receipt: Receipt = { ...form, id: `receipt-${Date.now()}`, status: 'ongoing', image, createdAt: Date.now() }
    update(prev => [receipt, ...prev])
    return receipt
  }

  const updateReceipt = (id: string, form: ReceiptForm, image?: string) => {
    update(prev => prev.map(item => (item.id === id ? { ...item, ...form, image: image ?? item.image } : item)))
  }

  const removeReceipt = (id: string) => {
    update(prev => prev.filter(item => item.id !== id))
  }

  return { receipts, getReceipt, addReceipt, updateReceipt, removeReceipt }
}
