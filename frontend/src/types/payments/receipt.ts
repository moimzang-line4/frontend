export type ReceiptFieldKey = 'storeName' | 'paidAt' | 'amount' | 'support' | 'round'

export type ReceiptForm = Record<ReceiptFieldKey, string>

// 정산중 / 정산 완료 (입금 확인 기능이 생기면 갱신)
export type ReceiptStatus = 'ongoing' | 'done'

export type Receipt = ReceiptForm & {
  // 서버는 차수 하나에 영수증 하나 → id는 차수 ID
  id: string
  roundId?: number
  // 입금 완료한 사람이 있으면 수정·삭제 불가
  locked?: boolean
  status?: ReceiptStatus
  // 영수증 사진 주소 (직접 등록이면 없음)
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
