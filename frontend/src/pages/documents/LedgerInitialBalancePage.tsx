import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import useFileScope from '../../hooks/files/useFileScope'
import useLedger from '../../hooks/documents/useLedger'
import type { Ledger } from '../../types/documents/ledger'
import { updateLedger } from '../../utils/documents/ledgerStorage'
import { ledgerIdentity } from '../../utils/documents/ledgerIdentity'
import { ledgerTotals } from '../../utils/documents/ledgerMath'
import * as S from '../../styles/documents/Ledger.styles'
import * as F from '../../styles/files/FilesPage.styles'

export default function LedgerInitialBalancePage() {
  const scope = useFileScope()
  const { ledger, loading, error } = useLedger(scope.id)
  const navigate = useNavigate()
  const back = () =>
    navigate('/files', { replace: true, state: { tab: '장부' } })

  return (
    <F.Page>
      <Header title="초기 금액 설정" onBack={back} />
      {loading ? (
        <F.Empty role="status">장부를 불러오는 중이에요.</F.Empty>
      ) : error ? (
        <F.Content>
          <F.ErrorText role="alert">{error}</F.ErrorText>
        </F.Content>
      ) : (
        <InitialBalanceForm
          key={scope.id}
          scopeId={scope.id}
          ledger={ledger}
          onSaved={back}
        />
      )}
    </F.Page>
  )
}

function InitialBalanceForm({
  scopeId,
  ledger,
  onSaved,
}: {
  scopeId: string
  ledger: Ledger | null
  onSaved: () => void
}) {
  const [amount, setAmount] = useState(
    ledger ? String(ledger.initialBalance) : '',
  )
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const valid = /^\d+$/.test(amount) && Number.isSafeInteger(Number(amount))

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid || pending) return
    setPending(true)
    setError('')

    try {
      await updateLedger(scopeId, (current) => {
        if (
          (current ? ledgerIdentity(current) : null) !==
            (ledger ? ledgerIdentity(ledger) : null) ||
          current?.initialBalance !== ledger?.initialBalance
        ) {
          throw new Error('장부가 변경되었어요. 현재 장부를 다시 확인해주세요.')
        }
        const next: Ledger = current
          ? {
              ...current,
              initialBalance: Number(amount),
              updatedAt: Date.now(),
            }
          : {
              id: crypto.randomUUID(),
              scopeId,
              initialBalance: Number(amount),
              entries: [],
              updatedAt: Date.now(),
            }
        ledgerTotals(next)
        return next
      })
      onSaved()
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : '초기 금액을 저장하지 못했어요.',
      )
    } finally {
      setPending(false)
    }
  }

  return (
    <S.Form onSubmit={submit}>
      <S.Fields>
        <S.Field>
          <label htmlFor="initial-balance">
            초기 금액 <em>*</em>
          </label>
          <input
            id="initial-balance"
            inputMode="numeric"
            required
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            placeholder="금액 입력"
          />
          <small>원</small>
        </S.Field>
      </S.Fields>
      {error && <F.ErrorText role="alert">{error}</F.ErrorText>}
      <S.Submit type="submit" disabled={!valid || pending}>
        {pending ? '저장 중…' : '저장하기'}
      </S.Submit>
    </S.Form>
  )
}
