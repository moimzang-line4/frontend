import styled from 'styled-components'
import Button from '../../components/Button'

export const Page = styled.div`
  display: flex; flex-direction: column; width: 100%; max-width: var(--container-app);
  min-height: 100dvh; margin-inline: auto; background: var(--color-page-background); color: #253f3b;
`
export const Close = styled.button`
  display: grid; place-items: center; width: 44px; height: 44px; cursor: pointer; font-size: 24px; font-weight: 400;
`
export const Form = styled.form`
  display: flex; flex: 1; flex-direction: column; gap: 12px; padding: 16px 20px calc(26px + env(safe-area-inset-bottom, 0px));
`
export const Section = styled.div`
  display: flex; flex-direction: column; gap: 6px;
  h2, label, legend { font-size: 13px; line-height: 19px; font-weight: 700; }
`
export const Hint = styled.p`font-size: 12px; line-height: 18px; color: #78918c;`
export const HiddenInput = styled.input`display: none;`
export const Picker = styled.button`
  display: flex; flex-direction: column; gap: 5px; align-items: center; justify-content: center;
  min-height: 100px; border-radius: 10px; padding: 12px; background: white; cursor: pointer;
  strong { color: #367d70; font-size: 13px; line-height: 20px; font-weight: 700; }
  span { color: #78918c; font-size: 12px; line-height: 18px; }
`
export const Selected = styled.div`
  display: flex; flex-direction: column; justify-content: center; gap: 5px;
  min-height: 66px; padding: 8px 13px; border-radius: 10px; background: white;
  > div { display: flex; align-items: center; gap: 8px; min-width: 0; }
  strong { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 13px; font-weight: 700; }
  button { min-height: 24px; padding-inline: 4px; color: #367d70; font-size: 12px; font-weight: 700; cursor: pointer; }
  span { color: #78918c; font-size: 12px; }
`
export const NameField = styled.div`
  display: flex; align-items: center; gap: 8px; min-height: 38px; padding: 0 13px; border-radius: 10px; background: white;
  input { flex: 1; min-width: 0; width: 100%; min-height: 38px; background: transparent; font-size: 13px; line-height: 20px; color: #253f3b; }
  input::placeholder { color: #91a39f; }
  span { flex-shrink: 0; max-width: 30%; overflow: hidden; text-overflow: ellipsis; color: #78918c; font-size: 12px; }
`
export const Categories = styled.fieldset`
  display: flex; gap: 8px; border: 0; min-width: 0;
  legend { margin-bottom: 6px; }
`
export const Category = styled.button<{ $active: boolean }>`
  display: flex; align-items: center; justify-content: center; flex: 1; min-width: 0; min-height: 38px;
  border-radius: 20px; font-size: 13px; line-height: 20px; cursor: pointer;
  background: ${({ $active }) => $active ? '#e4f3ed' : 'white'};
  border: 1px solid ${({ $active }) => $active ? 'rgb(54 125 112 / 60%)' : 'white'};
  color: ${({ $active }) => $active ? '#367d70' : '#78918c'};
  font-weight: ${({ $active }) => $active ? 700 : 400};
`
export const Location = styled.p`font-size: 12px; color: #78918c; line-height: 18px; padding: 10px 0; overflow-wrap: anywhere;`
export const Submit = styled(Button)`
  margin-top: auto; height: 48px; min-height: 48px; border-radius: 12px; font-size: 16px; line-height: 24px;
  &:disabled { background: #d4d4d4; }
`
