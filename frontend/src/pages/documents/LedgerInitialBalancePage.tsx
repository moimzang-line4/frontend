import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import useLedger from '../../hooks/documents/useLedger'
import { getApiErrorMessage } from '../../utils/members/mapper'
import * as S from '../../styles/documents/Ledger.styles'
import * as F from '../../styles/files/FilesPage.styles'

const today = () => {
  const now = new Date()
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`
}

// 초기 금액은 서버에 '초기 금액' 수입 내역으로 저장 (0원이면 내역 삭제)
export default function LedgerInitialBalancePage() {
  const { initialBalance, loading, error, saveInitialBalance } = useLedger()
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
          initial={initialBalance}
          onSave={(amount) => saveInitialBalance(amount, today())}
          onSaved={back}
        />
      )}
    </F.Page>
  )
}

function InitialBalanceForm({
  initial,
  onSave,
  onSaved,
}: {
  initial: number
  onSave: (amount: number) => Promise<void>
  onSaved: () => void
}) {
  const [amount, setAmount] = useState(initial ? String(initial) : '')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')
  const valid = /^\d+$/.test(amount) && Number.isSafeInteger(Number(amount))

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!valid || pending) return
    setPending(true)
    setError('')

    try {
      await onSave(Number(amount))
      onSaved()
    } catch (cause) {
      setError(getApiErrorMessage(cause, '초기 금액을 저장하지 못했어요.'))
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
            disabled={pending}
            onChange={(event) => setAmount(event.target.value.replaceAll(',', ''))}
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
