import type { PaymentFilter } from '../../types/payments/settlement'

export const PAYMENT_FILTERS: readonly { id: PaymentFilter; label: string }[] = [
  { id: 'unpaid', label: '미입금' },
  { id: 'paid', label: '입금 완료' },
  { id: 'all', label: '전체' },
]

// 1인 금액은 100원 단위로 올림
export const PER_PERSON_UNIT = 100

// TODO: 모임 설정에 계좌 정보가 생기면 그 값으로 교체
export const PAYMENT_ACCOUNT = {
  bank: '카카오뱅크',
  number: '3333-12-4378239',
  holder: '김동김',
} as const

export const SETTLEMENT_TEXT = {
  rosterEmptyTitle: '정산 명단을 불러오세요',
  rosterEmptyDescription: '행사에 등록된 참여 명단을 불러와 차수별로 정산 인원을 설정할 수 있어요',
  rosterNeedsReceipt: '먼저 영수증을 등록해주세요',
  rosterNeedsReceiptDescription: '영수증을 직접 입력하거나 사진으로 등록하면 행사 명단을 불러올 수 있어요.',
  noticeEmptyTitle: '등록된 정산 내역이 없어요',
  noticeEmptyDescription: '먼저 영수증을 등록해야 공지문을 생성할 수 있어요.',
  noticeRoundTitle: '포함할 차수',
  noticeRoundDescription: '공지에 포함할 차수를 선택해주세요',
  noticePreviewTitle: '공지 미리보기',
  noticeAccountTitle: '입금 계좌',
  noticeAccountDescription: '선택한 차수에 저장되고 공지에 함께 들어가요',
  removeTitle: '정산 명단에서 뺄까요?',
} as const
