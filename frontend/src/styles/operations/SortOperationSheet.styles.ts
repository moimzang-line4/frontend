import styled from 'styled-components'

export const Options = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
export const Option = styled.button<{ $active: boolean }>`
  display: flex;
  width: 100%;
  min-height: 63px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 8px 14px;
  border-radius: 12px;
  background: ${({ $active }) => $active ? '#e6f4f0' : 'transparent'};
  text-align: left;
  cursor: pointer;
  span { display: flex; flex-direction: column; gap: 2px; }
  strong { color: ${({ $active }) => $active ? '#367d70' : '#253f3b'}; font-size: 16px; line-height: 24px; font-weight: 500; }
  small { color: #78918c; font-size: 12px; line-height: 18px; }
  img { flex-shrink: 0; }
`
