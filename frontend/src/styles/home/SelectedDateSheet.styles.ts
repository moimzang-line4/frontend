import styled, { keyframes } from 'styled-components'
import Button from '../../components/Button'

const slideUp = keyframes`from { transform: translateY(100%); } to { transform: translateY(0); }`
const slideDown = keyframes`from { transform: translateY(0); } to { transform: translateY(100%); }`

export const Sheet = styled.dialog<{ $closing: boolean }>`
  position: fixed;
  inset: auto 0 0;
  width: 100%;
  max-width: var(--container-app);
  max-height: 80dvh;
  margin: 0 auto;
  padding: 0;
  overflow-y: auto;
  border: none;
  border-radius: 21px 21px 0 0;
  background: #f6f8fa;
  color: var(--color-ink);
  animation: ${({ $closing }) => $closing ? slideDown : slideUp}
    ${({ $closing }) => $closing ? '180ms ease-in' : '240ms cubic-bezier(0.16, 1, 0.3, 1)'} both;
  &::backdrop { background: rgb(18 31 51 / 34%); }
  @media (prefers-reduced-motion: reduce) { animation-duration: 1ms; }
`
export const Header = styled.header`
  position: relative;
  display: flex;
  height: 56px;
  align-items: center;
  justify-content: center;
  padding-inline: 54px;
  border-bottom: 1px solid var(--color-divider);
`
export const DateTitle = styled.h2`
  font-size: 18px;
  line-height: 26px;
  font-weight: 700;
  text-align: center;
`
export const IconButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-control);
  cursor: pointer;
`
export const Content = styled.div`
  padding: 18px 20px calc(20px + env(safe-area-inset-bottom, 0px));
`
export const HeadingRow = styled.div`
  display: flex;
  min-height: 33px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 7px;
`
export const Heading = styled.h3`
  color: #19251f;
  font-size: 18px;
  line-height: 1.4;
  font-weight: 700;
`
export const AddButton = styled.button`
  color: var(--color-primary-strong);
  font-size: 12px;
  line-height: 1.4;
  font-weight: 700;
  white-space: nowrap;
  cursor: pointer;
`
export const List = styled.div`
  max-height: max(70px, calc(80dvh - 205px));
  overflow-y: auto;
`
export const EventButton = styled.button`
  display: flex;
  width: 100%;
  min-height: 83px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid #e9eceb;
  text-align: left;
  cursor: pointer;
  > img { flex-shrink: 0; }
`
export const EventInfo = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  gap: 3px;
`
export const Category = styled.p`
  color: #65736c;
  font-size: 11px;
  line-height: 1.4;
  font-weight: 500;
`
export const EventTitle = styled.p`
  color: #17231c;
  font-size: 16px;
  line-height: 1.4;
  font-weight: 700;
  overflow-wrap: anywhere;
`
export const Summary = styled.p`
  color: #69766f;
  font-size: 12px;
  line-height: 1.4;
`
export const Empty = styled.p`
  display: flex;
  min-height: 83px;
  align-items: center;
  color: var(--color-muted);
  font-size: 14px;
`
export const CloseButton = styled(Button)`
  margin-top: 16px;
`
