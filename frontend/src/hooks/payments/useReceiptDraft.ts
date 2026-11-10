// 촬영 → 인식 결과 화면으로 넘길 영수증 사진 (새로고침해도 유지되도록 sessionStorage)
const draftKey = (scheduleId: string) => `moimzang.payments.receipt-draft.${scheduleId}`

export function saveReceiptDraft(scheduleId: string, image: string) {
  try {
    sessionStorage.setItem(draftKey(scheduleId), image)
  } catch { /* 저장 실패 시 결과 화면에서 다시 촬영하도록 안내 */ }
}

export function loadReceiptDraft(scheduleId: string) {
  try {
    return sessionStorage.getItem(draftKey(scheduleId)) ?? undefined
  } catch {
    return undefined
  }
}

export function clearReceiptDraft(scheduleId: string) {
  try {
    sessionStorage.removeItem(draftKey(scheduleId))
  } catch { /* 무시 */ }
}
