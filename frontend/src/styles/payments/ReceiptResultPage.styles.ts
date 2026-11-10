import styled from 'styled-components'

// 인식 결과: MainLayout 상단 여백(24px) → 피그마 12px / 직접 등록: 헤더에서 조금 더 띄움
export const Container = styled.div<{ $manual?: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
  margin-top: ${({ $manual }) => ($manual ? '0' : '-12px')};
  padding-bottom: calc(20px + env(safe-area-inset-bottom, 0px));
`

export const Summary = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  width: 100%;
`

export const Thumbnail = styled.img`
  width: 98px;
  height: 133px;
  object-fit: cover;
  background: #d9d9d9;
`

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  text-align: center;
`

export const Title = styled.h2`
  font-size: 18px;
  line-height: 140%;
  font-weight: 700;
  color: #253f3b;
`

export const Description = styled.p`
  font-size: 14px;
  line-height: 140%;
  font-weight: 700;
  color: #78918c;
`

export const Actions = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  gap: 12px;
`

export const Missing = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 16px;
  padding-top: 80px;
  text-align: center;
  font-size: 14px;
  line-height: 20px;
  color: #78918c;
`
