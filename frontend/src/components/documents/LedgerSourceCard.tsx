import { useState } from 'react'
import { useNavigate } from 'react-router'
import FileActionsSheet from '../files/FileActionsSheet'
import type { Ledger } from '../../types/documents/ledger'
import { exportLedger } from '../../utils/documents/exportLedger'
import { fileDateLabel, fileSizeLabel } from '../../utils/files/format'
import ledgerIcon from '../../assets/files/ledger-file.svg'
import moreIcon from '../../assets/files/more.svg'
import * as S from '../../styles/files/FilesPage.styles'
import * as L from '../../styles/documents/Ledger.styles'

export default function LedgerSourceCard({ ledger }: { ledger: Ledger }) {
  const navigate = useNavigate()
  const [menu, setMenu] = useState(false)
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const file = ledger.file

  return (
    <>
      <L.SourceHeader>
        <h2>전체 장부</h2>
        <button
          type="button"
          disabled={pending}
          onClick={async () => {
            setPending(true)
            setError('')
            try {
              await exportLedger(ledger)
            } catch {
              setError('현재 내역을 다운로드하지 못했어요. 다시 시도해주세요.')
            } finally {
              setPending(false)
            }
          }}
        >
          {pending ? '처리 중…' : '내역 다운로드'}
        </button>
        <button type="button" onClick={() => navigate('/files/ledger/upload')}>
          장부 교체
        </button>
      </L.SourceHeader>
      {error && <S.ErrorText role="alert">{error}</S.ErrorText>}
      <ul>
        <S.Card>
          <S.FileButton
            type="button"
            aria-label={`${file.name} 미리보기`}
            onClick={() => navigate('/files/ledger/source')}
          >
            <img src={ledgerIcon} alt="" width={20} height={14} />
            <span>
              <strong>{file.name}</strong>
              <small>
                장부 · {fileDateLabel(file.createdAt)} ·{' '}
                {fileSizeLabel(file.blob.size)}
              </small>
            </span>
          </S.FileButton>
          <S.More
            type="button"
            aria-label={`${file.name} 더보기`}
            onClick={() => setMenu(true)}
          >
            <img src={moreIcon} alt="" width={16} height={16} />
          </S.More>
        </S.Card>
      </ul>
      {menu && (
        <FileActionsSheet
          file={file}
          onClose={() => setMenu(false)}
          onPreview={() => navigate('/files/ledger/source')}
          onDelete={() => navigate('/files/ledger/delete')}
        />
      )}
    </>
  )
}
