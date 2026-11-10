import type { ReceiptForm } from '../types/payments/receipt'

// 영수증 이미지에서 가게명·거래일시·금액을 읽어오는 API
// TODO: 백엔드(OCR) 연결 전까지는 빈 값을 돌려줘서 사용자가 직접 입력하도록 함
export async function recognizeReceipt(image: string): Promise<Partial<ReceiptForm>> {
  void image
  return {}
}
