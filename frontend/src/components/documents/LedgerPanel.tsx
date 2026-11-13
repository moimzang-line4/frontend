import LedgerSourceCard from './LedgerSourceCard'
import entryChevron from '../../assets/files/entry-chevron.svg'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import { ledgerTotals, won } from '../../utils/documents/ledgerMath'
import useLedger from '../../hooks/documents/useLedger'
import * as S from '../../styles/documents/Ledger.styles'
import { Empty, ErrorText } from '../../styles/files/FilesPage.styles'

type Props = { scopeId: string; search: string }

export default function LedgerPanel({ scopeId, search }: Props) {
  const navigate = useNavigate()
  const { ledger, loading, error, reload } = useLedger(scopeId)
  const [filter, setFilter] = useState('all')
  const totals = ledger ? ledgerTotals(ledger) : null
  const entries =
    ledger?.entries
      .filter(
        (entry) =>
          (filter === 'all' || entry.type === filter) &&
          entry.title.toLowerCase().includes(search.trim().toLowerCase()),
      )
      .sort((a, b) => b.date.localeCompare(a.date)) ?? []

  return (
    <S.Panel aria-label="기수 장부">
      {ledger && <LedgerSourceCard ledger={ledger} />}
      <S.Balance>
        <S.BalanceHeader>
          <span>현재 잔액</span>
          <button type="button" onClick={() => void reload()}>
            ↻ 정산 내역 새로고침
          </button>
        </S.BalanceHeader>
        <S.Total>{totals ? won(totals.balance) : '-원'}</S.Total>
        <S.Totals>
          <div>
            <dt>누적 수입</dt>
            <dd>{totals ? `+${won(totals.income)}` : '-원'}</dd>
          </div>
          <div>
            <dt>누적 지출</dt>
            <dd>{totals ? `-${won(totals.expense)}` : '-원'}</dd>
          </div>
        </S.Totals>
      </S.Balance>

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
      <S.Manual
        type="button"
        disabled={loading || !!error}
        onClick={() => navigate('/files/ledger/new')}
      >
        +직접 입력
      </S.Manual>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <S.Entries>
        {loading ? (
          <Empty role="status">장부를 불러오는 중이에요.</Empty>
        ) : (
          ledger && (
            <>
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
                  onClick={() =>
                    navigate(
                      `/files/ledger/entries/${encodeURIComponent(entry.id)}`,
                    )
                  }
                  aria-label={`${entry.title} 상세`}
                >
                  <span>
                    <strong>{entry.title}</strong>
                    <small>
                      {entry.date.replaceAll('-', '.')} ·{' '}
                      {entry.source === 'manual'
                        ? '직접 입력'
                        : entry.source === 'payment'
                          ? '정산'
                          : '장부'}
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
            </>
          )
        )}
      </S.Entries>
    </S.Panel>
  )
}
