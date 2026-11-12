import styled from 'styled-components'

// MainLayout 상단 여백(24px) → 피그마 19px에 맞춤 (출석 화면과 동일)
export const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  width: 100%;
  margin-top: -5px;
  padding-bottom: calc(28px + env(safe-area-inset-bottom, 0px));
`

// 피그마: (탭 + 빈 화면) ↔ 버튼 영역 64px
export const Body = styled.div`
  display: flex;
  flex-direction: column;
  gap: 64px;
`

// 피그마: 탭 ↔ 빈 화면 70px
export const TabSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 70px;
`

// 피그마: 영수증 목록 — 탭·카드 간격 14px, 목록 ↔ 추가 버튼 18px
export const ListBody = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const List = styled.section`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const Actions = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
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
