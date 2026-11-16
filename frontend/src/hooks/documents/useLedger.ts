import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createLedgerEntry,
  deleteLedgerEntry,
  exportLedger,
  getLedgerSummary,
  syncLedger,
  updateLedgerEntry,
} from '../../api/generated'
import useOnboarding from '../onboarding/useOnboarding'
import { unwrap } from '../../utils/members/mapper'
import type { LedgerEntry, LedgerInput } from '../../types/documents/ledger'

const REQUEST = { timeout: 15000 }
const PAGE_SIZE = 100
const MAX_PAGES = 50
const API_ORIGIN = 'https://api.chungs.store'

// 초기 금액은 이 이름의 수입 내역으로 저장
export const INITIAL_BALANCE_TITLE = '초기 금액'

export type LedgerView = {
  // 서버에 등록된 장부 원본 파일 (없으면 null)
  file: { id: number; name: string } | null
  // 그룹 전체 누적 (기수가 바뀌어도 이월)
  balance: number
  income: number
  expense: number
  // 이 기수의 내역
  entries: LedgerEntry[]
}

export const ledgerKey = (termId: number) => ['ledger', termId] as const

// 기수 장부: 잔액·누적 수입/지출 + 내역 (서버 API)
export default function useLedger() {
  const { group } = useOnboarding()
  const termId = group?.termId
  const hasTerm = typeof termId === 'number' && Number.isSafeInteger(termId) && termId > 0
  const queryClient = useQueryClient()
  const key = ledgerKey(hasTerm ? termId : 0)

  const query = useQuery({
    queryKey: key,
    enabled: hasTerm,
    staleTime: 5_000,
    retry: 1,
    queryFn: async ({ signal }): Promise<LedgerView> => {
      const entries: LedgerEntry[] = []
      let summary: Omit<LedgerView, 'entries'> = { file: null, balance: 0, income: 0, expense: 0 }
      let cursor: string | undefined
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const response = await getLedgerSummary(termId as number, { type: 'ALL', size: PAGE_SIZE, cursor }, { ...REQUEST, signal })
        const data = unwrap(response.data, '장부를 불러오지 못했어요.')
        if (page === 0) {
          summary = {
            file: typeof data.ledgerFile?.fileId === 'number'
              ? { id: data.ledgerFile.fileId, name: data.ledgerFile.name ?? '장부' }
              : null,
            balance: data.currentBalance ?? 0,
            income: data.totalIncome ?? 0,
            expense: data.totalExpense ?? 0,
          }
        }
        for (const item of data.entries ?? []) {
          if (typeof item.entryId !== 'number') continue
          entries.push({
            id: String(item.entryId),
            type: item.type === 'INCOME' ? 'income' : 'expense',
            title: item.itemName ?? '',
            amount: item.amount ?? 0,
            date: item.entryDate ?? '',
            // RECEIPT: 정산에서 자동 기록 / MANUAL: 직접 입력
            source: item.source === 'RECEIPT' ? 'payment' : 'manual',
          })
        }
        if (!data.nextCursor) break
        cursor = data.nextCursor
      }
      return { ...summary, entries }
    },
  })

  const refresh = () => queryClient.invalidateQueries({ queryKey: key })

  const requireTerm = () => {
    if (!hasTerm) throw new Error('선택한 기수 정보가 없어요.')
    return termId
  }

  // 직접 입력 내역 등록·수정 (자동 기록은 서버에서 수정 불가)
  const saveEntry = async (input: LedgerInput, entryId?: string) => {
    const body = { type: input.type === 'income' ? 'INCOME' : 'EXPENSE', itemName: input.title.trim(), amount: input.amount, entryDate: input.date } as const
    try {
      if (entryId) {
        const response = await updateLedgerEntry(Number(entryId), body, REQUEST)
        unwrap(response.data, '내역을 수정하지 못했어요.')
      } else {
        const response = await createLedgerEntry(requireTerm(), body, REQUEST)
        unwrap(response.data, '내역을 등록하지 못했어요.')
      }
    } finally {
      await refresh()
    }
  }

  const removeEntry = async (entryId: string) => {
    try {
      const response = await deleteLedgerEntry(Number(entryId), REQUEST)
      if (response.data.success !== true) throw new Error(response.data.message || '내역을 삭제하지 못했어요.')
    } finally {
      await refresh()
    }
  }

  // '초기 금액' 수입 내역을 만들거나 금액을 바꿈 (0원이면 내역 삭제)
  const saveInitialBalance = async (amount: number, date: string) => {
    const current = query.data?.entries.find(entry => entry.source === 'manual' && entry.type === 'income' && entry.title === INITIAL_BALANCE_TITLE)
    if (amount <= 0) {
      if (current) await removeEntry(current.id)
      return
    }
    await saveEntry({ type: 'income', title: INITIAL_BALANCE_TITLE, amount, date: current?.date ?? date }, current?.id)
  }

  // 정산 완료된 영수증을 장부에 다시 반영
  const sync = async () => {
    try {
      const response = await syncLedger(requireTerm(), REQUEST)
      const data = unwrap(response.data, '정산 내역을 새로고침하지 못했어요.')
      return { created: data.createdCount ?? 0, updated: data.updatedCount ?? 0, deleted: data.deletedCount ?? 0 }
    } finally {
      await refresh()
    }
  }

  // 서버가 만든 엑셀 파일 받기
  const download = async () => {
    const response = await exportLedger(requireTerm(), { timeout: 60000 })
    const data = unwrap(response.data, '내역을 다운로드하지 못했어요.')
    if (!data.downloadUrl) throw new Error('내역을 다운로드하지 못했어요.')
    const anchor = document.createElement('a')
    anchor.href = new URL(data.downloadUrl, API_ORIGIN).toString()
    anchor.download = data.fileName ?? '장부.xlsx'
    anchor.rel = 'noopener'
    document.body.append(anchor)
    anchor.click()
    anchor.remove()
  }

  return {
    ledger: query.data ?? null,
    initialBalance: query.data?.entries.find(entry => entry.source === 'manual' && entry.type === 'income' && entry.title === INITIAL_BALANCE_TITLE)?.amount ?? 0,
    loading: hasTerm && query.isLoading,
    error: !hasTerm ? '선택한 기수 정보가 없어요.' : query.error ? (query.error as Error).message : '',
    reload: async () => { await query.refetch() },
    saveEntry,
    removeEntry,
    saveInitialBalance,
    sync,
    download,
  }
}
