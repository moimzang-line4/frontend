// AI 운영 비서 답변 종류
export type AssistantReply =
  | { kind: 'unpaid'; text: string; scheduleId: string; scheduleTitle: string }
  | { kind: 'notice'; text: string; scheduleId: string; scheduleTitle: string }
  | { kind: 'schedules'; text: string; scheduleIds: string[] }
  | { kind: 'text'; text: string }

export type AssistantMessage =
  | { id: string; role: 'user'; text: string }
  | { id: string; role: 'assistant'; reply: AssistantReply }
