import styled from 'styled-components'

export const Card = styled.section`
  position: relative;
  width: 100%;
  height: 139px;
  flex-shrink: 0;
  border-radius: 20px;
  box-shadow: 0 7px 18px 0 rgba(63, 141, 124, 0.1);
`

export const Background = styled.svg`
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
`

export const Heading = styled.div`
  position: absolute;
  top: 22px;
  left: 20px;
  display: flex;
  width: 178px;
  flex-direction: column;
  gap: 6px;
  color: #ffffff;
`

export const Title = styled.h2`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 20px;
  line-height: normal;
  font-weight: 700;
`

export const Status = styled.p`
  font-size: 12px;
  line-height: normal;
  font-weight: 500;
`

// 파인 영역(오른쪽 위) 가운데 배치
export const Stats = styled.div`
  position: absolute;
  top: 9px;
  right: 10px;
  display: flex;
  width: 82px;
  align-items: center;
  justify-content: space-between;
`

export const Stat = styled.div`
  display: flex;
  min-width: 23px;
  flex-direction: column;
  align-items: center;
  color: #253f3b;
  line-height: 140%;

  strong {
    font-size: 14px;
    font-weight: 700;
  }

  span {
    font-size: 12px;
    font-weight: 500;
  }
`

export const Progress = styled.div`
  position: absolute;
  left: 19px;
  right: 19px;
  top: 72px;
`

// left는 애니메이션 값으로 컴포넌트에서 지정
export const Bubble = styled.span`
  position: absolute;
  top: 0;
  display: flex;
  min-width: 33px;
  height: 18px;
  padding: 0 5px;
  align-items: center;
  justify-content: center;
  transform: translateX(-50%);
  border-radius: 6px;
  background: #ffffff;
  font-size: 11px;
  font-weight: 800;
  color: #367d70;
  font-variant-numeric: tabular-nums;

  &::after {
    content: '';
    position: absolute;
    bottom: -5px;
    left: 50%;
    transform: translateX(-50%);
    border: 3px solid transparent;
    border-top: 3px solid #ffffff;
  }
`

export const Track = styled.div`
  margin-top: 34px;
  width: 100%;
  height: 11px;
  overflow: hidden;
  border-radius: 999px;
  background: #6fa59b;
`

// 0%일 때도 피그마처럼 작은 점(12px)으로 표시
export const Fill = styled.div`
  min-width: 12px;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(180deg, #77bcb0 0%, #f2fbfa 100%);
`
