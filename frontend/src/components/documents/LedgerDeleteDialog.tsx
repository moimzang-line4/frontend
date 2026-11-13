import ConfirmDialog from '../common/ConfirmDialog'
import type { Ledger } from '../../types/documents/ledger'
import { updateLedger } from '../../utils/documents/ledgerStorage'

type Props = {
  ledger: Ledger
  onCancel: () => void
  onDeleted: () => void
}

export default function LedgerDeleteDialog({
  ledger,
  onCancel,
  onDeleted,
}: Props) {
  return (
    <ConfirmDialog
      open
      title="장부를 삭제할까요?"
      description={
        <>
          삭제 시 모든 수입·지출 내역이 사라져요.
          <br />
          내역을 다운로드해 기존 장부에 반영한 후 교체해 주세요.
        </>
      }
      confirmText="삭제"
      onCancel={onCancel}
      onConfirm={async () => {
        await updateLedger(ledger.scopeId, (current) => {
          if (current?.file.id !== ledger.file.id)
            throw new Error(
              '장부가 변경되었어요. 현재 장부를 다시 확인해주세요.',
            )
          return null
        })
        onDeleted()
      }}
    />
  )
}
