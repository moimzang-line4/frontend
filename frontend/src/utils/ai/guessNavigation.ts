import type { ChatNavigationResponse } from '../../api/models/chatNavigationResponse'
import type { ScheduleLink } from '../../hooks/ai/useScheduleLinks'

// 서버가 navigation을 안 보낼 때 프론트에서 임시로 이동 버튼을 추측
// (백엔드가 navigation을 채워 주면 그 값이 항상 우선)

const normalize = (text: string) => text.replace(/[\s"'“”‘’「」『』]/g, '').toLowerCase()

// 답변·질문에 이름이 들어 있는 일정 (긴 이름 우선: '가을 정기공연'보다 '가을 정기공연 뒤풀이')
export function findSchedule(text: string, schedules: ScheduleLink[]) {
  const target = normalize(text)
  return [...schedules]
    .sort((a, b) => b.title.length - a.title.length)
    .find(schedule => normalize(schedule.title).length >= 2 && target.includes(normalize(schedule.title)))
}

// 질문·답변에 나온 말로 어느 화면인지 고르기
function pickType(text: string): ChatNavigationResponse['type'] {
  if (/미입금|입금|정산|납부|영수증/.test(text)) return 'SETTLEMENT'
  if (/출석|참석|불참/.test(text)) return 'ATTENDANCE'
  if (/메모|운영\s*노트/.test(text)) return 'NOTE'
  return 'SCHEDULE'
}

// 이동을 원하는 질문인지 ('관련 페이지로 이동하고 싶어', '바로가기 버튼 줘' 등)
export const wantsMove = (text: string) => /이동|바로\s*가기|페이지|링크|버튼|열어/.test(text)

export function guessNavigation(
  question: string,
  answer: string,
  schedules: ScheduleLink[],
  // 바로 앞 답변에서 찾은 일정 (이번 답변에 이름이 없을 때 '거기로 이동' 처리용)
  previous?: ScheduleLink,
): { navigation: ChatNavigationResponse; schedule?: ScheduleLink } | null {
  const text = `${question} ${answer}`
  const schedule = findSchedule(answer, schedules) ?? findSchedule(question, schedules) ?? (wantsMove(question) ? previous : undefined)

  if (schedule) return { navigation: { type: pickType(text), targetId: schedule.id }, schedule }
  if (/장부|잔액|수입|지출/.test(text)) return { navigation: { type: 'BUDGET' } }
  if (/문서함|자료|파일/.test(text)) return { navigation: { type: 'FILE' } }
  return null
}
