import { useState } from 'react'
import { useNavigate } from 'react-router'
import useLedger from '../../hooks/documents/useLedger'
import * as S from '../../styles/documents/Ledger.styles'
import { Empty, ErrorText } from '../../styles/files/FilesPage.styles'

type Props = { scopeId: string; search: string }

export default function LedgerPanel({ scopeId }: Props) {
  const navigate = useNavigate()
  const { loading, error, reload } = useLedger(scopeId)
  const [filter, setFilter] = useState('all')

  return (
    <S.Panel aria-label="기수 장부">
      <S.Balance>
        <S.BalanceHeader>
          <span>현재 잔액</span>
          <button type="button" onClick={() => void reload()}>
            ↻ 정산 내역 새로고침
          </button>
        </S.BalanceHeader>
        <S.Total>-원</S.Total>
        <S.Totals>
          <div>
            <dt>누적 수입</dt>
            <dd>-원</dd>
          </div>
          <div>
            <dt>누적 지출</dt>
            <dd>-원</dd>
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
        {loading && <Empty role="status">장부를 불러오는 중이에요.</Empty>}
      </S.Entries>
    </S.Panel>
  )
}
