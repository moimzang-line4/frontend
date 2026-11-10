export type ReceiptFieldKey = 'storeName' | 'paidAt' | 'amount' | 'support' | 'round'

export type ReceiptForm = Record<ReceiptFieldKey, string>

export type Receipt = ReceiptForm & {
  id: string
  // 촬영한 영수증 사진 (직접 등록이면 없음)
  image?: string
  createdAt: number
}

export type ReceiptField = {
  key: ReceiptFieldKey
  label: string
  placeholder: string
  required?: boolean
  inputMode?: 'text' | 'numeric'
  // 직접 등록 화면에는 없는 항목
  scanOnly?: boolean
}

export type PaymentsTab = 'receipts' | 'members' | 'notice'
