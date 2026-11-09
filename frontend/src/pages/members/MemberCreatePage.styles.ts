import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100%;
  display: flex;
  flex-direction: column;
`

export const Content = styled.main`
  flex: 1;
  padding: 0;
`

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 9px;
  margin-top: 18px;
`;

export const Label = styled.label`
  font-size: 13px;
  font-weight: 700;
  color: #333333;
`;

export const Input = styled.input`
  width: 100%;
  height: 44px;
  padding: 0 14px;
  box-sizing: border-box;
  border: none;
  border-radius: 12px;
  outline: none;
  background: #ffffff;
  font-size: 13px;

  &:focus {
    outline: 1px solid #56a997;
  }
`;

export const FieldSection = styled.section`
  margin-top: 18px;
  padding: 14px;
  background: #ffffff;
  border-radius: 16px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 14px;
  font-weight: 700;
`;

export const RequiredFields = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

export const RequiredField = styled.div`
  flex: 1;
  height: 38px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #d9e9e5;
  border-radius: 9px;
  font-size: 12px;

  span:last-child {
    font-size: 10px;
    color: #aaaaaa;
  }
`;

export const OptionalFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
`;

export const Notice = styled.p`
  margin-top: 16px;
  font-size: 11px;
  color: #aaaaaa;
`;

export const BottomAction = styled.div`
  padding: 14px 18px 22px;
  background: #f7f8fa;
`;

export const SubmitButton = styled.button`
  width: 100%;
  height: 48px;
  border: none;
  border-radius: 10px;
  background: linear-gradient(90deg, #5ab09e, #408f80);
  color: #ffffff;
  font-size: 14px;
  font-weight: 700;
  cursor: pointer;
`;