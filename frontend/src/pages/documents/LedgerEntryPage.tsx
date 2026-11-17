import { Navigate, useMatch, useNavigate, useParams } from 'react-router'
import Header from '../../layouts/Header'
import LedgerEntryDeleteDialog from '../../components/documents/LedgerEntryDeleteDialog'
import LedgerEntryForm from '../../components/documents/LedgerEntryForm'
import useLedger from '../../hooks/documents/useLedger'
import { getApiErrorMessage } from '../../utils/members/mapper'
import * as S from '../../styles/files/FilesPage.styles'

export default function LedgerEntryPage() {
  const { entryId } = useParams()
  const deleting = !!useMatch('/files/ledger/entries/:entryId/delete')
  const { ledger, loading, error, saveEntry, removeEntry } = useLedger()
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
          key={entryId ?? 'new'}
          initial={entry}
          readOnly={entry?.source === 'payment'}
          onDelete={
            entry
              ? () =>
                  navigate(
                    `/files/ledger/entries/${encodeURIComponent(entry.id)}/delete`,
                  )
              : undefined
          }
          onSave={async (input) => {
            try {
              await saveEntry(input, entryId)
            } catch (caught) {
              throw new Error(getApiErrorMessage(caught, '내역을 저장하지 못했어요.'))
            }
            back()
          }}
        />
      )}
      {deleting && entry && (
        <LedgerEntryDeleteDialog
          onConfirm={() => removeEntry(entry.id)}
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
