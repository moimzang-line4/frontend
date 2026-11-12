import { PAYMENT_ACCOUNT, PER_PERSON_UNIT } from '../constants/payments/settlement'
import { ROUND_OPTIONS } from '../constants/payments/receipt'
import type { Receipt } from '../types/payments/receipt'
import type { RoundSummary, Settlement, SettlementPerson } from '../types/payments/settlement'

// '89,000' → 89000
export const parseAmount = (value: string) => Number(value.replace(/\D/g, '')) || 0

export const won = (value: number) => `${value.toLocaleString('ko-KR')}원`

const roundOrder = (round: string) => {
  const index = (ROUND_OPTIONS as readonly string[]).indexOf(round)
  return index === -1 ? Number.MAX_SAFE_INTEGER : index
}

// 영수증이 등록된 차수 (1차, 2차 … 순서)
export const getReceiptRounds = (receipts: Receipt[]) =>
  [...new Set(receipts.map(receipt => receipt.round).filter(Boolean))].sort((a, b) => roundOrder(a) - roundOrder(b))

// 차수별 정산 금액·인원·1인 금액
export function getRoundSummaries(receipts: Receipt[], settlement: Settlement): RoundSummary[] {
  return getReceiptRounds(receipts).map(round => {
    const roundReceipts = receipts.filter(receipt => receipt.round === round)
    const cost = roundReceipts.reduce(
      (sum, receipt) => sum + Math.max(0, parseAmount(receipt.amount) - parseAmount(receipt.support)),
      0,
    )
    const memberCount = settlement.rounds[round]?.length ?? 0
    const perPerson = memberCount ? Math.ceil(cost / memberCount / PER_PERSON_UNIT) * PER_PERSON_UNIT : 0
    return { round, storeNames: roundReceipts.map(receipt => receipt.storeName).filter(Boolean), cost, memberCount, perPerson }
  })
}

// 한 사람이 내야 할 총액 (참여한 차수의 1인 금액 합)
export const getPersonTotal = (personId: string, summaries: RoundSummary[], settlement: Settlement) =>
  summaries.reduce((sum, summary) => (settlement.rounds[summary.round]?.includes(personId) ? sum + summary.perPerson : sum), 0)

// 정산에 참여하는 전체 인원 (차수 중 하나라도 포함)
export const getSettlementMemberIds = (settlement: Settlement) =>
  [...new Set(Object.values(settlement.rounds).flat())]

// 학과 · 전화번호 뒤 4자리 (피그마 메모: 명단에 정보가 없으면 공란)
export const personIdentity = (person: SettlementPerson) =>
  [person.department, person.phone.replace(/\D/g, '').slice(-4)].filter(Boolean).join(' ')

// 피그마: 정산 공지 · 생성 결과 미리보기
export function buildNotice(title: string, summaries: RoundSummary[]) {
  const lines = summaries.map(summary => `• ${summary.round}: ${won(summary.perPerson)}`)
  if (summaries.length > 1) {
    const total = summaries.reduce((sum, summary) => sum + summary.perPerson, 0)
    lines.push(`• ${summaries.map(summary => summary.round).join('+')}: ${won(total)}`)
  }
  return [
    `✏️ ${title} 정산 안내`,
    '',
    ...lines,
    '',
    '아래 계좌로 입금 부탁드립니다!',
    `계좌: ${PAYMENT_ACCOUNT.bank} ${PAYMENT_ACCOUNT.number}`,
    `예금주: ${PAYMENT_ACCOUNT.holder}`,
  ].join('\n')
}
