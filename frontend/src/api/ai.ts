import { ASSISTANT_DELAY_MS, ASSISTANT_TEXT } from '../constants/ai/assistant'
import type { AssistantReply } from '../types/ai/assistant'
import type { Schedule } from '../types/schedules/schedule'

const compact = (value: string) => value.replace(/\s/g, '').replace('신입생', '신입')

// 두 글자씩 잘라 요청문에 몇 개나 들어 있는지로 일정 찾기 ('가을 공연' → 가을 정기공연)
function findSchedule(text: string, schedules: Schedule[]) {
  const target = compact(text)
  let best: { schedule: Schedule; score: number } | null = null
  for (const schedule of schedules) {
    const title = compact(schedule.title)
    let score = target.includes(title) ? 100 : 0
    for (let i = 0; i < title.length - 1; i += 1) {
      if (target.includes(title.slice(i, i + 2))) score += 1
    }
    if (score > 0 && (!best || score > best.score)) best = { schedule, score }
  }
  return best?.schedule
}

const isPerformance = (schedule: Schedule) => schedule.category === 'performance' || schedule.category === 'newcomer'

// TODO: 서버 AI API가 생기면 이 함수 안에서 요청만 보내도록 바꾸기 (화면은 그대로 사용)
export async function requestAssistant(text: string, schedules: Schedule[]): Promise<AssistantReply> {
  await new Promise(resolve => setTimeout(resolve, ASSISTANT_DELAY_MS))
  const request = compact(text)

  if (request.includes('미입금') || request.includes('입금안')) {
    const schedule = findSchedule(text, schedules)
    if (!schedule) return { kind: 'text', text: ASSISTANT_TEXT.noSchedule }
    return { kind: 'unpaid', text: `${schedule.title} 미입금자를 확인했어요.`, scheduleId: schedule.id, scheduleTitle: schedule.title }
  }

  if (request.includes('공지')) {
    const schedule = findSchedule(text, schedules)
    if (!schedule) return { kind: 'text', text: ASSISTANT_TEXT.noSchedule }
    return { kind: 'notice', text: `${schedule.title} 정산 공지를 작성했어요.`, scheduleId: schedule.id, scheduleTitle: schedule.title }
  }

  if (request.includes('일정')) {
    const items = schedules.filter(isPerformance).sort((a, b) => a.date.localeCompare(b.date))
    if (items.length === 0) return { kind: 'text', text: ASSISTANT_TEXT.noSchedules }
    return { kind: 'schedules', text: `등록된 공연 일정 ${items.length}개를 찾았어요.`, scheduleIds: items.map(item => item.id) }
  }

  return { kind: 'text', text: ASSISTANT_TEXT.fallback }
}
