import { useRef, useState } from 'react'
import type { LedgerInput } from '../../types/documents/ledger'
import { validateLedgerInput } from '../../utils/documents/ledgerMath'
import calendarIcon from '../../assets/files/calendar.svg'
import dateChevron from '../../assets/files/ledger-date-chevron.svg'
import { ErrorText } from '../../styles/files/FilesPage.styles'
import { OutlineButton } from '../../styles/OutlineButton.styles'
import * as S from '../../styles/documents/Ledger.styles'

type Props = {
  initial?: LedgerInput
  onSave: (input: LedgerInput) => Promise<void>
  onDelete?: () => void
}

export default function LedgerEntryForm({ initial, onSave, onDelete }: Props) {
  const [type, setType] = useState<LedgerInput['type']>(
    initial?.type ?? 'expense',
  )
  const [title, setTitle] = useState(initial?.title ?? '')
  const [amount, setAmount] = useState(initial ? String(initial.amount) : '')
  const [date, setDate] = useState(() => {
    if (initial) return initial.date
    const today = new Date()
    return `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  })
  const [error, setError] = useState('')
  const [pending, setPending] = useState(false)
  const busy = useRef(false)

  return (
    <S.Form
      aria-label={initial ? '장부 내역 수정' : '장부 내역 등록'}
      onSubmit={async (event) => {
        event.preventDefault()
        if (busy.current) return
        setError('')

        try {
          const input = {
            type,
            title,
            amount: /^\d+$/.test(amount) ? Number(amount) : NaN,
            date,
          }
          validateLedgerInput(input)
          busy.current = true
          setPending(true)
          await onSave(input)
        } catch (cause) {
          setError(
            cause instanceof Error
              ? cause.message
              : '내역을 저장하지 못했어요.',
          )
        } finally {
          busy.current = false
          setPending(false)
        }
      }}
    >
      <S.Fields>
        <S.Field>
          <span id="entry-type-label">
            구분 <em>*</em>
          </span>
          <S.Type role="group" aria-labelledby="entry-type-label">
            {(
              [
                ['income', '수입'],
                ['expense', '지출'],
              ] as const
            ).map(([value, label]) => (
              <S.TypeButton
                key={value}
                type="button"
                $active={type === value}
                aria-pressed={type === value}
                disabled={pending}
                onClick={() => setType(value)}
              >
                {label}
              </S.TypeButton>
            ))}
          </S.Type>
        </S.Field>
        <S.Field>
          <label htmlFor="entry-title">
            항목 <em>*</em>
          </label>
          <input
            id="entry-title"
            value={title}
            maxLength={150}
            required
            disabled={pending}
            placeholder="항목명을 입력해주세요"
            onChange={(event) => setTitle(event.target.value)}
          />
        </S.Field>
        <S.Field>
          <label htmlFor="entry-amount">
            금액 <em>*</em>
          </label>
          <input
            id="entry-amount"
            value={amount}
            inputMode="numeric"
            required
            disabled={pending}
            placeholder="금액 입력"
            onChange={(event) =>
              setAmount(event.target.value.replaceAll(',', ''))
            }
          />
          <small>원</small>
        </S.Field>
        <S.Field>
          <label htmlFor="entry-date">
            날짜 <em>*</em>
          </label>
          <S.DateControl>
            <img src={calendarIcon} alt="" />
            <input
              id="entry-date"
              type="date"
              value={date}
              required
              disabled={pending}
              onChange={(event) => setDate(event.target.value)}
            />
            <img src={dateChevron} alt="" />
          </S.DateControl>
        </S.Field>
      </S.Fields>
      {error && <ErrorText role="alert">{error}</ErrorText>}
      <S.Submit type="submit" disabled={pending}>
        {pending ? '저장 중…' : initial ? '수정하기' : '등록하기'}
      </S.Submit>
      {onDelete && (
        <OutlineButton
          type="button"
          $tone="danger"
          disabled={pending}
          onClick={onDelete}
        >
          삭제하기
        </OutlineButton>
      )}
    </S.Form>
  )
}
