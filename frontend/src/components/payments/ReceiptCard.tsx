import { RECEIPT_STATUS, formatAmount, formatReceiptDate } from '../../constants/payments/receipt'
import type { Receipt, ReceiptStatus } from '../../types/payments/receipt'
import * as S from '../../styles/payments/ReceiptCard.styles'

type Props = {
  receipt: Receipt
  // 정산 명단 기준 상태 (없으면 영수증에 저장된 값)
  status?: ReceiptStatus
  // 금액 대신 보여줄 내용 (명단·금액 탭: 'N명')
  detail?: string
  showDate?: boolean
  onClick: () => void
}

// 피그마: 정산 · 영수증 목록의 영수증 카드
export default function ReceiptCard({ receipt, status: statusOverride, detail, showDate = true, onClick }: Props) {
  const status = RECEIPT_STATUS[statusOverride ?? receipt.status ?? 'ongoing']
  const storeName = receipt.storeName.trim() || '가게명 미입력'

  return (
    <S.Card type="button" onClick={onClick} aria-label={`${storeName} ${receipt.round} 영수증 보기`}>
      <S.Info>
        <S.Badge $color={status.color} $background={status.background}>{status.label}</S.Badge>
        <S.Texts>
          <S.Title>
            <strong>{storeName}</strong>
            {receipt.round && ` · ${receipt.round}`}
          </S.Title>
          <S.Amount>{detail ?? formatAmount(receipt.amount)}</S.Amount>
          {showDate && <S.RegisteredAt>등록된 시간 {formatReceiptDate(receipt.createdAt)}</S.RegisteredAt>}
        </S.Texts>
      </S.Info>

      <S.Chevron width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
        <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </S.Chevron>
    </S.Card>
  )
}
