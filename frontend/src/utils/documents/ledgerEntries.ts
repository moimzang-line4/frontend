import type { LedgerInput } from '../../types/documents/ledger'
import { updateLedger } from './ledgerStorage'
import { ledgerTotals, validateLedgerInput } from './ledgerMath'

export async function saveLedgerEntry(
  scopeId: string,
  input: LedgerInput,
  fileId: string,
  entryId?: string,
) {
  validateLedgerInput(input)

  await updateLedger(scopeId, (current) => {
    if (!current || current.file.id !== fileId)
      throw new Error('장부가 변경되었어요. 현재 장부를 다시 확인해주세요.')
    if (entryId && !current.entries.some((entry) => entry.id === entryId))
      throw new Error('수정할 내역을 찾을 수 없어요.')

    const entries = entryId
      ? current.entries.map((entry) =>
          entry.id === entryId
            ? { ...entry, ...input, title: input.title.trim() }
            : entry,
        )
      : [
          ...current.entries,
          {
            ...input,
            title: input.title.trim(),
            id: crypto.randomUUID(),
            source: 'manual' as const,
          },
        ]
    const next = { ...current, entries, updatedAt: Date.now() }
    ledgerTotals(next)
    return next
  })
}
