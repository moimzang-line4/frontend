import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import { showAlert } from '../../hooks/useAlert'
import { useNoticeActions } from '../../hooks/payments/useSettlementApi'
import type { SettlementAccount } from '../../hooks/payments/useSettlementApi'
import { getApiErrorMessage } from '../../utils/members/mapper'
import { SETTLEMENT_TEXT } from '../../constants/payments/settlement'
import { parseAmount, won } from '../../utils/payments'
import type { Receipt } from '../../types/payments/receipt'
import * as S from '../../styles/payments/NoticeComposer.styles'
import * as F from '../../styles/payments/ReceiptForm.styles'

type Props = {
  scheduleId: number
  // 영수증이 등록된 차수
  receipts: Receipt[]
  // 서버에 저장된 대표 계좌 (처음 입력칸에 채워 둠)
  account?: Partial<SettlementAccount> | null
}

const ACCOUNT_FIELDS: readonly { key: keyof SettlementAccount; label: string; placeholder: string }[] = [
  { key: 'bankName', label: '은행', placeholder: '예) 카카오뱅크' },
  { key: 'accountNumber', label: '계좌번호', placeholder: '예) 3333-12-4378239' },
  { key: 'accountHolder', label: '예금주', placeholder: '예) 김동김' },
]

const SparkleIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3l1.8 4.6L18.5 9.5l-4.7 1.9L12 16l-1.8-4.6L5.5 9.5l4.7-1.9L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
)

// 피그마: 정산 공지 · 포함할 차수 선택 / 생성 결과 미리보기
export default function NoticeComposer({ scheduleId, receipts, account }: Props) {
  const { generate } = useNoticeActions(scheduleId)
  const [selected, setSelected] = useState<string[]>(() => receipts.slice(0, 1).map(receipt => receipt.id))
  const [form, setForm] = useState<SettlementAccount>(() => ({
    bankName: account?.bankName ?? '',
    accountNumber: account?.accountNumber ?? '',
    accountHolder: account?.accountHolder ?? '',
  }))
  const [notice, setNotice] = useState('')
  const [copied, setCopied] = useState(false)
  const [pending, setPending] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggle = (id: string) => {
    setSelected(prev => (prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]))
  }

  const handleGenerate = async () => {
    if (pending) return
    const roundIds = receipts.filter(receipt => selected.includes(receipt.id)).map(receipt => Number(receipt.id))
    if (roundIds.length === 0) {
      showAlert('공지에 포함할 차수를 선택해주세요.')
      return
    }

    // 계좌는 셋 다 입력했을 때만 저장 (모두 비우면 계좌 없이 생성)
    const trimmed = {
      bankName: form.bankName.trim(),
      accountNumber: form.accountNumber.trim(),
      accountHolder: form.accountHolder.trim(),
    }
    const filled = Object.values(trimmed).filter(Boolean).length
    if (filled > 0 && filled < 3) {
      showAlert('입금 계좌의 은행·계좌번호·예금주를 모두 입력해주세요.')
      return
    }

    setPending(true)
    try {
      setNotice(await generate(roundIds, filled === 3 ? trimmed : undefined))
      setCopied(false)
    } catch (caught) {
      showAlert(getApiErrorMessage(caught, '공지를 생성하지 못했어요.'))
    } finally {
      setPending(false)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(notice)
      setCopied(true)
      window.clearTimeout(timer.current)
      timer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showAlert('공지 복사에 실패했어요.', { description: '잠시 후 다시 시도해주세요.' })
    }
  }

  return (
    <S.Wrapper>
      <S.Section>
        <S.Heading>
          <S.Title>{SETTLEMENT_TEXT.noticeRoundTitle}</S.Title>
          <S.Description>{SETTLEMENT_TEXT.noticeRoundDescription}</S.Description>
        </S.Heading>

        <S.Rounds>
          {receipts.map(receipt => (
            <S.RoundOption key={receipt.id}>
              <S.Checkbox
                type="checkbox"
                checked={selected.includes(receipt.id)}
                onChange={() => toggle(receipt.id)}
              />
              <span>
                {receipt.round} <strong>{won(parseAmount(receipt.amount))}</strong>
              </span>
            </S.RoundOption>
          ))}
        </S.Rounds>
      </S.Section>

      <S.Section>
        <S.Heading>
          <S.Title>{SETTLEMENT_TEXT.noticeAccountTitle}</S.Title>
          <S.Description>{SETTLEMENT_TEXT.noticeAccountDescription}</S.Description>
        </S.Heading>

        <F.Card>
          {ACCOUNT_FIELDS.map(field => (
            <F.Row key={field.key}>
              <F.Label htmlFor={`notice-${field.key}`}>{field.label}</F.Label>
              <F.Input
                id={`notice-${field.key}`}
                value={form[field.key]}
                maxLength={50}
                placeholder={field.placeholder}
                onChange={event => setForm(prev => ({ ...prev, [field.key]: event.target.value }))}
              />
            </F.Row>
          ))}
        </F.Card>
      </S.Section>

      {notice && (
        <S.Section>
          <S.Heading>
            <S.Title>{SETTLEMENT_TEXT.noticePreviewTitle}</S.Title>
            <S.Description>{SETTLEMENT_TEXT.noticeRoundDescription}</S.Description>
          </S.Heading>

          <S.Preview>
            <S.PreviewText>{notice}</S.PreviewText>
            <S.CopyButton type="button" onClick={copy} aria-label="공지 복사">
              {copied ? (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <path d="M4.5 10.5l3.5 3.5 7.5-8" stroke="#367D70" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
                  <rect x="7" y="7" width="9" height="9" rx="2" stroke="currentColor" strokeWidth="1.5" />
                  <path d="M13 4.5A1.5 1.5 0 0 0 11.5 3h-6A1.5 1.5 0 0 0 4 4.5v6A1.5 1.5 0 0 0 5.5 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                </svg>
              )}
            </S.CopyButton>
          </S.Preview>
          {copied && <S.Copied role="status">공지를 복사했어요</S.Copied>}
        </S.Section>
      )}

      <Button onClick={() => void handleGenerate()} disabled={pending}>
        <S.ButtonContent>{SparkleIcon}{pending ? '공지 생성 중…' : '공지 생성하기'}</S.ButtonContent>
      </Button>
    </S.Wrapper>
  )
}
