import { useNavigate } from 'react-router'
import FileViewer from '../../components/files/FileViewer'
import useFileScope from '../../hooks/files/useFileScope'
import useLedger from '../../hooks/documents/useLedger'

export default function LedgerSourcePage() {
  const scope = useFileScope()
  const navigate = useNavigate()
  const { ledger, loading, error, reload } = useLedger(scope.id)

  return (
    <FileViewer
      file={ledger?.file}
      loading={loading}
      error={error}
      onReload={reload}
      onBack={() => navigate('/files', { state: { tab: '장부' } })}
      onDelete={() => navigate('/files/ledger/delete')}
    />
  )
}
