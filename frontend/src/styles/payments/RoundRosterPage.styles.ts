import styled from 'styled-components'

// 피그마: 요소 간격 13px, MainLayout 상단 여백(24px) → 16px
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 13px;
  width: 100%;
  margin-top: -8px;
  padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px));
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 1px;
`

export const Identity = styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 10px;
  line-height: 16px;
  color: #7a7a7d;
`

export const Amount = styled.span`
  display: block;
  font-size: 12px;
  line-height: 18px;
  color: #253f3b;
`

export const EditButton = styled.button`
  display: flex;
  height: var(--spacing-touch-target, 44px);
  align-items: center;
  padding: 0 8px;
  font-size: 13px;
  line-height: 20px;
  font-weight: 700;
  color: #367d70;
  cursor: pointer;
`
