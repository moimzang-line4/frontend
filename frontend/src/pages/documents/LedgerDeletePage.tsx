import { useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import useFileScope from '../../hooks/files/useFileScope'
import useLedger from '../../hooks/documents/useLedger'
import LedgerDeleteDialog from '../../components/documents/LedgerDeleteDialog'
import * as S from '../../styles/files/FilesPage.styles'

export default function LedgerDeletePage() {
  const scope = useFileScope()
  const { ledger, loading, error } = useLedger(scope.id)
  const navigate = useNavigate()
  const back = () =>
    navigate('/files', { replace: true, state: { tab: '장부' } })

  return (
    <S.Page>
      <Header title="문서함" onBack={back} />
      <S.Content>
        {loading && <S.Empty role="status">장부를 불러오는 중이에요.</S.Empty>}
        {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
        {!loading && !error && !ledger && (
          <S.Empty>연결된 장부가 없어요.</S.Empty>
        )}
      </S.Content>
      {ledger && (
        <LedgerDeleteDialog ledger={ledger} onCancel={back} onDeleted={back} />
      )}
    </S.Page>
  )
}
