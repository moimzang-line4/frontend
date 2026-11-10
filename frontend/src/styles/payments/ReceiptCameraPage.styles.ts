import styled, { css } from 'styled-components'

export const Screen = styled.div`
  position: fixed;
  inset: 0;
  z-index: 50;
  display: flex;
  width: 100%;
  max-width: var(--container-app);
  margin: 0 auto;
  flex-direction: column;
  background: #000000;
  color: #ffffff;
`

export const Header = styled.header`
  position: relative;
  display: flex;
  height: 56px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding-top: env(safe-area-inset-top, 0px);
`

export const CloseButton = styled.button`
  position: absolute;
  left: 8px;
  display: flex;
  width: 44px;
  height: 44px;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  cursor: pointer;
`

export const Title = styled.h1`
  font-size: 18px;
  line-height: normal;
  font-weight: 700;
`

export const Viewfinder = styled.div`
  position: relative;
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: #1a1a1a;
`

export const Video = styled.video`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const CameraNotice = styled.p`
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 40px;
  text-align: center;
  white-space: pre-line;
  font-size: 14px;
  line-height: 22px;
  color: rgba(255, 255, 255, 0.8);
`

// 영수증을 맞추는 가이드 영역
export const Guide = styled.div`
  position: absolute;
  top: 50%;
  left: 50%;
  width: 72%;
  aspect-ratio: 3 / 4;
  max-height: 70%;
  transform: translate(-50%, -54%);
  border: 1px dashed rgba(255, 255, 255, 0.55);
  border-radius: 6px;
`

const corner = {
  'top-left': css`top: -2px; left: -2px; border-width: 3px 0 0 3px; border-top-left-radius: 8px;`,
  'top-right': css`top: -2px; right: -2px; border-width: 3px 3px 0 0; border-top-right-radius: 8px;`,
  'bottom-left': css`bottom: -2px; left: -2px; border-width: 0 0 3px 3px; border-bottom-left-radius: 8px;`,
  'bottom-right': css`bottom: -2px; right: -2px; border-width: 0 3px 3px 0; border-bottom-right-radius: 8px;`,
}

export const Corner = styled.span<{ $position: keyof typeof corner }>`
  position: absolute;
  width: 28px;
  height: 28px;
  border: 0 solid #ffffff;
  ${({ $position }) => corner[$position]}
`

export const Hint = styled.p`
  position: absolute;
  left: 50%;
  bottom: 24px;
  transform: translateX(-50%);
  padding: 6px 12px;
  border-radius: 999px;
  background: rgba(40, 40, 40, 0.75);
  white-space: nowrap;
  font-size: 11px;
  line-height: 16px;
  color: #ffffff;
`

export const BottomBar = styled.div`
  display: flex;
  height: calc(112px + env(safe-area-inset-bottom, 0px));
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding-bottom: env(safe-area-inset-bottom, 0px);
`

export const Shutter = styled.button`
  width: 66px;
  height: 66px;
  border: 5px solid #bdbdbd;
  border-radius: 50%;
  background: #ffffff;
  box-shadow: inset 0 0 0 2px #000000;
  cursor: pointer;
  transition: transform 0.1s;

  &:active:not(:disabled) {
    transform: scale(0.94);
  }

  &:disabled {
    opacity: 0.5;
  }
`
