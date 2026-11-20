import entryChevron from '../../assets/files/entry-chevron.svg'
import searchIcon from '../../assets/files/search.svg'
import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import { won } from '../../utils/documents/ledgerMath'
import useLedger, { INITIAL_BALANCE_TITLE } from '../../hooks/documents/useLedger'
import { showAlert } from '../../hooks/useAlert'
import { getApiErrorMessage } from '../../utils/members/mapper'
import type { LedgerEntry } from '../../types/documents/ledger'
import * as S from '../../styles/documents/Ledger.styles'
import { Empty, ErrorText, Search } from '../../styles/files/FilesPage.styles'

const today = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// 시작 잔액은 서버에 '초기 금액' 수입 내역으로 저장 → 목록·누적 수입에서는 제외
const isStartEntry = (entry: LedgerEntry) =>
  entry.source === 'manual' && entry.type === 'income' && entry.title === INITIAL_BALANCE_TITLE

const digits = (value: string) => value.replace(/[^\d]/g, '')
const withComma = (value: string) => (value ? Number(value).toLocaleString('ko-KR') : '')

// 피그마: 문서함 · 장부 상세 (시작 잔액 입력 / 현재 잔액 + 시작 잔액 수정)
export default function LedgerPanel() {
  const navigate = useNavigate()
  const { ledger, initialBalance, loading, error, sync, download, saveInitialBalance } = useLedger()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'all' | 'expense' | 'income'>('all')
  const [syncing, setSyncing] = useState(false)
  const [downloading, setDownloading] = useState(false)
  // 시작 잔액 수정 중이면 입력칸으로 바뀜
  const [editingStart, setEditingStart] = useState(false)

  const startEntry = ledger?.entries.find(isStartEntry)
  // 아직 아무 기록이 없으면 '시작 잔액' 입력 카드부터
  const needsStart = !!ledger && ledger.entries.length === 0
  const income = ledger ? ledger.income - (startEntry?.amount ?? 0) : 0

  const entries =
    ledger?.entries
      .filter(
        (entry) =>
          !isStartEntry(entry) &&
          (filter === 'all' || entry.type === filter) &&
          entry.title.toLowerCase().includes(search.trim().toLowerCase()),
      )
      .sort((a, b) => b.date.localeCompare(a.date)) ?? []

  const handleSync = async () => {
    setSyncing(true)
    try {
      const result = await sync()
      const changed = result.created + result.updated + result.deleted
      showAlert(
        changed ? '정산 내역을 장부에 반영했어요.' : '새로 반영할 정산 내역이 없어요.',
        changed ? { description: `추가 ${result.created}건 · 변경 ${result.updated}건 · 삭제 ${result.deleted}건` } : undefined,
      )
    } catch (caught) {
      showAlert(getApiErrorMessage(caught, '정산 내역을 새로고침하지 못했어요.'))
    } finally {
      setSyncing(false)
    }
  }

  const handleDownload = async () => {
    setDownloading(true)
    try {
      await download()
    } catch (caught) {
      showAlert(getApiErrorMessage(caught, '내역을 다운로드하지 못했어요. 다시 시도해주세요.'))
    } finally {
      setDownloading(false)
    }
  }

  const saveStart = async (amount: number) => {
    try {
      await saveInitialBalance(amount, startEntry?.date ?? today())
      setEditingStart(false)
    } catch (caught) {
      showAlert(getApiErrorMessage(caught, '시작 잔액을 저장하지 못했어요.'))
    }
  }

  return (
    <S.Panel aria-label="기수 장부">
      {loading ? (
        <Empty role="status">장부를 불러오는 중이에요.</Empty>
      ) : error ? (
        <ErrorText role="alert">{error}</ErrorText>
      ) : needsStart ? (
        <S.StartCard>
          <S.StartHeading>
            <S.StartTitle>시작 잔액</S.StartTitle>
            <S.StartDescription>장부에 기록을 시작할 때의 잔액을 입력해주세요.</S.StartDescription>
          </S.StartHeading>
          <StartBalanceForm initial={0} large onSave={saveStart} />
        </S.StartCard>
      ) : (
        ledger && (
          <S.Balance>
            <S.BalanceTop>
              <S.BalanceHeader>
                <span>현재 잔액</span>
                <button type="button" disabled={syncing} onClick={() => void handleSync()}>
                  {syncing ? '반영 중…' : '↻ 정산 내역 새로고침'}
                </button>
              </S.BalanceHeader>
              <S.Total>{won(ledger.balance)}</S.Total>
            </S.BalanceTop>
            <S.Totals>
              <div>
                <dt>누적 수입</dt>
                <dd>+{won(income)}</dd>
              </div>
              <div>
                <dt>누적 지출</dt>
                <dd>-{won(ledger.expense)}</dd>
              </div>
            </S.Totals>
            {editingStart ? (
              <StartBalanceForm initial={initialBalance} onSave={saveStart} />
            ) : (
              <S.StartRow>
                <strong>시작 잔액</strong>
                <span>{won(initialBalance)}</span>
                <S.Pill type="button" onClick={() => setEditingStart(true)}>수정</S.Pill>
              </S.StartRow>
            )}
          </S.Balance>
        )
      )}

      <S.Tools>
      <Search>
        <img src={searchIcon} alt="" width={20} height={20} />
        <input
          aria-label="항목 검색"
          placeholder="항목 검색"
          type="search"
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </Search>

      <S.Filters role="group" aria-label="장부 내역 분류">
        {(
          [
            ['all', '전체'],
            ['expense', '지출'],
            ['income', '수입'],
          ] as const
        ).map(([value, label]) => (
          <S.Filter
            key={value}
            type="button"
            $active={filter === value}
            aria-pressed={filter === value}
            onClick={() => setFilter(value)}
          >
            {label}
          </S.Filter>
        ))}
      </S.Filters>
      <S.ListGroup>
      <S.Manual
        type="button"
        disabled={loading || !!error}
        onClick={() => navigate('/files/ledger/new')}
      >
        +직접 입력
      </S.Manual>

      <S.Entries>
        {/* 시작 잔액 입력 전에도 빈 목록 안내를 보여줌 */}
        {ledger && (
          <S.EntryList>
            <S.EntryHeading>
              <span>항목/날짜</span>
              <span>금액</span>
              <span>상세</span>
            </S.EntryHeading>
            {entries.map((entry) => (
              <S.Entry
                key={entry.id}
                type="button"
                $income={entry.type === 'income'}
                onClick={() => navigate(`/files/ledger/entries/${encodeURIComponent(entry.id)}`)}
                aria-label={`${entry.title} 상세`}
              >
                <span>
                  <strong>{entry.title}</strong>
                  <small>
                    {entry.date.slice(5).replace('-', '.')} · {entry.source === 'payment' ? '정산' : '직접 입력'}
                  </small>
                </span>
                <span>
                  {entry.type === 'income' ? '+' : '-'}
                  {entry.amount.toLocaleString('ko-KR')}
                </span>
                <span aria-hidden="true">
                  <img src={entryChevron} alt="" />
                </span>
              </S.Entry>
            ))}
            {!entries.length && <Empty>표시할 내역이 없어요.</Empty>}
          </S.EntryList>
        )}
      </S.Entries>
      </S.ListGroup>
      </S.Tools>

      {/* 피그마 메모: 장부 파일 내려받기는 아래 버튼 */}
      {ledger && !needsStart && (
        <S.Download type="button" disabled={downloading} onClick={() => void handleDownload()}>
          {downloading ? '다운로드 준비 중…' : '장부 내역 엑셀 다운로드'}
        </S.Download>
      )}
    </S.Panel>
  )
}

