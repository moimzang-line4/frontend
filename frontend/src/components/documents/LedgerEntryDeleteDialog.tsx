import ConfirmDialog from '../common/ConfirmDialog'
import type { Ledger, LedgerEntry } from '../../types/documents/ledger'
import { deleteLedgerEntry } from '../../utils/documents/ledgerEntries'

type Props = {
  ledger: Ledger
  entry: LedgerEntry
  onCancel: () => void
  onDeleted: () => void
}

export default function LedgerEntryDeleteDialog({
  ledger,
  entry,
  onCancel,
  onDeleted,
}: Props) {
  return (
    <ConfirmDialog
      open
      title="내역을 삭제할까요?"
      description={
        <>
          이 내역이 장부에서 제외되고 잔액이 다시 계산돼요.
          <br />
          원본 영수증과 정산 기록은 유지돼요.
        </>
      }
      confirmText="삭제"
      onCancel={onCancel}
      onConfirm={async () => {
        await deleteLedgerEntry(ledger.scopeId, entry.id, ledger.file.id)
        onDeleted()
      }}
    />
  )
}
