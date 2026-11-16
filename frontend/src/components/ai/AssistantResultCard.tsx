import { useNavigate } from 'react-router'
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

// 피그마: AI 운영 비서 · 미입금자 조회 결과 (결과 카드 + 이동 버튼)
export default function AssistantResultCard({ cardType, card, navigation }: Props) {
  const navigate = useNavigate()
  const target = navigation?.type ? ASSISTANT_NAVIGATION[navigation.type] : undefined
  const path = target?.path(navigation?.targetId)
  const action = target && path
    ? <S.ActionButton onClick={() => navigate(path)}>{target.label}</S.ActionButton>
    : null

  const hasCard = card !== null && card !== undefined && (Array.isArray(card) || isObject(card))
  if (!hasCard) return action

  const { items, title, amount } = parseCard(card)

  return (
    <S.Card aria-label={cardType ?? '결과'}>
      <S.Summary>
        <S.SummaryText>
          <S.Label>{title ? `${title}${cardType ? ` · ${cardType}` : ''}` : cardType ?? '결과'}</S.Label>
          {typeof amount === 'number' && <S.Amount>{won(amount)}</S.Amount>}
        </S.SummaryText>
        {items.length > 0 && <S.CountBadge>{items.length}명</S.CountBadge>}
      </S.Summary>

      {items.length > 0 ? (
        <S.List>
          {items.map((item, index) => {
            const { name, meta, amount: itemAmount } = describeItem(item)
            return (
              <S.Row key={`${name}-${index}`}>
                <S.Info>
                  <strong>{name || `항목 ${index + 1}`}</strong>
                  {meta && <S.Meta>{meta}</S.Meta>}
                  {typeof itemAmount === 'number' && <S.Total>총 {won(itemAmount)}</S.Total>}
                </S.Info>
              </S.Row>
            )
          })}
        </S.List>
      ) : (
        <S.Empty>표시할 항목이 없어요.</S.Empty>
      )}

      {action}
    </S.Card>
  )
}
