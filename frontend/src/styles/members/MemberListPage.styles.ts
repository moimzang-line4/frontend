import styled from 'styled-components'

// 명단이 없으면 안내 + 버튼을 한 덩어리로 화면 세로 가운데에
// (헤더·하단 탭바·여백을 뺀 높이 기준)
export const Container = styled.div<{ $empty?: boolean }>`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: ${({ $empty }) => ($empty ? '24px' : '18px')};
  ${({ $empty }) =>
    $empty &&
    `
    justify-content: center;
    min-height: calc(100dvh - 240px);
  `}
`;

export const Empty = styled.div``

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