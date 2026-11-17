import { useState } from 'react'
import ConfirmDialog from '../common/ConfirmDialog'
import { showAlert } from '../../hooks/useAlert'
import { getApiErrorMessage } from '../../utils/members/mapper'

type Props = {
  onCancel: () => void
  // 서버 삭제 (실패하면 알림)
  onConfirm: () => Promise<void>
  onDeleted: () => void
}

export default function LedgerEntryDeleteDialog({ onCancel, onConfirm, onDeleted }: Props) {
  const [pending, setPending] = useState(false)

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
      confirmText={pending ? '삭제 중…' : '삭제'}
      onCancel={onCancel}
      onConfirm={async () => {
        if (pending) return
        setPending(true)
        try {
          await onConfirm()
          onDeleted()
        } catch (caught) {
          // 정산 일정이 남아 있는 자동 기록은 서버가 삭제를 막음(409)
          showAlert(getApiErrorMessage(caught, '내역을 삭제하지 못했어요.'))
          onCancel()
        } finally {
          setPending(false)
        }
      }}
    />
  )
}
