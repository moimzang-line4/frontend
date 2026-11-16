import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { createChatRoom, sendMessage } from '../../api/generated'
import useOnboarding from '../onboarding/useOnboarding'
import { ASSISTANT_MAX_LENGTH, ASSISTANT_TEXT } from '../../constants/ai/assistant'
import type { AssistantMessage } from '../../types/ai/assistant'

const REQUEST_OPTIONS = { timeout: 30000 }

function getErrorMessage(caught: unknown) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const message = caught.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
    return caught.response ? ASSISTANT_TEXT.failed : ASSISTANT_TEXT.offline
  }
  return caught instanceof Error && caught.message ? caught.message : ASSISTANT_TEXT.failed
}

// AI 운영 비서 대화: 첫 질문 때 대화방을 만들고, 이후 같은 방에 이어서 질문
export default function useAssistant() {
  const { group } = useOnboarding()
  const termId = group?.termId
  const [messages, setMessages] = useState<AssistantMessage[]>([])
  const [pending, setPending] = useState(false)
  const chatRoomId = useRef<number | null>(null)
  const seq = useRef(0)

  const nextId = () => {
    seq.current += 1
    return `message-${seq.current}`
  }

  const pushError = (text: string) =>
    setMessages(prev => [...prev, { id: nextId(), role: 'assistant', text, error: true }])

  // 대화방이 없으면 새로 만들기
  const ensureRoom = async (id: number) => {
    if (chatRoomId.current) return chatRoomId.current
    const response = await createChatRoom(id, {}, REQUEST_OPTIONS)
    const roomId = response.data.data?.chatRoomId
    if (response.data.success !== true || typeof roomId !== 'number') {
      throw new Error(response.data.message || ASSISTANT_TEXT.failed)
    }
    chatRoomId.current = roomId
    return roomId
  }

  const send = async (value: string) => {
    const text = value.trim().slice(0, ASSISTANT_MAX_LENGTH)
    if (!text || pending) return
    setMessages(prev => [...prev, { id: nextId(), role: 'user', text }])

    if (typeof termId !== 'number' || termId <= 0) {
      pushError(ASSISTANT_TEXT.noTerm)
      return
    }

    setPending(true)
    try {
      const roomId = await ensureRoom(termId)
      const response = await sendMessage(roomId, { content: text }, REQUEST_OPTIONS)
      const body = response.data
      if (body.success !== true || !body.data) throw new Error(body.message || ASSISTANT_TEXT.failed)
      const data = body.data
      setMessages(prev => [...prev, {
        id: data.messageId ? `server-${data.messageId}` : nextId(),
        role: 'assistant',
        text: data.content ?? '',
        navigation: data.navigation ?? null,
        cardType: data.cardType ?? null,
        card: data.card ?? null,
      }])
    } catch (caught) {
      pushError(getErrorMessage(caught))
    } finally {
      setPending(false)
    }
  }

  return { messages, pending, send }
}
