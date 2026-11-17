import styled from 'styled-components'

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const Required = styled.span`
  color: #e45c55;
`

export const SubmitArea = styled.div`
  margin-top: 6px;
`

export const Warning = styled.p`
  font-size: 12px;
  line-height: 18px;
  color: #e45c55;
`

export const DuplicateList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const DuplicateCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  padding: 14px 16px;
  border: 1px solid #ffffff;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.8) inset, 0 6px 18px 0 rgba(63, 141, 124, 0.09);
`

export const DuplicateName = styled.p`
  font-size: 15px;
  line-height: 22px;
  font-weight: 700;
  color: #0e0e0f;
`

export const DuplicateInfo = styled.p`
  font-size: 11px;
  line-height: 18px;
  color: #7a7a7d;
`

export const DuplicateStatus = styled.p`
  margin-top: 4px;
  font-size: 11px;
  line-height: 18px;
  font-weight: 700;
  color: #367d70;
`

// 인원 추가 방법 선택 / 명단방 목록
export const OptionList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const OptionButton = styled.button`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
  width: 100%;
  padding: 14px 16px;
  border: 1px solid #ffffff;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.8) inset, 0 6px 18px 0 rgba(63, 141, 124, 0.09);
  text-align: left;
  cursor: pointer;

  strong {
    font-size: 15px;
    line-height: 22px;
    font-weight: 700;
    color: #0e0e0f;
  }

  span {
    font-size: 11px;
    line-height: 18px;
    color: #7a7a7d;
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`

export const Hint = styled.p`
  font-size: 11px;
  line-height: 18px;
  color: #78918c;
`
