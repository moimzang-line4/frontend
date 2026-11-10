import styled from 'styled-components'

export const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 18px;
`;

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