import type { ChatNavigationResponseType } from '../../api/models/chatNavigationResponseType'

// 피그마: AI 운영 비서 · 업무 요청 시작 (추천 요청)
export const ASSISTANT_SUGGESTIONS = [
  '가을 정기공연 미입금자 알려줘',
  '신입생 공연 미입금자 알려줘',
  // 서버 AI가 공지 작성을 지원하지 않아 조회 질문으로 바꿈 (지원되면 '가을 공연 공지 작성해 줘'로 복구)
  '가을 정기공연 참석 현황 알려줘',
  '등록된 공연 일정 알려줘',
] as const

export const ASSISTANT_TEXT = {
  title: 'AI 운영 비서',
  question: '어떤 업무를 도와드릴까요?',
  placeholder: 'AI에게 업무 요청하기',
  noTerm: '선택한 기수 정보가 없어요. 그룹을 다시 선택해 주세요.',
  failed: '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.',
  offline: '서버에 연결하지 못했어요. 네트워크 상태를 확인해 주세요.',
} as const

// 서버 질문 최대 길이 (ChatMessageSendRequest.content)
export const ASSISTANT_MAX_LENGTH = 1000

// 답변 아래 '…로 이동' 버튼: 서버 navigation.type → 화면 주소·문구
// targetId: SETTLEMENT·ATTENDANCE·NOTE·SCHEDULE = 일정 ID, MEETING = 회의 ID, FILE·BUDGET = 없음
export const ASSISTANT_NAVIGATION: Record<ChatNavigationResponseType, { label: string; path: (id?: number) => string | null }> = {
  SETTLEMENT: { label: '정산·입금 관리로 이동 →', path: id => (id ? `/schedules/${id}/operations/payments` : null) },
  ATTENDANCE: { label: '참석·출석으로 이동 →', path: id => (id ? `/schedules/${id}/operations/attendance` : null) },
  NOTE: { label: '메모로 이동 →', path: id => (id ? `/schedules/${id}/operations/notes` : null) },
  SCHEDULE: { label: '일정 상세로 이동 →', path: id => (id ? `/schedules/${id}` : null) },
  MEETING: { label: '회의록으로 이동 →', path: id => (id ? `/meetings/${id}` : null) },
  FILE: { label: '문서함으로 이동 →', path: () => '/files' },
  BUDGET: { label: '장부로 이동 →', path: () => '/files' },
}
