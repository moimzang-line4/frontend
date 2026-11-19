import { useState } from 'react'
import { useNavigate } from 'react-router'
import { updatePaymentStatus } from '../../api/generated'
import { showAlert } from '../../hooks/useAlert'
import { getApiErrorMessage } from '../../utils/members/mapper'
import { ASSISTANT_NAVIGATION } from '../../constants/ai/assistant'
import { won } from '../../utils/payments'
import type { ChatNavigationResponse } from '../../api/models/chatNavigationResponse'
import * as S from '../../styles/ai/AssistantResult.styles'

type Props = {
  cardType?: string | null
  card?: unknown
  navigation?: ChatNavigationResponse | null
}

type Item = Record<string, unknown>

const isObject = (value: unknown): value is Item =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const isAmountKey = (key: string) => /amount|total|price|cost|money/i.test(key)
const isNameKey = (key: string) => /^(name|memberName|attendeeName)$/i.test(key)
const isTitleKey = (key: string) => /title|scheduleName/i.test(key)

// 서버 card 구조가 고정돼 있지 않아서, 들어온 값에서 목록·제목·금액을 찾아 그리기
function parseCard(card: unknown) {
  const root = isObject(card) ? card : {}
  const list = Array.isArray(card)
    ? card
    : Object.values(root).find(value => Array.isArray(value) && value.some(isObject))
  const items = (Array.isArray(list) ? list : []).filter(isObject)

  const entries = Object.entries(root)
  const title = entries.find(([key, value]) => isTitleKey(key) && typeof value === 'string')?.[1] as string | undefined
  const amount = entries.find(([key, value]) => isAmountKey(key) && typeof value === 'number')?.[1] as number | undefined
  return { items, title, amount }
}

function describeItem(item: Item) {
  const entries = Object.entries(item)
  const nameEntry = entries.find(([key, value]) => isNameKey(key) && typeof value === 'string')
    ?? entries.find(([, value]) => typeof value === 'string')
  const name = (nameEntry?.[1] as string | undefined) ?? ''
  const meta = entries
    .filter(([key, value]) => typeof value === 'string' && key !== nameEntry?.[0] && !/id$|at$|status/i.test(key))
    .map(([, value]) => value as string)
    .join(' · ')
  const amount = entries.find(([key, value]) => isAmountKey(key) && typeof value === 'number')?.[1] as number | undefined
  return { name, meta, amount }
}

export const hasResultCard = (card: unknown) =>
  card !== null && card !== undefined && (Array.isArray(card) || isObject(card))

// '…로 이동' 버튼 (결과 카드가 없으면 답변 말풍선 안에 넣음)
export function AssistantActionButton({ navigation }: { navigation?: ChatNavigationResponse | null }) {
  const navigate = useNavigate()
  const target = navigation?.type ? ASSISTANT_NAVIGATION[navigation.type] : undefined
  const path = target?.path(navigation?.targetId)
  if (!target || !path) return null
  // SUIT 글꼴의 '→'는 '>'처럼 보여서, 피그마(Noto Sans KR)처럼 보이도록 화살표를 아이콘으로 그림
  return (
    <S.ActionButton onClick={() => navigate(path)}>
      {target.label.replace(/\s*→\s*$/, '')}
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" aria-hidden="true">
        <path d="M3 9h11.5M10 4.5L14.5 9 10 13.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </S.ActionButton>
  )
}

// 받침이 있으면 '을', 없으면 '를'
const objectParticle = (word: string) => {
  const code = word.charCodeAt(word.length - 1) - 0xac00
  return code >= 0 && code <= 11171 && code % 28 !== 0 ? '을' : '를'
}

// 피그마처럼 결과 카드가 있으면 말풍선은 한 줄 요약만 ('가을공연 미입금자를 확인했어요.')
export function summarizeCard(cardType: string | null | undefined, card: unknown, text: string) {
  const { title } = parseCard(card)
  const subject = title?.split(/[·・]/)[0]?.trim()
  const what = cardType?.replace(/\s*(조회|결과|목록)$/, '').trim()
  if (subject && what) return `${subject} ${what}${objectParticle(what)} 확인했어요.`
  if (what) return `${what}${objectParticle(what)} 확인했어요.`
  return text.split('\n')[0].replace(/[:：]\s*$/, '')
}

const unpaidCard = (cardType?: string | null) => /미입금|미납/.test(cardType ?? '')

// 피그마: AI 운영 비서 · 미입금자 조회 결과 (결과 카드 + 이동 버튼)
export default function AssistantResultCard({ cardType, card, navigation }: Props) {
  const [paidIds, setPaidIds] = useState<number[]>([])
  const [pendingId, setPendingId] = useState<number | null>(null)
  if (!hasResultCard(card)) return null

  const { items, title, amount } = parseCard(card)
  const unpaid = unpaidCard(cardType)
  // 정산 이동 버튼의 targetId = 일정 ID (입금 확인에 필요)
  const scheduleId = navigation?.type === 'SETTLEMENT' ? navigation.targetId : undefined

  const confirm = async (attendeeId: number) => {
    if (!scheduleId || pendingId) return
    setPendingId(attendeeId)
    try {
      const response = await updatePaymentStatus(scheduleId, attendeeId, { paid: true }, { timeout: 15000 })
      if (response.data.success !== true) throw new Error(response.data.message || '입금 상태를 바꾸지 못했어요.')
      setPaidIds(prev => [...prev, attendeeId])
    } catch (caught) {
      showAlert(getApiErrorMessage(caught, '입금 상태를 바꾸지 못했어요.'))
    } finally {
      setPendingId(null)
    }
  }

  return (
    <S.Card aria-label={cardType ?? '결과'}>
      <S.Summary>
        <S.SummaryText>
          <S.Label>{title ?? cardType ?? '결과'}</S.Label>
          {typeof amount === 'number' && (
            <>
              <S.SubLabel>{unpaid ? '미입금 총액' : '총액'}</S.SubLabel>
              <S.Amount>{won(amount)}</S.Amount>
            </>
          )}
        </S.SummaryText>
        {items.length > 0 && <S.CountBadge>{items.length}명</S.CountBadge>}
      </S.Summary>

      {items.length > 0 ? (
        <S.List>
          {items.map((item, index) => {
            const { name, meta, amount: itemAmount } = describeItem(item)
            const attendeeId = typeof item.attendeeId === 'number' ? item.attendeeId : undefined
            const canConfirm = unpaid && scheduleId && attendeeId !== undefined
            return (
              <S.Row key={`${name}-${index}`}>
                <S.Info>
                  <strong>{name || `항목 ${index + 1}`}</strong>
                  {meta && <S.Meta>{meta}</S.Meta>}
                  {typeof itemAmount === 'number' && <S.Total>총 {won(itemAmount)}</S.Total>}
                </S.Info>
                {canConfirm && (paidIds.includes(attendeeId) ? (
                  <S.DoneBadge>입금 완료</S.DoneBadge>
                ) : (
                  <S.ConfirmButton type="button" disabled={pendingId !== null} onClick={() => void confirm(attendeeId)}>
                    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                      <path d="M2.5 6.2l2.3 2.3 4.7-5" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    {pendingId === attendeeId ? '처리 중' : '입금 확인'}
                  </S.ConfirmButton>
                ))}
              </S.Row>
            )
          })}
        </S.List>
      ) : (
        <S.Empty>표시할 항목이 없어요.</S.Empty>
      )}

      <AssistantActionButton navigation={navigation} />
    </S.Card>
  )
}
