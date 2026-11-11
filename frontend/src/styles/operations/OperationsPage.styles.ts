import styled from 'styled-components'

export const Content = styled.div`
  display: flex; flex-direction: column; gap: 12px; padding: 18px 20px 28px;
`
export const Generation = styled.label`
  position: relative; display: flex; align-items: center; justify-content: center;
  height: 33px; border: 1px solid #dbdbde; border-radius: 999px; background: #e7e7e7;
  select { appearance: none; width: 100%; height: 100%; padding: 0 36px; text-align: center; text-align-last: center; border: 0; background: transparent; font-size: 13px; cursor: pointer; }
  option { text-align: center; }
  img { position: absolute; left: calc(50% + 38px); pointer-events: none; }
`
export const Tabs = styled.div`
  display: grid; grid-template-columns: 1fr 1fr; gap: 4px;
`
export const Tab = styled.button<{ $active: boolean }>`
  min-height: 33px; border-bottom: 2px solid ${({ $active }) => $active ? '#367d70' : 'transparent'};
  color: ${({ $active }) => $active ? '#367d70' : '#78918c'};
  font-size: 14px; font-weight: ${({ $active }) => $active ? 700 : 400}; cursor: pointer;
`
export const SearchRow = styled.div`
  display: flex; align-items: center; gap: 8px; min-width: 0;
`
export const Search = styled.label`
  display: flex; flex: 1; min-width: 0; height: 38px; gap: 6px; align-items: center; padding: 0 12px;
  border-radius: 999px; background: #f0f0f0;
  img { flex-shrink: 0; }
  input { min-width: 0; width: 100%; height: 100%; border: none; background: transparent; font-size: 14px; }
  input::placeholder { color: #636363; }
`
export const Sort = styled.button`
  display: flex; align-items: center; justify-content: flex-end; gap: 4px;
  flex-shrink: 0; min-height: 38px; padding: 0 4px;
  font-size: 12px; cursor: pointer;
`
export const Filters = styled.div`
  display: flex; gap: 8px; align-items: center; min-height: 33px;
`
export const Filter = styled.button<{ $active: boolean }>`
  height: 30px; padding: 0 18px; border-radius: 15px;
  border: 1px solid ${({ $active }) => $active ? '#9ccfc2' : '#ddece7'};
  background: ${({ $active }) => $active ? '#e4f3ef' : 'white'};
  color: ${({ $active }) => $active ? '#367d70' : '#78918c'};
  font-size: 12px; font-weight: ${({ $active }) => $active ? 700 : 400}; cursor: pointer;
`
export const Heading = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  h2 { font-size: 17px; line-height: 1.4; font-weight: 700; color: #253f3b; }
  button { min-height: 32px; color: #3f8275; font-size: 12px; font-weight: 700; cursor: pointer; }
`
export const Records = styled.ul`
  display: flex; flex-direction: column; gap: 12px;
`
export const Record = styled.button`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  width: 100%; min-height: 91px; padding: 12px 14px; border: 1px solid white; border-radius: 16px;
  background: linear-gradient(160.88deg, #fff 10.714%, #f3faf7 82.143%); box-shadow: var(--shadow-app-bar);
  text-align: left; color: #253f3b; cursor: pointer;
  > div { display: flex; flex-direction: column; align-items: flex-start; gap: 6px; min-width: 0; }
  h3 { font-size: 18px; line-height: 1.4; font-weight: 700; overflow-wrap: anywhere; }
  p { font-size: 12px; line-height: 18px; color: #78918c; }
  > img { flex-shrink: 0; }
`
export const Badge = styled.span<{ $minute: boolean }>`
  display: inline-flex; align-items: center; min-height: 18px; padding: 1px 6px; border-radius: 12px;
  background: ${({ $minute }) => $minute ? '#eee' : '#dce8fe'};
  color: ${({ $minute }) => $minute ? '#424242' : '#4f75f8'};
  font-size: 10px; line-height: 14px; font-weight: 700;
`
export const Empty = styled.p`
  padding: 40px 12px; text-align: center; color: #78918c; font-size: 14px; line-height: 1.6;
`
export const CreateChoices = styled.div`
  display: flex; flex-direction: column; gap: 12px;
`
export const Choice = styled.button`
  display: flex; align-items: center; gap: 12px; width: 100%; min-height: 78px;
  padding: 12px 14px; border: 1px solid rgb(221 236 231 / 30%); border-radius: 16px;
  background: white; box-shadow: 0 7px 18px rgb(63 141 124 / 10%); text-align: left; cursor: pointer;
  > span { display: flex; flex: 1; min-width: 0; flex-direction: column; gap: 4px; }
  strong { font-size: 15px; line-height: 22px; font-weight: 700; color: #253f3b; }
  small { font-size: 12px; line-height: 18px; color: #78918c; }
  > img { flex-shrink: 0; }
`
export const ChoiceIcon = styled.div`
  display: grid; place-items: center; width: 38px; height: 38px; flex-shrink: 0;
`
export const MinuteContent = styled.div`
  white-space: pre-wrap; overflow-wrap: anywhere; line-height: 1.6; font-size: 14px;
`
export const Textarea = styled.textarea`
  width: 100%; min-height: 160px; padding: 10px; border: 1px solid var(--color-border);
  border-radius: var(--radius-control); resize: vertical; font-size: 14px;
`
