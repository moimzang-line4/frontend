import styled from 'styled-components'

// 명단이 없으면 안내 ↔ 버튼 간격을 넓게 (피그마)
export const Container = styled.div<{ $empty?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ $empty }) => ($empty ? '44px' : '18px')};
`;

// 빈 화면 안내: 헤더 아래로 조금 띄움
export const Empty = styled.div`
  padding-top: 48px;
`

export const GroupList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const CreateButton = styled.button`
  width: 100%;
  height: 48px;
  margin-top: 18px;

  border: none;
  border-radius: 10px;

  background: linear-gradient(90deg, #5ab09e, #408f80);

  color: #ffffff;
  font-size: 14px;
  font-weight: 600;

  cursor: pointer;
`