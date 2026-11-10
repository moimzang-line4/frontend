import styled, { css } from 'styled-components'

const cardShadow = '0 1px 2px 0 rgba(255, 255, 255, 0.80) inset, 0 6px 18px 0 rgba(63, 141, 124, 0.09)'

// 카드가 왼쪽으로 밀릴 때 화면 가장자리에서 잘리도록 좌우 여백까지 감싸고 자름
export const Row = styled.div`
  position: relative;
  margin: -8px calc(var(--spacing-page-x) * -1);
  padding: 8px var(--spacing-page-x);
  overflow: hidden;
`

export const SwipeAction = styled.button<{ $variant: 'delete' | 'undo' }>`
  position: absolute;
  top: 8px;
  bottom: 8px;
  right: var(--spacing-page-x);
  display: flex;
  width: 88px;
  align-items: center;
  justify-content: center;
  border-radius: 16px;
  box-shadow: ${cardShadow};
  font-size: 14px;
  line-height: 140%;
  font-weight: 700;
  color: #ffffff;
  cursor: pointer;

  ${({ $variant }) => $variant === 'delete'
    ? css`border: 1px solid #e45c55; background: #e45c55;`
    : css`border: 1px solid #438b7e; background: #438b7e;`}
`

export const Card = styled.div<{ $dragging: boolean }>`
  position: relative;
  display: flex;
  height: 64px;
  align-items: center;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #ffffff;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: ${cardShadow};
  touch-action: pan-y;
  user-select: none;
  transition: ${({ $dragging }) => ($dragging ? 'none' : 'transform 0.22s cubic-bezier(0.16, 1, 0.3, 1)')};
`

export const Info = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 0 0;
  flex-direction: column;
  gap: 2px;
`

export const Name = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #0e0e0f;
`

export const Subtitle = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 12px;
  line-height: 20px;
  color: #7a7a7d;
`

const pill = css`
  display: flex;
  width: 100px;
  height: 30px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  border-radius: 12px;
  font-size: 12px;
  line-height: 18px;
  font-weight: 500;
`

export const AttendButton = styled.button`
  ${pill}
  background: linear-gradient(127deg, #5aa997 10.71%, #438b7e 82.14%);
  color: #ffffff;
  cursor: pointer;

  &:active {
    filter: brightness(0.95);
  }
`

export const DoneBadge = styled.span`
  ${pill}
  background: #e4f3ef;
  color: #367d70;
`
