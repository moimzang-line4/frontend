import styled from 'styled-components'

export const Card = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 12px 14px;
  border: 1px solid #ffffff;
  border-radius: 16px;
  background: linear-gradient(127deg, #ffffff 10.71%, #f3faf7 82.14%);
  box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.8) inset, 0 6px 18px 0 rgba(63, 141, 124, 0.09);
  text-align: left;
  cursor: pointer;

  &:active {
    filter: brightness(0.98);
  }
`

export const Info = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
`

export const Badge = styled.span<{ $color: string; $background: string }>`
  display: inline-flex;
  height: 15px;
  align-items: center;
  justify-content: center;
  padding: 0 6px;
  border-radius: 11.5px;
  background: ${({ $background }) => $background};
  font-size: 10px;
  line-height: 140%;
  font-weight: 700;
  color: ${({ $color }) => $color};
`

export const Texts = styled.div`
  display: flex;
  min-width: 0;
  flex-direction: column;
`

export const Title = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 18px;
  line-height: 140%;
  font-weight: 400;
  color: #253f3b;

  strong {
    font-weight: 700;
  }
`

export const Amount = styled.p`
  font-size: 16px;
  line-height: 140%;
  font-weight: 500;
  color: #78918c;
`

// 피그마 8px → 가독성을 위해 10px
export const RegisteredAt = styled.p`
  margin-top: 4px;
  font-size: 10px;
  line-height: 140%;
  font-weight: 500;
  color: #a5a5a5;
`

export const Chevron = styled.svg`
  flex-shrink: 0;
  color: #253f3b;
`
