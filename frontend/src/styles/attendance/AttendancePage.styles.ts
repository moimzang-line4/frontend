import styled from 'styled-components'

// MainLayout 상단 여백(24px) → 피그마 19px에 맞춤
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  margin-top: -5px;
  padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px));
`

export const Filters = styled.div`
  display: flex;
  gap: 6px;
`

export const FilterChip = styled.button<{ $active: boolean }>`
  display: flex;
  height: 32px;
  align-items: center;
  justify-content: center;
  padding: 0 12px;
  border-radius: 999px;
  border: 1px solid ${({ $active }) => ($active ? '#367d70' : '#ddece7')};
  background: ${({ $active }) => ($active ? '#367d70' : '#ffffff')};
  font-size: 12px;
  line-height: 18px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  color: ${({ $active }) => ($active ? '#ffffff' : '#78918c')};
  cursor: pointer;
  transition: background 0.15s, color 0.15s, border-color 0.15s;
`

export const ListSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const MoreButton = styled.button`
  display: flex;
  width: 100%;
  height: 48px;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 0 13px;
  border: 1px solid #ddece7;
  border-radius: 12px;
  background: #ffffff;
  font-size: 13px;
  line-height: 20px;
  font-weight: 700;
  color: #367d70;
  cursor: pointer;

  &:active {
    background: #f7f8fa;
  }
`

export const Notice = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  font-size: 14px;
  line-height: 20px;
  color: var(--color-muted);

  a {
    font-weight: 700;
    color: #367d70;
  }
`

