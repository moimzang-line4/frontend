import { ledgerIdentity } from '../../utils/documents/ledgerIdentity'
import { useMatch, useNavigate, useParams } from 'react-router'
import Header from '../../layouts/Header'
import { Navigate } from 'react-router'
import LedgerEntryDeleteDialog from '../../components/documents/LedgerEntryDeleteDialog'
import LedgerEntryForm from '../../components/documents/LedgerEntryForm'
import useFileScope from '../../hooks/files/useFileScope'
import useLedger from '../../hooks/documents/useLedger'
import { saveLedgerEntry } from '../../utils/documents/ledgerEntries'
import * as S from '../../styles/files/FilesPage.styles'

export default function LedgerEntryPage() {
  const { entryId } = useParams()
  const deleting = !!useMatch('/files/ledger/entries/:entryId/delete')
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
        <Navigate to="/files/ledger/initial" replace />
      ) : entryId && !entry ? (
        <S.Content>
          <S.Empty>삭제되었거나 이 장부에 없는 내역이에요.</S.Empty>
        </S.Content>
      ) : (
        <LedgerEntryForm
          key={`${ledgerIdentity(ledger)}:${entryId ?? 'new'}`}
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
            await saveLedgerEntry(
              scope.id,
              input,
              ledgerIdentity(ledger),
              entryId,
            )
            back()
          }}
        />
      )}
      {deleting && ledger && entry && (
        <LedgerEntryDeleteDialog
          ledger={ledger}
          entry={entry}
          onCancel={() =>
            navigate(`/files/ledger/entries/${encodeURIComponent(entry.id)}`, {
              replace: true,
            })
          }
          onDeleted={back}
        />
      )}
    </S.Page>
  )
}
