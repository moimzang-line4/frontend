import styled from 'styled-components'

const cardShadow = '0 7px 18px 0 rgba(63, 141, 124, 0.09)'

// 하단 입력창(46) + 여백만큼 내용이 가려지지 않게
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  width: 100%;
  margin-top: -8px;
  padding-bottom: 72px;
`

// 피그마: 17px / 700 / #19251F
export const Question = styled.h2`
  font-size: 17px;
  line-height: 140%;
  font-weight: 700;
  color: #19251f;
`

// 질문 + 부제 (둘 사이는 붙여서)
export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const Description = styled.p`
  font-size: 13px;
  line-height: 140%;
  font-weight: 400;
  color: #7a7a7d;
`

export const Suggestions = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 7px;
`

// 피그마 Frame 7: padding 10, radius 14, border #E3E5E3
export const Suggestion = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 10px;
  border: 1px solid #e3e5e3;
  border-radius: 14px;
  background: #ffffff;
  text-align: left;
  font-size: 13px;
  line-height: normal;
  font-weight: 500;
  color: #212624;
  cursor: pointer;

  svg {
    flex-shrink: 0;
    color: #212624;
  }

  &:active {
    background: #f6f8f7;
  }
`

export const Messages = styled.ol`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const UserMessage = styled.li`
  display: flex;
  justify-content: flex-end;
`

// 피그마 Frame 106: height 40, radius 999, border #E9ECEB, 14 / 600 / #458D80
export const UserBubble = styled.p`
  display: flex;
  max-width: 80%;
  min-height: 40px;
  align-items: center;
  padding: 9px 18px;
  border: 1px solid #e9eceb;
  border-radius: 999px;
  background: #ffffff;
  font-size: 14px;
  line-height: 140%;
  font-weight: 600;
  color: #458d80;
  word-break: keep-all;
`

export const AssistantMessage = styled.li`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const AssistantRow = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

// 피그마: AI 11 / 700 / 흰색
export const Avatar = styled.span`
  display: flex;
  width: 24px;
  height: 24px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  align-self: flex-start;
  margin-top: 8px;
  border-radius: 50%;
  background: #367d70;
  font-size: 11px;
  line-height: normal;
  font-weight: 700;
  color: #ffffff;
`

// 피그마: padding 10 12, radius 18, border #E3E5E3, 14 / 500 / #253F3B
export const AssistantBubble = styled.p`
  flex: 1 0 0;
  min-width: 0;
  padding: 10px 12px;
  border: 1px solid #e3e5e3;
  border-radius: 18px;
  background: #ffffff;
  font-size: 14px;
  line-height: 140%;
  font-weight: 500;
  color: #253f3b;
  white-space: pre-wrap;
`

// 말풍선 안 이동 버튼 (결과 카드가 없을 때)
export const BubbleAction = styled.div`
  margin-top: 12px;
  white-space: normal;

  > button {
    width: 100%;
  }
`

export const Typing = styled.span`
  display: inline-flex;
  gap: 4px;

  i {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: #a5b3af;
    animation: assistant-typing 1s infinite ease-in-out;
  }

  i:nth-child(2) { animation-delay: 0.15s; }
  i:nth-child(3) { animation-delay: 0.3s; }

  @keyframes assistant-typing {
    0%, 80%, 100% { opacity: 0.3; transform: translateY(0); }
    40% { opacity: 1; transform: translateY(-2px); }
  }
`

// 피그마: 입력 필드 영역 — 하단 탭바 위, 좌우 20
export const Composer = styled.form`
  position: fixed;
  left: 50%;
  bottom: calc(var(--spacing-footer) + 37px + env(safe-area-inset-bottom, 0px));
  z-index: 20;
  display: flex;
  width: 100%;
  max-width: var(--container-app);
  align-items: center;
  gap: 8px;
  padding-inline: var(--spacing-page-x);
  transform: translateX(-50%);
`

// 피그마 입력 필드: height 46, padding 14 16, radius 23, border #E3E5E3
export const Input = styled.input`
  min-width: 0;
  flex: 1 0 0;
  height: 46px;
  padding: 0 16px;
  border: 1px solid #e3e5e3;
  border-radius: 23px;
  outline: none;
  background: #ffffff;
  box-shadow: ${cardShadow};
  font-size: 13px;
  line-height: normal;
  color: #253f3b;

  &::placeholder {
    color: #6e7a75;
  }

  &:focus-visible {
    border-color: #5aa997;
  }
`

export const SendButton = styled.button`
  display: flex;
  width: 40px;
  height: 40px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border: 1px solid #e3e5e3;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: ${cardShadow};
  color: #647269;
  cursor: pointer;

  &:disabled {
    cursor: default;
    opacity: 0.6;
  }
`
