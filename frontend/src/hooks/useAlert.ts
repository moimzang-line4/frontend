import { useSyncExternalStore } from 'react'

export type AlertState = {
  title: string
  description?: string
  confirmText: string
  onConfirm?: () => void
} | null

let current: AlertState = null
const listeners = new Set<() => void>()

const emit = () => listeners.forEach(listener => listener())

// 브라우저 alert() 대신 사용: 앱 디자인의 안내 모달을 띄움 (<AlertModal />이 App에 한 번 렌더링되어 있어야 함)
export function showAlert(
  title: string,
  options: { description?: string; confirmText?: string; onConfirm?: () => void } = {},
) {
  current = { title, confirmText: options.confirmText ?? '확인', ...options }
  emit()
}

export function closeAlert() {
  const onConfirm = current?.onConfirm
  current = null
  emit()
  onConfirm?.()
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => { listeners.delete(listener) }
}

export default function useAlert() {
  return useSyncExternalStore(subscribe, () => current)
}
