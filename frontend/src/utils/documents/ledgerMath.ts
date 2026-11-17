import type { Ledger, LedgerInput } from '../../types/documents/ledger'

export const won = (amount: number) => `${amount.toLocaleString('ko-KR')}원`

export function ledgerTotals(ledger: Ledger) {
  const income = ledger.entries
    .filter((entry) => entry.type === 'income')
    .reduce((sum, entry) => sum + entry.amount, 0)
  const expense = ledger.entries
    .filter((entry) => entry.type === 'expense')
    .reduce((sum, entry) => sum + entry.amount, 0)
  const balance = ledger.initialBalance + income - expense

  if (![income, expense, balance].every(Number.isSafeInteger))
    throw new Error('장부 금액의 합계가 너무 커요.')

  return { income, expense, balance }
}

export function validDate(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00Z`)
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  )
}

export function validateLedgerInput(input: LedgerInput) {
  if (
    !input.title.trim() ||
    input.title.trim().length > 100 ||
    Array.from(input.title).some((char) => char.charCodeAt(0) < 32)
  )
    throw new Error('항목명을 1~100자로 입력해주세요.')
  if (
    !Number.isSafeInteger(input.amount) ||
    input.amount <= 0 ||
    input.amount > 1_000_000_000_000
  )
    throw new Error('금액은 1원 이상 1조 원 이하의 정수로 입력해주세요.')
  if (!validDate(input.date)) throw new Error('올바른 날짜를 선택해주세요.')
}
