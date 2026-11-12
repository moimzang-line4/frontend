// 피그마: AI 운영 비서 · 업무 요청 시작 (추천 요청)
export const ASSISTANT_SUGGESTIONS = [
  '가을 정기공연 미입금자 알려줘',
  '신입생 공연 미입금자 알려줘',
  '가을 공연 공지 작성해 줘',
  '등록된 공연 일정 알려줘',
] as const

export const ASSISTANT_TEXT = {
  title: 'AI 운영 비서',
  question: '어떤 업무를 도와드릴까요?',
  placeholder: 'AI에게 업무 요청하기',
  unpaidTitle: '미입금',
  unpaidTotal: '미입금 총액',
  goPayments: '정산·입금 관리로 이동 →',
  goNotice: '공지 복사 화면으로 이동 →',
  copyNotice: '공지 복사하기',
  copied: '복사했어요',
  noSchedule: '어떤 일정인지 찾지 못했어요. 일정 이름을 함께 적어 주세요.',
  notLoaded: '아직 정산 명단을 불러오지 않았어요.',
  allPaid: '미입금자가 없어요. 모두 입금했어요.',
  noSchedules: '등록된 공연 일정이 없어요.',
  fallback: '아직 이 요청은 도와드릴 수 없어요. 미입금자 확인, 정산 공지 작성, 공연 일정 조회를 요청해 보세요.',
} as const

// 답변이 오는 것처럼 보이는 대기 시간 (API 연결 전)
export const ASSISTANT_DELAY_MS = 500
