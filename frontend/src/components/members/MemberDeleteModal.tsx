import ConfirmDialog from '../common/ConfirmDialog'

type Props = {
  title: string
  description: string
  confirmText?: string
  onCancel: () => void
  onConfirm: () => void
}

export default function MemberDeleteModal({ title, description, confirmText = '삭제', onCancel, onConfirm }: Props) {
  return <ConfirmDialog open title={title} description={description} confirmText={confirmText} titleSize={18} onCancel={onCancel} onConfirm={onConfirm} />
}
