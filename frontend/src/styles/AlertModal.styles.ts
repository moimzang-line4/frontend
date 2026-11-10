import styled, { keyframes } from 'styled-components'

const popIn = keyframes`from { opacity: 0; transform: scale(0.96); } to { opacity: 1; transform: scale(1); }`

// 명단 삭제 모달(피그마)과 같은 크기·톤
export const Overlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  /* 뒤 화면 색은 그대로 두고 클릭만 막음 */
  background: transparent;
`

export const Modal = styled.div`
  display: flex;
  width: 100%;
  max-width: 342px;
  flex-direction: column;
  padding: 22px 20px 20px;
  border-radius: 20px;
  background: #ffffff;
  /* 배경을 어둡게 하지 않으므로 그림자로 구분 */
  box-shadow: 0 12px 32px rgba(0, 0, 0, 0.14), 0 2px 6px rgba(0, 0, 0, 0.06);
  animation: ${popIn} 0.18s cubic-bezier(0.16, 1, 0.3, 1);

  @media (prefers-reduced-motion: reduce) {
    animation-duration: 1ms;
  }
`

export const Title = styled.h3`
  font-size: 18px;
  line-height: 26px;
  font-weight: 700;
  color: #253f3b;
  white-space: pre-line;
`

export const Description = styled.p`
  margin-top: 8px;
  white-space: pre-line;
  font-size: 13px;
  line-height: 22px;
  color: #647269;
`

export const ConfirmButton = styled.button`
  display: flex;
  height: 44px;
  margin-top: 20px;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  background: linear-gradient(127deg, #5aa997 10.71%, #438b7e 82.14%);
  font-size: 14px;
  line-height: 26px;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;

  &:active {
    filter: brightness(0.95);
  }
`
