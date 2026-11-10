import styled, { keyframes } from 'styled-components'

const enter = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`
const leave = keyframes`from { transform: translateY(0); } to { transform: translateY(100%); }`
const dim = keyframes`from { opacity: 0; } to { opacity: 1; }`

export const Sheet = styled.dialog<{ $closing: boolean }>`
  position: fixed;
  inset: auto 0 0;
  width: 100%;
  max-width: var(--container-app);
  max-height: 85dvh;
  margin: 0 auto;
  padding: 8px 20px calc(20px + env(safe-area-inset-bottom, 0px));
  overflow-y: auto;
  border: none;
  border-radius: 24px 24px 0 0;
  background: #f6f8fa;
  color: #253f3b;
  animation: ${({ $closing }) => ($closing ? leave : enter)} ${({ $closing }) => ($closing ? '180ms ease-in' : '260ms cubic-bezier(0.16, 1, 0.3, 1)')} both;

  &::backdrop {
    background: rgba(0, 0, 0, 0.4);
    animation: ${dim} 180ms ease-out;
  }

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1ms;
    &::backdrop { animation-duration: 1ms; }
  }
`

export const HandleRow = styled.div`
  display: flex;
  height: 10px;
  align-items: center;
  justify-content: center;
  margin-bottom: 8px;

  &::after {
    content: '';
    width: 36px;
    height: 4px;
    border-radius: 2px;
    background: #d7e0dd;
  }
`

export const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 6px;
`

export const Title = styled.h2`
  flex: 1 0 0;
  font-size: 18px;
  line-height: 26px;
  font-weight: 700;
  color: #253f3b;
`

export const CloseButton = styled.button`
  display: flex;
  width: 44px;
  height: 44px;
  margin-right: -12px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
`

export const Description = styled.div`
  font-size: 12px;
  line-height: 18px;
  color: #78918c;
`

export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 14px;
`
