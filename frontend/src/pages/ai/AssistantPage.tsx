import { useEffect, useMemo, useRef, useState } from 'react'
import MainLayout from '../../layouts/MainLayout'
import AssistantResultCard, { AssistantActionButton, hasResultCard, summarizeCard } from '../../components/ai/AssistantResultCard'
import AssistantText from '../../components/ai/AssistantText'
import useAssistant from '../../hooks/ai/useAssistant'
import useScheduleLinks from '../../hooks/ai/useScheduleLinks'
import type { ScheduleLink } from '../../hooks/ai/useScheduleLinks'
import { guessNavigation } from '../../utils/ai/guessNavigation'
import type { ChatNavigationResponse } from '../../api/models/chatNavigationResponse'
import { ASSISTANT_MAX_LENGTH, ASSISTANT_SUGGESTIONS, ASSISTANT_TEXT } from '../../constants/ai/assistant'
import * as S from '../../styles/ai/AssistantPage.styles'

const ArrowIcon = (
  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
    <path d="M4 10L10 4M5 4h5v5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

const SendIcon = (
  <svg width="22" height="22" viewBox="0 0 22 22" fill="none" aria-hidden="true">
    <path d="M11 17.4V4.6M5.9 9.7L11 4.6l5.1 5.1" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
)

// 자동 스크롤 시 상단 헤더 높이 + 여백
const HEADER_OFFSET = 110

// 피그마: AI 운영 비서 · 업무 요청 시작 / 미입금자 조회 결과
export default function AssistantPage() {
  const { messages, pending, send } = useAssistant()
  const [input, setInput] = useState('')
  const messagesRef = useRef<HTMLOListElement>(null)
  const schedules = useScheduleLinks()

  // 서버가 navigation을 안 주면 질문·답변에 나온 일정으로 이동 버튼을 임시로 붙임
  const navigations = useMemo(() => {
    const result: Record<string, ChatNavigationResponse | null> = {}
    let question = ''
    let previous: ScheduleLink | undefined
    for (const message of messages) {
      if (message.role === 'user') {
        question = message.text
        continue
      }
      if (message.error) continue
      if (message.navigation?.type) {
        result[message.id] = message.navigation
        previous = schedules.find(schedule => schedule.id === message.navigation?.targetId) ?? previous
        continue
      }
      const guess = guessNavigation(question, message.text, schedules, previous)
      result[message.id] = guess?.navigation ?? null
      if (guess?.schedule) previous = guess.schedule
    }
    return result
  }, [messages, schedules])

  // 질문을 보내거나 답변이 오면 방금 보낸 질문이 화면 위쪽에 오도록 자동 스크롤
  // (폰 키보드가 열려 있어도 질문과 답변 시작 부분이 보이게 위쪽 기준으로 맞춤)
  useEffect(() => {
    const questions = messagesRef.current?.querySelectorAll<HTMLElement>('[data-role="user"]')
    const last = questions?.[questions.length - 1]
    if (!last) return
    const frame = requestAnimationFrame(() => {
      // 상단 헤더에 가리지 않게 여백을 둠
      const top = last.getBoundingClientRect().top + window.scrollY - HEADER_OFFSET
      window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
    })
    return () => cancelAnimationFrame(frame)
  }, [messages.length, pending])

  const submit = (text: string) => {
    if (!text.trim() || pending) return
    setInput('')
    void send(text)
  }

  return (
    <MainLayout title={ASSISTANT_TEXT.title} showBack={false} headerAlign="left">
      <S.Container>
        <S.Heading>
          <S.Question>{ASSISTANT_TEXT.question}</S.Question>
          <S.Description>{ASSISTANT_TEXT.description}</S.Description>
        </S.Heading>

        {messages.length === 0 ? (
          <S.Suggestions aria-label="추천 요청">
            {ASSISTANT_SUGGESTIONS.map(suggestion => (
              <li key={suggestion}>
                <S.Suggestion type="button" onClick={() => submit(suggestion)}>
                  {suggestion}
                  {ArrowIcon}
                </S.Suggestion>
              </li>
            ))}
          </S.Suggestions>
        ) : (
          <S.Messages ref={messagesRef} aria-live="polite">
            {messages.map(message =>
              message.role === 'user' ? (
                <S.UserMessage key={message.id} data-role="user">
                  <S.UserBubble>{message.text}</S.UserBubble>
                </S.UserMessage>
              ) : (
                <S.AssistantMessage key={message.id}>
                  <S.AssistantRow>
                    <S.Avatar aria-hidden="true">AI</S.Avatar>
                    <S.AssistantBubble as="div" role={message.error ? 'alert' : undefined}>
                      {/* 피그마: 결과 카드가 있으면 말풍선은 한 줄 요약 */}
                      <AssistantText text={hasResultCard(message.card) ? summarizeCard(message.cardType, message.card, message.text) : message.text} />
                      {/* 결과 카드가 없으면 이동 버튼을 답변 박스 안에 */}
                      {!hasResultCard(message.card) && navigations[message.id] && (
                        <S.BubbleAction>
                          <AssistantActionButton navigation={navigations[message.id]} />
                        </S.BubbleAction>
                      )}
                    </S.AssistantBubble>
                  </S.AssistantRow>
                  <AssistantResultCard cardType={message.cardType} card={message.card} navigation={navigations[message.id] ?? null} />
                </S.AssistantMessage>
              ),
            )}
            {pending && (
              <S.AssistantMessage>
                <S.AssistantRow>
                  <S.Avatar aria-hidden="true">AI</S.Avatar>
                  <S.AssistantBubble aria-label="답변 작성 중">
                    <S.Typing><i /><i /><i /></S.Typing>
                  </S.AssistantBubble>
                </S.AssistantRow>
              </S.AssistantMessage>
            )}
          </S.Messages>
        )}
      </S.Container>

      <S.Composer
        onSubmit={event => {
          event.preventDefault()
          submit(input)
        }}
      >
        <S.Input
          value={input}
          onChange={event => setInput(event.target.value)}
          placeholder={ASSISTANT_TEXT.placeholder}
          aria-label={ASSISTANT_TEXT.placeholder}
          enterKeyHint="send"
          maxLength={ASSISTANT_MAX_LENGTH}
        />
        <S.SendButton type="submit" aria-label="요청 보내기" disabled={!input.trim() || pending}>
          {SendIcon}
        </S.SendButton>
      </S.Composer>
    </MainLayout>
  )
}
