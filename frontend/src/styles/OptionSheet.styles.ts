import styled from 'styled-components'

export const Options = styled.div`
  display: flex;
  max-height: 50dvh;
  flex-direction: column;
  gap: 4px;
  overflow-y: auto;
`

export const Option = styled.button<{ $active: boolean }>`
  display: flex;
  width: 100%;
  min-height: 52px;
  flex-shrink: 0;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  border-radius: 12px;
  background: ${({ $active }) => ($active ? '#e4f3ef' : '#ffffff')};
  text-align: left;
  font-size: 15px;
  line-height: 140%;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  color: ${({ $active }) => ($active ? '#367d70' : '#253f3b')};
  cursor: pointer;

  &:active {
    background: #e4f3ef;
  }
`
