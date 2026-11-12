import { useEffect, useRef, useState } from 'react'
import Button from '../Button'
import { showAlert } from '../../hooks/useAlert'
import { SETTLEMENT_TEXT } from '../../constants/payments/settlement'
import { buildNotice, won } from '../../utils/payments'
import type { RoundSummary } from '../../types/payments/settlement'
import * as S from '../../styles/payments/NoticeComposer.styles'

type Props = {
  title: string
  summaries: RoundSummary[]
}

const SparkleIcon = (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M12 3l1.8 4.6L18.5 9.5l-4.7 1.9L12 16l-1.8-4.6L5.5 9.5l4.7-1.9L12 3Z" stroke="currentColor" strokeWidth="1.6" strokeLinejoin="round" />
    <path d="M18.5 15l.8 2 2 .8-2 .8-.8 2-.8-2-2-.8 2-.8.8-2Z" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" />
  </svg>
)

// 피그마: 정산 공지 · 포함할 차수 선택 / 생성 결과 미리보기
export default function NoticeComposer({ title, summaries }: Props) {
  const [selected, setSelected] = useState<string[]>(() => summaries.slice(0, 1).map(summary => summary.round))
  const [notice, setNotice] = useState('')
  const [copied, setCopied] = useState(false)
  const timer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(timer.current), [])

  const toggle = (round: string) => {
    setSelected(prev => (prev.includes(round) ? prev.filter(item => item !== round) : [...prev, round]))
  }

  const generate = () => {
    const included = summaries.filter(summary => selected.includes(summary.round))
    if (included.length === 0) {
      showAlert('공지에 포함할 차수를 선택해주세요.')
      return
    }
    setNotice(buildNotice(title, included))
    setCopied(false)
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
          {summaries.map(summary => (
            <S.RoundOption key={summary.round}>
              <S.Checkbox
                type="checkbox"
                checked={selected.includes(summary.round)}
                onChange={() => toggle(summary.round)}
              />
              <span>
                {summary.round} <strong>{won(summary.cost)}</strong>
              </span>
            </S.RoundOption>
          ))}
        </S.Rounds>
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

      <Button onClick={generate}>
        <S.ButtonContent>{SparkleIcon}공지 생성하기</S.ButtonContent>
      </Button>
    </S.Wrapper>
  )
}
