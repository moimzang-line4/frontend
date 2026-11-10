import type { ReactNode } from 'react'
import * as S from '../styles/EmptyState.styles'

type Props = {
  title: string
  description?: string
  icon?: ReactNode
}

const DocumentIcon = (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
    <path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8l-5-5Z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
    <path d="M14 3v5h5" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
  </svg>
)

// 목록이 비었을 때 보여주는 안내 (아이콘 + 제목 + 설명)
export default function EmptyState({ title, description, icon = DocumentIcon }: Props) {
  return (
    <S.Wrapper role="status">
      <S.Icon>{icon}</S.Icon>
      <S.Text>
        <S.Title>{title}</S.Title>
        {description && <S.Description>{description}</S.Description>}
      </S.Text>
    </S.Wrapper>
  )
}
