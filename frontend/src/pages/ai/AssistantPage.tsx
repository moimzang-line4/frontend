import { useEffect, useRef, useState } from 'react'
import MainLayout from '../../layouts/MainLayout'
import AssistantResultCard from '../../components/ai/AssistantResultCard'
import useAssistant from '../../hooks/ai/useAssistant'
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

// 피그마: AI 운영 비서 · 업무 요청 시작 / 미입금자 조회 결과
export default function AssistantPage() {
  const { messages, pending, send } = useAssistant()
  const [input, setInput] = useState('')
  const endRef = useRef<HTMLDivElement>(null)

  // 새 메시지가 오면 맨 아래로
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' })
  }, [messages.length, pending])

  const submit = (text: string) => {
    if (!text.trim() || pending) return
    setInput('')
    void send(text)
  }

  return (
    <MainLayout title={ASSISTANT_TEXT.title} showBack={false} headerAlign="left">
      <S.Container>
        <S.Question>{ASSISTANT_TEXT.question}</S.Question>

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
          <S.Messages aria-live="polite">
            {messages.map(message =>
              message.role === 'user' ? (
                <S.UserMessage key={message.id}>
                  <S.UserBubble>{message.text}</S.UserBubble>
                </S.UserMessage>
              ) : (
                <S.AssistantMessage key={message.id}>
                  <S.AssistantRow>
                    <S.Avatar aria-hidden="true">AI</S.Avatar>
                    <S.AssistantBubble role={message.error ? 'alert' : undefined}>{message.text}</S.AssistantBubble>
                  </S.AssistantRow>
                  <AssistantResultCard cardType={message.cardType} card={message.card} navigation={message.navigation} />
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
        <div ref={endRef} />
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
