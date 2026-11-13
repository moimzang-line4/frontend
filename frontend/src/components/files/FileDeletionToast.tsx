import StatusToast from '../common/StatusToast'
import {
  clearFileDeletion,
  undoFileDeletion,
  useFileDeletion,
} from '../../hooks/files/useFileDeletion'

export default function FileDeletionToast({ scopeId }: { scopeId: string }) {
  const deletion = useFileDeletion()
  if (!deletion.file || deletion.file.scheduleId !== scopeId) return null

  return (
    <StatusToast
      title={deletion.error ? '파일을 복구하지 못했어요' : '파일을 삭제했어요'}
      description={deletion.error || deletion.file.name}
      aboveFooter
      actionText={deletion.restoring ? '복구 중…' : '되돌리기'}
      actionDisabled={deletion.restoring}
      onAction={() => void undoFileDeletion(deletion.token)}
      onClose={() => clearFileDeletion(deletion.token)}
    />
  )
}
