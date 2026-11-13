import { useNavigate, useParams } from 'react-router'
import Header from '../../layouts/Header'
import LedgerEntryForm from '../../components/documents/LedgerEntryForm'
import useFileScope from '../../hooks/files/useFileScope'
import useLedger from '../../hooks/documents/useLedger'
import { saveLedgerEntry } from '../../utils/documents/ledgerEntries'
import * as S from '../../styles/files/FilesPage.styles'

export default function LedgerEntryPage() {
  const { entryId } = useParams()
  const scope = useFileScope()
  const { ledger, loading, error } = useLedger(scope.id)
  const entry = ledger?.entries.find((item) => item.id === entryId)
  const navigate = useNavigate()
  const back = () => navigate('/files', { state: { tab: '장부' } })

  return (
    <S.Page>
      <Header title={entryId ? '상세' : '직접 입력'} onBack={back} />
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
      ) : entryId && !entry ? (
        <S.Content>
          <S.Empty>삭제되었거나 이 장부에 없는 내역이에요.</S.Empty>
        </S.Content>
      ) : (
        <LedgerEntryForm
          key={`${ledger.file.id}:${entryId ?? 'new'}`}
          initial={entry}
          onDelete={
            entry
              ? () =>
                  navigate(
                    `/files/ledger/entries/${encodeURIComponent(entry.id)}/delete`,
                  )
              : undefined
          }
          onSave={async (input) => {
            await saveLedgerEntry(scope.id, input, ledger.file.id, entryId)
            back()
          }}
        />
      )}
    </S.Page>
  )
}
