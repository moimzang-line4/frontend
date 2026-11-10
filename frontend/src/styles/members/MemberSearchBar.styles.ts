import styled from 'styled-components'

export const SearchContainer = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  width: 100%;
  height: 38px;
  flex-shrink: 0;
  padding: 0 12px;
  border-radius: 12px;
  background: #f0f0f0;
  cursor: text;
`

export const SearchIcon = styled.svg`
  flex-shrink: 0;
  color: #636363;
`

export const SearchInput = styled.input`
  flex: 1;
  min-width: 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 140%;
  color: #253f3b;

  &::placeholder {
    color: #636363;
    opacity: 1;
  }

  &::-webkit-search-cancel-button {
    cursor: pointer;
  }
`
