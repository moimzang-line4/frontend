import type { ChatNavigationResponse } from '../../api/models/chatNavigationResponse'

// AI 운영 비서 대화 메시지 (assistant는 서버 ChatMessageResponse 기준)
export type AssistantMessage =
  | { id: string; role: 'user'; text: string }
  | {
      id: string
      role: 'assistant'
      text: string
      navigation?: ChatNavigationResponse | null
      cardType?: string | null
      // 결과 카드 상세 (서버가 구조를 고정하지 않아 unknown으로 받음)
      card?: unknown
      error?: boolean
    }
