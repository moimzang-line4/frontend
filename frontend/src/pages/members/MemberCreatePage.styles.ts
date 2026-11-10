import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100%;

  display: flex;
  flex-direction: column;
`;

export const Content = styled.main`
  flex: 1;
  min-height: 0;
  padding: 0;
`;

export const FormGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
`;

export const Label = styled.label`
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #18251f;
`;

export const Input = styled.input`
  width: 100%;
  height: 38px;
  padding: 0 13px;
  box-sizing: border-box;
  border: 1px solid #FFF;
  border-radius: 10px;
  outline: none;
  background: #ffffff;
  font-size: 13px;

  &:focus {
    outline: 1px solid #56a997;
  }
`;

export const FieldSection = styled.section`
  margin-top: 12px;
  padding: 12px;
  background: #ffffff;
  border-radius: 16px;
`;

export const SectionTitle = styled.h3`
  margin: 0 0 10px;
  font-size: 17px;
  font-weight: 700;
`;

export const RequiredFields = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
`;

export const RequiredField = styled.div`
  flex: 1;
  height: 34px;
  padding: 0 10px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #DDECE7;
  border-radius: 8px;
  font-size: 14px;
  color: #1F1F21;

  span:last-child {
    font-size: 12px;
    color: #7A7A7D;
  }
`;

export const OptionalFields = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const Notice = styled.p`
    margin-top: 5px;
    margin-bottom: 3px;
    font-size: 12px;
    color: #c2c2c2;
    font-style: normal;
    font-weight: 300;
    line-height: 20px;      
`;

export const BottomAction = styled.div`
  margin-top: auto;
  width: 100%;
  padding: 12px 0 20px;

  background: #ffffff;
  border-top: 1px solid #e4ebe8;
`;

export const DateWrapper = styled.div`
  position: relative;
  width: 100%;
  height: 42px;
  padding: 0 13px;

  display: flex;
  align-items: center;
  gap: 8px;

  background: #ffffff;
  border-radius: 10px;
  cursor: pointer;
`;

export const CalendarIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #444444;
  flex-shrink: 0;
`;

export const DateText = styled.span<{ $placeholder: boolean }>`
  flex: 1;
  font-size: 13px;
  font-weight: 400;
  line-height: 20px;

  color: ${({ $placeholder }) =>
    $placeholder ? "#9CA3AF" : "#253f3b"};
`;

export const ArrowIcon = styled.span`
  display: flex;
  align-items: center;
  justify-content: center;
  color: #111111;
  flex-shrink: 0;
`;

export const HiddenDateInput = styled.input`
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
`;