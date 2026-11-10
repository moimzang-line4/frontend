import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  max-width: 390px;
  min-height: 100dvh;
  margin: 0 auto;

  display: flex;
  flex-direction: column;

  background: #f7f8fa;
`

export const Header = styled.header`
  display: flex;
  align-items: center;

  height: 76px;
  padding: 0 20px;
  flex-shrink: 0;

  background: #ffffff;
  border-radius: 0 0 16px 16px;

  box-shadow: 0 5px 14px rgba(63, 143, 128, 0.08);
`

export const HeaderTitle = styled.h1`
  margin: 0;

  font-size: 18px;
  font-weight: 700;
  color: #18251f;
`

export const Content = styled.main`
  flex: 1;
  padding: 16px 20px;
`

export const Form = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

export const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #18251f;
`

export const Input = styled.input`
  width: 100%;
  height: 42px;

  box-sizing: border-box;
  padding: 0 14px;

  border: 1px solid #ddece7;
  border-radius: 10px;

  background: #ffffff;
  color: #344a43;

  font-size: 13px;
  outline: none;

  &::placeholder {
    color: #78918c;
    opacity: 1;
  }

  &:focus {
    border-color: #459887;
  }
`

export const Agreement = styled.label`
  display: flex;
  align-items: flex-start;
  gap: 6px;

  margin-top: 20px;
  cursor: pointer;
`

export const Checkbox = styled.input`
  width: 14px;
  height: 14px;
  margin: 0;

  accent-color: #459887;
  cursor: pointer;
`

export const AgreementText = styled.span`
  font-size: 11px;
  line-height: 16px;
  color: #a8a8a8;
`

export const BottomAction = styled.div`
  position: sticky;
  bottom: 0;

  width: 100%;
  padding: 12px 20px calc(20px + env(safe-area-inset-bottom, 0px));

  box-sizing: border-box;

  border-top: 1px solid #e4ebe8;
  background: #ffffff;
`