import styled from 'styled-components'
import Button from '../../components/Button'

// 피그마 결과 카드: padding 12 14, gap 10, radius 16, 흰색 → #F3FAF7 그라데이션
export const Card = styled.section`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px 14px;
  border: 1px solid #ffffff;
  border-radius: 16px;
  background: linear-gradient(127deg, #ffffff 10.71%, #f3faf7 82.14%);
  box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.8) inset, 0 6px 18px 0 rgba(63, 141, 124, 0.09);
`

export const Summary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding-bottom: 10px;
  border-bottom: 1px solid #e9eceb;
`

export const SummaryText = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 0 0;
  flex-direction: column;
  gap: 4px;
`

export const Label = styled.p`
  font-size: 13px;
  line-height: 140%;
  font-weight: 600;
  color: #424242;
`

export const SubLabel = styled.p`
  margin-top: -4px;
  font-size: 11px;
  line-height: 140%;
  color: #7f7e7e;
`

// 피그마: 22 / 700 / #253F3B, line-height 32
export const Amount = styled.p`
  font-size: 22px;
  line-height: 32px;
  font-weight: 700;
  color: #253f3b;
`

export const CountBadge = styled.span`
  display: flex;
  height: 20px;
  flex-shrink: 0;
  align-items: center;
  align-self: flex-start;
  padding: 0 8px;
  border-radius: 999px;
  background: #fdecec;
  font-size: 10px;
  line-height: normal;
  font-weight: 700;
  color: #e45c55;
`

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Row = styled.li`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e9eceb;
  border-radius: 12px;
  background: #ffffff;
`

export const RowLink = styled.button`
  display: flex;
  width: 100%;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  border: 1px solid #e9eceb;
  border-radius: 12px;
  background: #ffffff;
  text-align: left;
  cursor: pointer;

  svg {
    flex-shrink: 0;
    color: #78918c;
  }
`

export const Info = styled.div`
  display: flex;
  min-width: 0;
  flex: 1 0 0;
  flex-direction: column;
  gap: 2px;

  strong {
    font-size: 13px;
    line-height: 140%;
    font-weight: 700;
    color: #253f3b;
  }
`

export const Meta = styled.span`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 10px;
  line-height: 140%;
  color: #78918c;
`

export const Total = styled.span`
  font-size: 11px;
  line-height: 140%;
  color: #253f3b;
`

const pill = `
  display: flex;
  height: 26px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 10px;
  border-radius: 10px;
  font-size: 10px;
  line-height: normal;
  font-weight: 500;
`

export const ConfirmButton = styled.button`
  ${pill}
  background: #438b7e;
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

export const Notice = styled.p`
  padding: 12px;
  border: 1px solid #e9eceb;
  border-radius: 12px;
  background: #ffffff;
  font-size: 13px;
  line-height: 160%;
  color: #253f3b;
  white-space: pre-wrap;
`

export const Empty = styled.p`
  font-size: 13px;
  line-height: 140%;
  color: #78918c;
`

// 피그마: height 48, radius 12, 14 / 700
export const ActionButton = styled(Button)`
  height: 48px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 140%;
`
