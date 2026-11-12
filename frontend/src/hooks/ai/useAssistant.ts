import { useRef, useState } from 'react'
import { requestAssistant } from '../../api/ai'
import useSchedules from '../schedules/useSchedules'
import type { AssistantMessage } from '../../types/ai/assistant'

// AI 운영 비서 대화: 요청 보내기 + 답변 기다리는 중 상태
export default function useAssistant() {
  const { schedules } = useSchedules()
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [pending, setPending] = useState(false)
  const seq = useRef(0)

  const nextId = () => {
    seq.current += 1
    return `message-${seq.current}`
  }

  const send = async (value: string) => {
    const text = value.trim()
    if (!text || pending) return
    setMessages(prev => [...prev, { id: nextId(), role: 'user', text }])
    setPending(true)
    try {
      const reply = await requestAssistant(text, schedules)
      setMessages(prev => [...prev, { id: nextId(), role: 'assistant', reply }])
    } catch {
      setMessages(prev => [...prev, { id: nextId(), role: 'assistant', reply: { kind: 'text', text: '요청을 처리하지 못했어요. 잠시 후 다시 시도해 주세요.' } }])
    } finally {
      setPending(false)
    }
  }

  return { messages, pending, send, schedules }
}
