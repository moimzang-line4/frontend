import { useNavigate } from 'react-router'
import FileViewer from '../../components/files/FileViewer'
import useLedger from '../../hooks/documents/useLedger'
import { showAlert } from '../../hooks/useAlert'
import type { ScheduleFile } from '../../types/files/file'

// 서버에 등록된 장부 원본 파일 미리보기
export default function LedgerSourcePage() {
  const navigate = useNavigate()
  const { ledger, loading, error, reload } = useLedger()
  const file: ScheduleFile | undefined = ledger?.file
    ? {
        id: String(ledger.file.id),
        scheduleId: 'ledger',
        name: ledger.file.name,
        category: '예산·회계',
        createdAt: 0,
        size: 0,
      }
    : undefined

  return (
    <FileViewer
      file={file}
      loading={loading}
      error={error || (!loading && !file ? '등록된 장부 파일이 없어요.' : '')}
      onReload={reload}
      onBack={() => navigate('/files', { state: { tab: '장부' } })}
      // 장부 삭제는 지원하지 않음
      onDelete={() => showAlert('장부 파일은 삭제할 수 없어요.')}
    />
  )
}
