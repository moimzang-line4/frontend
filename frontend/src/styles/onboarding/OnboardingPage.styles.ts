import styled, { keyframes } from 'styled-components'


const onboardingAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const slideAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(12px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
`

const logoAppear = keyframes`
  from {
    opacity: 0;
    transform: translateY(6px) scale(0.98);
    filter: blur(4px);
  }

  to {
    opacity: 1;
    transform: translateY(0) scale(1);
    filter: blur(0);
  }
`

export const Splash = styled.div<{
  $mint: boolean
  $leaving: boolean
}>`
  position: relative;

  display: grid;
  place-items: center;

  width: 100%;
  max-width: 390px;
  min-height: 100dvh;
  margin-inline: auto;

  overflow: hidden;
  isolation: isolate;
  background: #ffffff;

  &::before {
    content: '';

    position: absolute;
    inset: 0;
    z-index: -1;

    background: linear-gradient(
      135deg,
      #3f8275 0%,
      #72aa99 50%,
      #a7cfbb 100%
    );

    opacity: ${({ $mint }) => ($mint ? 1 : 0)};

    transition: opacity 800ms
      cubic-bezier(0.4, 0, 0.2, 1);
  }

  h1 {
    margin: 0;
    transform: translateY(-24px);

    color: ${({ $mint }) => ($mint ? '#ffffff' : '#3f8275')};
    font-size: 44px;
    font-weight: 800;
    line-height: 1.2;
    letter-spacing: 0.3px;

    transition: color 800ms
      cubic-bezier(0.4, 0, 0.2, 1);
  }

  span {
    display: block;

    animation: ${logoAppear} 700ms
      cubic-bezier(0.22, 1, 0.36, 1) both;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before,
    h1 {
      transition: none;
    }

    span {
      animation: none;
    }
  }
`



export const Wave = styled.img`
  position: absolute;
  bottom: 9px;
  left: calc(50% - 240px);
  z-index: -1;

  max-width: none;
`

export const Dots = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 9px;
`

export const Dot = styled.button<{ $active: boolean }>`
  position: relative;

  display: grid;
  place-items: center;

  width: 14px;
  height: 7px;

  cursor: pointer;

  &::before {
    content: '';

    width: ${({ $active }) => ($active ? '14px' : '7px')};
    height: 7px;
    border-radius: 4px;

    background: ${({ $active }) =>
      $active ? '#348b74' : '#d6e2dc'};

    transition:
      width 250ms ease,
      background-color 250ms ease;
  }

  &::after {
    content: '';

    position: absolute;
    inset: -14px -4px;
  }

  @media (prefers-reduced-motion: reduce) {
    &::before {
      transition: none;
    }
  }
`

export const Next = styled.button<{ $primary: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  min-height: 55px;

  border: 1px solid #ddece7;
  border-radius: 14px;

  background: ${({ $primary }) =>
    $primary
      ? 'linear-gradient(168deg, #5aa997 10.714%, #438b7e 82.143%)'
      : 'white'};

  color: ${({ $primary }) =>
    $primary ? 'white' : '#348b74'};

  font-size: 18px;
  font-weight: 700;

  box-shadow: 0 8px 15px rgb(31 107 87 / 12%);
  cursor: pointer;
`

export const Error = styled.p`
  margin-top: 8px;

  color: #b43b34;
  font-size: 13px;
  line-height: 20px;
`

export const Root = styled.div`
  --illustration-scale: 0.9;

  position: fixed;
  inset: 0;

  display: grid;
  grid-template-rows: 64px minmax(0, 1fr);

  width: 100%;
  max-width: 390px;
  height: 100dvh;
  min-height: 0;
  margin-inline: auto;

  box-sizing: border-box;
  overflow: hidden;

  background: linear-gradient(
    154deg,
    #7baea5 10.714%,
    #b5ddd0 82.143%
  );

  color: #19352e;

  @media (max-height: 740px) {
    --illustration-scale: 0.9;
    grid-template-rows: 52px minmax(0, 1fr);
  }

  @media (max-height: 660px) {
    --illustration-scale: 0.9;
  }
`

export const TopBar = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;

  min-height: 0;
  padding: 0 26px;

  button {
    min-height: 36px;
    color: #367d70;
    font-size: 13px;
    cursor: pointer;
  }
`

export const Panel = styled.main`
  position: relative;

  display: grid;
  grid-template-rows: minmax(0, 1fr) auto;
  gap: 12px;

  min-height: 0;
  padding: 24px 26px;
  padding-bottom: max(
    20px,
    env(safe-area-inset-bottom, 0px)
  );

  box-sizing: border-box;
  overflow: hidden;
  isolation: isolate;

  border-radius: 28px 28px 0 0;

  background: linear-gradient(
    115deg,
    #f8fefb 14.286%,
    white 85.714%
  );

  @media (max-height: 660px) {
    padding-top: 16px;
  }
`

export const Slide = styled.div`
  display: flex;
  flex-direction: column;

  min-height: 0;
  overflow: auto;
  overscroll-behavior: contain;

  animation: ${slideAppear} 500ms
    cubic-bezier(0.22, 1, 0.36, 1) both;

  @media (prefers-reduced-motion: reduce) {
    animation: none;
  }
`

export const Illustration = styled.div`
  position: relative;
  flex-shrink: 0;
  align-self: center;

  width: 300px;
  height: calc(270px * var(--illustration-scale));
  margin: auto 0;

  transform: scale(var(--illustration-scale));
  transform-origin: top center;
`

export const Controls = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;

  min-width: 0;
  margin: 0;
  padding: 8px 0 0;
`

export const Brand = styled.p`
  margin-left: 9px;

  color: #3f8275;
  font-size: 24px;
  font-weight: 800;
  line-height: 29px;
`

export const Title = styled.h1`
  flex-shrink: 0;
  margin: clamp(12px, 2.5svh, 22px) 0 0 9px;

  color: #19352e;
  font-size: clamp(22px, 6.92vw, 27px);
  font-weight: 700;
  line-height: 1.35;
  white-space: pre-line;
`

export const Description = styled.p`
  flex-shrink: 0;
  margin: clamp(12px, 2.5svh, 22px) 0 0 9px;

  color: #687d75;
  font-size: 15px;
  line-height: 25px;
  white-space: pre-line;
`

export const Halo = styled.img`
  position: absolute;
  left: 0;
  top: 5px;
`

export const Calendar = styled.div`
  position: absolute;
  left: 33px;
  top: 0;

  width: 236px;
  height: 235px;
  border-radius: 25px;

  background: linear-gradient(
    131deg,
    white 14.286%,
    #c8eadb 85.714%
  );

  box-shadow: 0 14px 28px rgb(31 107 87 / 20%);

  &::before {
    content: '';

    position: absolute;
    inset: 0 0 auto;

    height: 59px;
    border-radius: 22px;

    background: linear-gradient(
      164deg,
      #77cbb0 14.286%,
      #238e70 85.714%
    );
  }
`

export const Days = styled.div`
  position: absolute;
  left: 21px;
  top: 82px;

  display: grid;
  grid-template-columns: repeat(4, 29px);
  gap: 14px 23px;

  span {
    width: 29px;
    height: 24px;

    border-radius: 6px;
    background: #f5fbf8;
  }

  span:nth-child(11) {
    background: #368e76;
  }
`

export const CalendarBadge = styled.div`
  position: absolute;
  left: 148px;
  top: 189px;

  display: grid;
  place-items: center;

  width: 128px;
  height: 53px;
  border-radius: 20px;

  background: linear-gradient(
    154deg,
    white 14.286%,
    #e9f8f0 85.714%
  );

  box-shadow: 0 10px 20px rgb(31 107 87 / 17%);

  color: #3b927b;
  font-size: 15px;
  font-weight: 700;
`

export const Attendance = styled.div`
  position: absolute;
  left: 18px;
  top: 27px;

  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const AttendanceCard = styled.div`
  display: flex;
  align-items: center;
  gap: 15px;

  width: 265px;
  height: 66px;
  padding: 16px 24px 16px 19px;

  border-radius: 20px;

  background: linear-gradient(
    164deg,
    white 14.286%,
    #e9f8f0 85.714%
  );

  box-shadow: 0 10px 20px rgb(31 107 87 / 17%);

  > span:first-child {
    width: 35px;
    height: 35px;

    border-radius: 18px;

    background: linear-gradient(
      131deg,
      #c9ebdd 14.286%,
      #78c8aa 85.714%
    );
  }

  > span:nth-child(2) {
    width: 91px;
    height: 10px;

    border-radius: 5px;
    background: #b4d8cc;
  }

  > strong {
    display: grid;
    place-items: center;

    width: 34px;
    height: 31px;
    margin-left: auto;

    border-radius: 16px;

    background: linear-gradient(
      134deg,
      #72c9a9 14.286%,
      #168f6b 85.714%
    );

    color: white;
    font-size: 19px;

    box-shadow: 0 3px 9px rgb(31 107 87 / 15%);
  }
`

export const Receipt = styled.div`
  position: absolute;
  left: 65px;
  top: 3px;

  display: flex;
  flex-direction: column;
  gap: 20px;

  width: 172px;
  height: 216px;
  padding: 46px 21px;

  border-radius: 22px;

  background: linear-gradient(
    125deg,
    white 14.286%,
    #c8eadb 85.714%
  );

  box-shadow: 0 14px 28px rgb(31 107 87 / 20%);

  span {
    width: 113px;
    min-height: 9px;

    border-radius: 5px;
    background: #a6d5c4;
  }

  span:nth-child(even) {
    width: 83px;
  }
`

export const ReceiptBadge = styled(CalendarBadge)`
  left: 59px;
  top: 180px;

  width: 190px;
  height: 58px;
  border-radius: 26px;

  color: #398e76;
  font-size: 19px;
`