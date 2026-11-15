import type { ScheduleFile } from '../files/file'

export type LedgerEntry = {
  id: string
  type: 'income' | 'expense'
  title: string
  amount: number
  date: string
  source: 'imported' | 'manual' | 'payment'
  sourceKey?: string
}

export type Ledger = {
  id?: string
  scopeId: string
  initialBalance: number
  file?: ScheduleFile
  entries: LedgerEntry[]
  updatedAt: number
}

export type LedgerInput = Pick<
  LedgerEntry,
  'type' | 'title' | 'amount' | 'date'
>
