import styled from 'styled-components'

export const Card = styled.div`
  display: flex;
  width: 100%;
  flex-direction: column;
  overflow: hidden;
  border: 1px solid #ddece7;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 7px 18px 0 rgba(63, 141, 124, 0.1);
`

export const Row = styled.div`
  display: flex;
  height: 52px;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid #edf1ee;

  &:last-child {
    border-bottom: none;
  }
`

export const Label = styled.label`
  width: 80px;
  flex-shrink: 0;
  font-size: 13px;
  line-height: 140%;
  font-weight: 700;
  color: #78918c;
`

export const Required = styled.span`
  color: #e45c55;
`

const valueText = `
  min-width: 0;
  flex: 1 0 0;
  height: 100%;
  border: none;
  outline: none;
  background: transparent;
  font-size: 14px;
  line-height: 140%;
  font-weight: 400;
  color: #253f3b;
`

export const Input = styled.input`
  ${valueText}

  &::placeholder {
    color: #5f756e;
    opacity: 1;
  }
`

// 차수 선택: 누르면 바텀시트(OptionSheet)가 열림
export const SelectButton = styled.button<{ $empty: boolean }>`
  ${valueText}
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 0;
  text-align: left;
  cursor: pointer;
  color: ${({ $empty }) => ($empty ? '#5f756e' : '#253f3b')};
`

export const Chevron = styled.svg`
  flex-shrink: 0;
  margin-right: -4px;
  color: #78918c;
`

// 수정 화면: 차수 옆 회색 안내
export const Hint = styled.span`
  margin-left: auto;
  font-size: 12px;
  color: #9aaba7;
`
