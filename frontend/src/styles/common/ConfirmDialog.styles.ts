import styled, { keyframes } from 'styled-components'

const appear = keyframes`from { opacity: 0; transform: scale(0.97); } to { opacity: 1; transform: scale(1); }`
export const Dialog = styled.dialog`
  position: fixed;
  inset: 0;
  display: flex;
  width: calc(100% - 48px);
  max-width: 342px;
  max-height: calc(100dvh - 48px);
  margin: auto;
  padding: 22px 20px 20px;
  overflow-y: auto;
  flex-direction: column;
  gap: 8px;
  border: none;
  border-radius: 20px;
  background: white;
  color: #253f3b;
  box-shadow: 0 12px 32px rgb(0 0 0 / 12%);
  animation: ${appear} 160ms ease-out;
  &:not([open]) { display: none; }
  &::backdrop {
    background: rgb(18 31 51 / 34%);
    backdrop-filter: blur(2px);
    -webkit-backdrop-filter: blur(2px);
  }
  @media (prefers-reduced-motion: reduce) { animation-duration: 1ms; }
`
export const Title = styled.h2<{ $size: 18 | 20 }>`
  font-size: ${({ $size }) => $size}px;
  line-height: 26px;
  font-weight: 700;
  white-space: pre-line;
  overflow-wrap: anywhere;
`
export const Description = styled.div`
  color: #647269;
  font-size: 13px;
  line-height: 22px;
  white-space: pre-line;
  overflow-wrap: anywhere;
`
export const Spacer = styled.div`height: 4px; flex-shrink: 0;`
export const Actions = styled.div`
  display: flex;
  gap: 16px;
`
export const Action = styled.button<{ $tone: 'cancel' | 'danger' | 'primary' }>`
  display: flex;
  min-width: 0;
  min-height: 44px;
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: 8px;
  border-radius: 12px;
  background: ${({ $tone }) => $tone === 'cancel' ? '#f1f5f3' : $tone === 'danger' ? '#e45c55' : 'linear-gradient(127deg, #5aa997 10.71%, #438b7e 82.14%)'};
  color: ${({ $tone }) => $tone === 'cancel' ? '#253f3b' : 'white'};
  font-size: 14px;
  line-height: 26px;
  font-weight: 700;
  cursor: pointer;
  &:disabled { opacity: 0.6; cursor: wait; }
`
export const Error = styled.p`
  color: #b43b34;
  font-size: 12px;
  line-height: 1.5;
`
