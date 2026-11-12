export type SettlementPerson = {
  id: string
  name: string
  department: string
  phone: string
}

export type Settlement = {
  // '행사 명단 불러오기'를 했는지
  loaded: boolean
  people: SettlementPerson[]
  // 차수별 참여자 id (예: { '1차': ['member-1', ...] })
  rounds: Record<string, string[]>
  // 입금 완료한 사람 id
  paid: string[]
}

export type PaymentFilter = 'unpaid' | 'paid' | 'all'

export type RoundSummary = {
  round: string
  storeNames: string[]
  // 회비 지원금을 뺀 실제 정산 금액
  cost: number
  memberCount: number
  perPerson: number
}
