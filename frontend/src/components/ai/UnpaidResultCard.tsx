import { useState } from 'react'
import { useNavigate } from 'react-router'
import useReceipts from '../../hooks/payments/useReceipts'
import useSettlement from '../../hooks/payments/useSettlement'
import { paymentsPath } from '../../constants/payments/receipt'
import { ASSISTANT_TEXT } from '../../constants/ai/assistant'
import { getPersonTotal, getRoundSummaries, getSettlementMemberIds, personIdentity, won } from '../../utils/payments'
import type { SettlementPerson } from '../../types/payments/settlement'
import * as S from '../../styles/ai/AssistantResult.styles'

type Props = {
  scheduleId: string
  scheduleTitle: string
}

// 피그마: AI 운영 비서 · 미입금자 조회 결과 (결과 카드)
export default function UnpaidResultCard({ scheduleId, scheduleTitle }: Props) {
  const navigate = useNavigate()
  const { receipts } = useReceipts(scheduleId)
  const { settlement, getPerson, setPaid } = useSettlement(scheduleId)
  const summaries = getRoundSummaries(receipts, settlement)

  // 답변한 시점의 미입금자 (입금 확인을 눌러도 카드에서 바로 사라지지 않게)
  const [targetIds] = useState(() =>
    getSettlementMemberIds(settlement).filter(id => !settlement.paid.includes(id)))
  const people = targetIds
    .map(getPerson)
    .filter((person): person is SettlementPerson => Boolean(person))

  const isPaid = (id: string) => settlement.paid.includes(id)
  const unpaid = people.filter(person => !isPaid(person.id))
  const unpaidTotal = unpaid.reduce((sum, person) => sum + getPersonTotal(person.id, summaries, settlement), 0)

  const goPayments = () => navigate(`${paymentsPath(scheduleId)}${settlement.loaded ? '/members' : ''}`)

  return (
    <S.Card aria-label={`${scheduleTitle} 미입금 결과`}>
      <S.Summary>
        <S.SummaryText>
          <S.Label>{scheduleTitle}·{ASSISTANT_TEXT.unpaidTitle}</S.Label>
          <S.SubLabel>{ASSISTANT_TEXT.unpaidTotal}</S.SubLabel>
          <S.Amount>{won(unpaidTotal)}</S.Amount>
        </S.SummaryText>
        <S.CountBadge>{unpaid.length}명</S.CountBadge>
      </S.Summary>

      {!settlement.loaded ? (
        <S.Empty>{ASSISTANT_TEXT.notLoaded}</S.Empty>
      ) : people.length === 0 ? (
        <S.Empty>{ASSISTANT_TEXT.allPaid}</S.Empty>
      ) : (
        <S.List>
          {people.map(person => {
            const identity = personIdentity(person)
            return (
              <S.Row key={person.id}>
                <S.Info>
                  <strong>{person.name}</strong>
                  {identity && <S.Meta>{identity}</S.Meta>}
                  <S.Total>총 {won(getPersonTotal(person.id, summaries, settlement))}</S.Total>
                </S.Info>
                {isPaid(person.id) ? (
                  <S.DoneBadge>✓ 입금 완료</S.DoneBadge>
                ) : (
                  <S.ConfirmButton type="button" onClick={() => setPaid(person.id, true)} aria-label={`${person.name} 입금 확인`}>
                    ✓ 입금 확인
                  </S.ConfirmButton>
                )}
              </S.Row>
            )
          })}
        </S.List>
      )}

      <S.ActionButton onClick={goPayments}>{ASSISTANT_TEXT.goPayments}</S.ActionButton>
    </S.Card>
  )
}
