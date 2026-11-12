import styled from 'styled-components'

export const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

export const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
`

export const Heading = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

export const Title = styled.h2`
  font-size: 15px;
  line-height: 140%;
  font-weight: 700;
  color: #253f3b;
`

export const Description = styled.p`
  font-size: 12px;
  line-height: 140%;
  color: #78918c;
`

export const Rounds = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

export const RoundOption = styled.label`
  display: flex;
  min-height: 40px;
  align-items: center;
  gap: 10px;
  font-size: 14px;
  line-height: 140%;
  color: #253f3b;
  cursor: pointer;

  strong {
    margin-left: 4px;
    font-weight: 700;
  }
`

// 피그마: 체크 시 진한 원 + 흰 체크
export const Checkbox = styled.input`
  width: 20px;
  height: 20px;
  flex-shrink: 0;
  margin: 0;
  appearance: none;
  border: 1.5px solid #c9d4d0;
  border-radius: 50%;
  background: #ffffff;
  cursor: pointer;

  &:checked {
    border-color: #253f3b;
    background: #253f3b url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 20 20'%3E%3Cpath d='M5.5 10.5l3 3 6-6.5' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E") center / 16px no-repeat;
  }

  &:focus-visible {
    outline: 2px solid #5aa997;
    outline-offset: 2px;
  }
`

export const Preview = styled.div`
  position: relative;
  padding: 16px 44px 16px 16px;
  border: 1px solid #ffffff;
  border-radius: 16px;
  background: #ffffff;
  box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.8) inset, 0 6px 18px 0 rgba(63, 141, 124, 0.09);
`

export const PreviewText = styled.p`
  white-space: pre-line;
  font-size: 13px;
  line-height: 170%;
  color: #253f3b;
`

export const CopyButton = styled.button`
  position: absolute;
  top: 6px;
  right: 6px;
  display: flex;
  width: 40px;
  height: 40px;
  align-items: center;
  justify-content: center;
  color: #78918c;
  cursor: pointer;
`

export const Copied = styled.p`
  font-size: 12px;
  line-height: 140%;
  color: #367d70;
`

export const ButtonContent = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 6px;
`
