import { useState } from 'react'
import { useNavigate } from 'react-router'
import useReceipts from '../../hooks/payments/useReceipts'
import useSettlement from '../../hooks/payments/useSettlement'
import { showAlert } from '../../hooks/useAlert'
import { paymentsPath } from '../../constants/payments/receipt'
import { ASSISTANT_TEXT } from '../../constants/ai/assistant'
import { buildNotice, getRoundSummaries } from '../../utils/payments'
import * as S from '../../styles/ai/AssistantResult.styles'

type Props = {
  scheduleId: string
  scheduleTitle: string
}

// 정산 공지 작성 결과: 공지 탭과 같은 문구(buildNotice) 사용
export default function NoticeResultCard({ scheduleId, scheduleTitle }: Props) {
  const navigate = useNavigate()
  const { receipts } = useReceipts(scheduleId)
  const { settlement } = useSettlement(scheduleId)
  const [copied, setCopied] = useState(false)

  const summaries = getRoundSummaries(receipts, settlement)
  const ready = settlement.loaded && summaries.length > 0

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(buildNotice(scheduleTitle, summaries))
      setCopied(true)
    } catch {
      showAlert('공지 복사에 실패했어요.', { description: '잠시 후 다시 시도해주세요.' })
    }
  }

  return (
    <S.Card aria-label={`${scheduleTitle} 정산 공지`}>
      {ready ? (
        <>
          <S.Notice>{buildNotice(scheduleTitle, summaries)}</S.Notice>
          <S.ActionButton onClick={handleCopy}>{copied ? ASSISTANT_TEXT.copied : ASSISTANT_TEXT.copyNotice}</S.ActionButton>
        </>
      ) : (
        <>
          <S.Empty>{receipts.length === 0 ? '아직 등록된 영수증이 없어요.' : ASSISTANT_TEXT.notLoaded}</S.Empty>
          <S.ActionButton onClick={() => navigate(paymentsPath(scheduleId))}>{ASSISTANT_TEXT.goPayments}</S.ActionButton>
        </>
      )}
    </S.Card>
  )
}
