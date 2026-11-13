import { useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import LedgerEntryForm from '../../components/documents/LedgerEntryForm'
import useFileScope from '../../hooks/files/useFileScope'
import useLedger from '../../hooks/documents/useLedger'
import { saveLedgerEntry } from '../../utils/documents/ledgerEntries'
import * as S from '../../styles/files/FilesPage.styles'

export default function LedgerEntryPage() {
  const scope = useFileScope()
  const { ledger, loading, error } = useLedger(scope.id)
  const navigate = useNavigate()
  const back = () => navigate('/files', { state: { tab: '장부' } })

  return (
    <S.Page>
      <Header title="직접 입력" onBack={back} />
      {loading ? (
        <S.Content>
          <S.Empty role="status">장부를 불러오는 중이에요.</S.Empty>
        </S.Content>
      ) : error ? (
        <S.Content>
          <S.ErrorText role="alert">{error}</S.ErrorText>
        </S.Content>
      ) : !ledger ? (
        <S.Content>
          <S.Empty>먼저 장부를 등록해주세요.</S.Empty>
          <S.Attach
            type="button"
            onClick={() => navigate('/files/ledger/upload')}
          >
            장부 업로드
          </S.Attach>
        </S.Content>
      ) : (
        <LedgerEntryForm
          key={ledger.file.id}
          onSave={async (input) => {
            await saveLedgerEntry(scope.id, input, ledger.file.id)
            back()
          }}
        />
      )}
    </S.Page>
  )
}
