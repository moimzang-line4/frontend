import styled, { keyframes } from 'styled-components'

const enter = keyframes`
  from { opacity: 0; transform: translate(-50%, 12px); }
  to { opacity: 1; transform: translate(-50%, 0); }
`

const countdown = keyframes`
  from { transform: scaleX(1); }
  to { transform: scaleX(0); }
`

export const Progress = styled.div<{ $duration: number }>`
  position: absolute;
  inset-inline: 14px;
  bottom: 7px;
  height: 2px;
  border-radius: 999px;
  background: white;
  transform-origin: left;
  animation: ${countdown} ${({ $duration }) => $duration}ms linear forwards;
`

export const Toast = styled.div<{ $aboveFooter: boolean }>`
  position: fixed;
  left: 50%;
  bottom: calc(
    ${({ $aboveFooter }) => ($aboveFooter ? '109px' : '26px')} +
      env(safe-area-inset-bottom, 0px)
  );
  z-index: 40;
  display: flex;
  width: calc(min(100%, var(--container-app)) - var(--spacing-page-x) * 2);
  height: ${({ $aboveFooter }) => ($aboveFooter ? '78px' : '72px')};
  align-items: center;
  padding: 0 12px 0 14px;
  transform: translateX(-50%);
  border-radius: 14px;
  background: linear-gradient(
    ${({ $aboveFooter }) => ($aboveFooter ? '163.45deg' : '127deg')},
    #438b7e 10.71%,
    #96cebc 82.14%
  );
  box-shadow: 0 7px 18px 0 rgba(63, 141, 124, 0.18);
  animation: ${enter} 0.24s cubic-bezier(0.16, 1, 0.3, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1ms;
  }
`

export const Text = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 0 0;
  flex-direction: column;

  strong {
    font-size: 13px;
    line-height: 20px;
    font-weight: 700;
    color: #ffffff;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 11px;
    line-height: 18px;
    color: #d5e8df;
  }
`

export const ConfirmButton = styled.button<{ $wide?: boolean }>`
  display: flex;
  width: ${({ $wide }) => ($wide ? '62px' : '50px')};
  height: 44px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  line-height: 18px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;
  &:disabled {
    opacity: 0.6;
    cursor: wait;
  }
`
