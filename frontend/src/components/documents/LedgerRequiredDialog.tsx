import ConfirmDialog from '../common/ConfirmDialog'

type Props = {
  open: boolean
  onCancel: () => void
  onUpload: () => void
}

export default function LedgerRequiredDialog({
  open,
  onCancel,
  onUpload,
}: Props) {
  return (
    <ConfirmDialog
      open={open}
      title="장부 등록이 필요해요"
      description={
        <>
          수입·지출 내역을 추가하려면 먼저 장부를 업로드해
          <br />
          초기 잔액을 설정해 주세요.
        </>
      }
      confirmText="장부 업로드"
      tone="primary"
      onCancel={onCancel}
      onConfirm={onUpload}
    />
  )
}
