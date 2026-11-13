import { useRef, useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useFileScope from '../../hooks/files/useFileScope'
import useLedger from '../../hooks/documents/useLedger'
import { importLedger } from '../../utils/documents/importLedger'
import { ledgerTotals } from '../../utils/documents/ledgerMath'
import { updateLedger } from '../../utils/documents/ledgerStorage'
import { fileSizeLabel, splitFileName } from '../../utils/files/format'
import type { LedgerEntry } from '../../types/documents/ledger'
import uploadIcon from '../../assets/files/upload.svg'
import * as S from '../../styles/files/FileUploadPage.styles'
import { ErrorText } from '../../styles/files/FilesPage.styles'

export default function LedgerUploadPage() {
  const scope = useFileScope()
  return <LedgerUpload key={scope.id} scopeId={scope.id} />
}

function LedgerUpload({ scopeId }: { scopeId: string }) {
  const navigate = useNavigate()
  const { ledger, loading, error: storageError } = useLedger(scopeId)
  const picker = useRef<HTMLInputElement>(null)
  const [file, setFile] = useState<File | null>(null)
  const [entries, setEntries] = useState<LedgerEntry[] | null>(null)
  const [initialBalance, setInitialBalance] = useState('0')
  const [name, setName] = useState('')
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const [replacing, setReplacing] = useState(false)
  const selectionVersion = useRef(0)
  const busy = useRef(false)
  const close = () =>
    navigate('/files', { replace: true, state: { tab: '장부' } })

  async function choose(selected?: File) {
    if (!selected) return
    const version = ++selectionVersion.current
    setFile(selected)
    setName(splitFileName(selected.name).name)
    setEntries(null)
    setError('')
    setPending(true)

    try {
      const result = await importLedger(selected)
      if (version !== selectionVersion.current) return
      setEntries(result.entries)
      setInitialBalance(String(result.initialBalance))
    } catch (cause) {
      if (version === selectionVersion.current)
        setError(
          cause instanceof Error ? cause.message : '장부를 읽지 못했어요.',
        )
    } finally {
      if (version === selectionVersion.current) setPending(false)
    }
  }

  async function save() {
    if (!file || !entries || busy.current) return
    const amount = Number(initialBalance)
    if (
      !/^-?\d+$/.test(initialBalance) ||
      !Number.isSafeInteger(amount) ||
      Math.abs(amount) > 1_000_000_000_000
    )
      throw new Error('초기 잔액을 올바른 원 단위 정수로 입력해주세요.')
    const title = name.trim()
    if (!title || title.length > 150 || /[\\/]/.test(title))
      throw new Error('장부 이름을 확인해주세요.')
    busy.current = true
    setPending(true)

    try {
      const next = {
        scopeId,
        initialBalance: amount,
        entries,
        updatedAt: Date.now(),
        file: {
          id: crypto.randomUUID(),
          scheduleId: scopeId,
          name: `${title}.xlsx`,
          category: '예산·회계' as const,
          createdAt: Date.now(),
          blob: file,
        },
      }
      ledgerTotals(next)
      await updateLedger(scopeId, () => next)
      navigate('/files', {
        replace: true,
        state: { tab: '장부', uploadedFileName: next.file.name },
      })
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  return (
    <S.Page>
      <Header
        title="장부 업로드"
        showBack={false}
        align="left"
        rightAction={
          <S.Close
            type="button"
            aria-label="닫기"
            disabled={pending}
            onClick={close}
          >
            ×
          </S.Close>
        }
      />
      <S.Form
        onSubmit={async (event) => {
          event.preventDefault()
          if (pending || loading || storageError || !entries) return
          setError('')
          if (ledger) {
            setReplacing(true)
            return
          }
          try {
            await save()
          } catch (cause) {
            setError(
              cause instanceof Error
                ? cause.message
                : '장부를 저장하지 못했어요.',
            )
          }
        }}
      >
        <S.Section>
          <h2>장부 파일</h2>
          <S.HiddenInput
            ref={picker}
            type="file"
            accept=".xlsx"
            aria-label="장부 파일 선택"
            disabled={pending}
            onChange={(event) => {
              void choose(event.target.files?.[0])
              event.target.value = ''
            }}
          />
          {file ? (
            <S.Selected>
              <div>
                <strong>{file.name}</strong>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() => picker.current?.click()}
                >
                  변경
                </button>
              </div>
              <span>{fileSizeLabel(file.size)}</span>
            </S.Selected>
          ) : (
            <S.Picker type="button" onClick={() => picker.current?.click()}>
              <img src={uploadIcon} alt="" width={24} height={24} />
              <strong>파일 선택</strong>
            </S.Picker>
          )}
        </S.Section>
        <S.Section>
          <label htmlFor="ledger-name">장부 이름</label>
          <S.NameField>
            <input
              id="ledger-name"
              value={name}
              maxLength={150}
              disabled={pending}
              onChange={(event) => setName(event.target.value)}
            />
            <span>.xlsx</span>
          </S.NameField>
        </S.Section>
        <S.Section>
          <label htmlFor="initial-balance">초기 잔액</label>
          <S.NameField>
            <input
              id="initial-balance"
              inputMode="numeric"
              value={initialBalance}
              disabled={pending}
              onChange={(event) => setInitialBalance(event.target.value)}
            />
            <span>원</span>
          </S.NameField>
        </S.Section>
        {entries && (
          <p>
            수입 {entries.filter((entry) => entry.type === 'income').length}건 ·
            지출 {entries.filter((entry) => entry.type === 'expense').length}건
          </p>
        )}
        {pending && <p role="status">장부를 처리하는 중이에요.</p>}
        {(error || storageError) && (
          <ErrorText role="alert">{error || storageError}</ErrorText>
        )}
        <S.Submit
          type="submit"
          disabled={
            !entries || !name.trim() || pending || loading || !!storageError
          }
        >
          {pending ? '처리 중…' : '장부 업로드'}
        </S.Submit>
      </S.Form>
      <ConfirmDialog
        open={replacing}
        title="장부를 교체할까요?"
        description="기존 장부의 수입·지출 내역이 새 파일의 내역으로 교체됩니다. 필요한 내역은 먼저 다운로드해주세요."
        confirmText="교체"
        onCancel={() => setReplacing(false)}
        onConfirm={save}
      />
    </S.Page>
  )
}
