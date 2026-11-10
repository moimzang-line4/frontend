import styled from 'styled-components'

export const OperatorList = styled.ul`
  display: flex; flex-direction: column; gap: 12px;
`
export const Operator = styled.li`
  display: flex; align-items: center; gap: 12px; min-height: 65px;
  padding: 12px 15px; border: 1px solid white; border-radius: 16px;
  background: white; box-shadow: var(--shadow-app-bar);
`
export const Person = styled.div`
  display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 7px;
  strong { font-size: 14px; line-height: 17px; }
  p { color: #78918c; font-size: 12px; line-height: 15px; }
`
export const More = styled.button`
  display: grid; place-items: center; width: 44px; height: 44px;
  margin: -10px -15px -10px 0; cursor: pointer;
`
export const SheetActions = styled.div`
  display: flex; flex-direction: column; gap: 8px;
  button { min-height: 52px; width: 100%; padding: 12px 14px; border-radius: 12px;
    background: white; text-align: left; font-size: 16px; font-weight: 700; cursor: pointer; }
  button:last-child { color: #e45c55; }
`
export const InviteCard = styled.section`
  display: flex; flex-direction: column; gap: 12px; margin-top: 20px;
  padding: 16px; border: 1px solid var(--color-border); border-radius: 16px; background: white;
  h3 { color: #19251f; font-size: 14px; line-height: 21px; font-weight: 700; }
`
export const LinkInput = styled.input`
  width: 100%; height: 44px; border: 0; border-radius: 10px; padding: 8px 10px;
  background: #f7f8fa; color: #53625a; font-size: 14px;
`
export const CopyButton = styled.button`
  width: 100%; height: 48px; border-radius: 10px; background: #438b7e;
  color: white; font-size: 16px; font-weight: 700; cursor: pointer;
  &:disabled { opacity: .7; cursor: wait; }
`
export const Status = styled.p`
  color: #53625a; font-size: 13px; line-height: 20px; overflow-wrap: anywhere;
`
export const EditForm = styled.form`
  display: flex; flex-direction: column; gap: 18px; margin-top: 20px;
  label { display: flex; flex-direction: column; gap: 6px; font-size: 14px; line-height: 19px; font-weight: 700; }
  span { color: #e45c55; }
  input { width: 100%; min-height: 52px; padding: 13px; border: none; border-radius: 10px;
    background: white; color: #344f45; font-size: 14px; font-weight: 400; }
  input::placeholder { color: #91a39f; }
`