// 시작 잔액 입력: 처음엔 큰 '저장하기' 버튼, 수정할 땐 입력칸 안 '저장' 버튼
function StartBalanceForm({
  initial,
  large = false,
  onSave,
}: {
  initial: number
  large?: boolean
  onSave: (amount: number) => Promise<void>
}) {
  const [value, setValue] = useState(initial ? String(initial) : '')
  const [pending, setPending] = useState(false)

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (pending) return
    const amount = Number(value || 0)
    if (!Number.isSafeInteger(amount)) {
      showAlert('금액을 다시 확인해주세요.')
      return
    }
    setPending(true)
    try {
      await onSave(amount)
    } finally {
      setPending(false)
    }
  }

  return (
    <S.StartForm onSubmit={submit}>
      <S.AmountBox>
        <input
          aria-label="시작 잔액"
          inputMode="numeric"
          placeholder="0"
          value={withComma(value)}
          disabled={pending}
          onChange={(event) => setValue(digits(event.target.value))}
        />
        <span>원</span>
        {!large && (
          <S.Pill type="submit" disabled={pending}>
            {pending ? '저장 중' : '저장'}
          </S.Pill>
        )}
      </S.AmountBox>
      {large && (
        <S.StartSubmit type="submit" disabled={pending}>
          {pending ? '저장 중…' : '저장하기'}
        </S.StartSubmit>
      )}
    </S.StartForm>
  )
}
