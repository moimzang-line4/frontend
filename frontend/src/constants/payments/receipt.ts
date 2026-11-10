import type { PaymentsTab, ReceiptField, ReceiptForm } from '../../types/payments/receipt'

export const paymentsPath = (scheduleId: string) =>
  `/schedules/${encodeURIComponent(scheduleId)}/operations/payments`

export const PAYMENTS_TABS: readonly { id: PaymentsTab; label: string; path: string }[] = [
  { id: 'receipts', label: '영수증', path: '' },
  { id: 'members', label: '명단·금액', path: '/members' },
  { id: 'notice', label: '공지 복사', path: '/notice' },
]

// 피그마: 영수증 인식 결과 / 직접 등록 입력 항목
export const RECEIPT_FIELDS: readonly ReceiptField[] = [
  { key: 'storeName', label: '가게명', placeholder: '입력해 주세요' },
  { key: 'paidAt', label: '거래일시', placeholder: '0000-00-00 00:00' },
  { key: 'amount', label: '금액(합계)', placeholder: '입력해 주세요', required: true, inputMode: 'numeric' },
  { key: 'support', label: '회비 지원금', placeholder: '입력해 주세요', inputMode: 'numeric', scanOnly: true },
  { key: 'round', label: '차수 선택', placeholder: '선택해 주세요', required: true },
]

export const ROUND_OPTIONS = ['1차', '2차', '3차', '4차'] as const

export const EMPTY_RECEIPT_FORM: ReceiptForm = {
  storeName: '',
  paidAt: '',
  amount: '',
  support: '',
  round: '',
}

export const RECEIPT_TEXT = {
  emptyTitle: '아직 등록된 영수증이 없어요',
  emptyDescription: '영수증을 등록하면 AI가 금액과 가게명을 읽고 정산을 준비해요',
  cameraHint: '영수증을 화면 안에 맞춰 촬영해주세요',
  resultTitle: '영수증을 인식했어요!',
  resultDescription: '아래 내용을 확인하고 등록해주세요',
} as const

// 촬영 이미지 저장 시 최대 너비 (용량 줄이기)
export const RECEIPT_IMAGE_MAX_WIDTH = 1080
