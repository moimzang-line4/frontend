import styled from 'styled-components'
import Button from '../../components/Button'

export const Page = styled.div`
  width: 100%; max-width: var(--container-app); min-height: 100dvh; margin-inline: auto;
  background: #f7f8fa; color: #253f3b;
`
export const Content = styled.main`
  display: flex; flex-direction: column; gap: 16px; padding: 24px 20px calc(28px + env(safe-area-inset-bottom, 0px));
`
export const Card = styled.div`
  border: 1px solid #ddece7; border-radius: 16px; background: white;
  box-shadow: 0 7px 18px rgb(63 141 124 / 10%); overflow: hidden;
`
export const Form = styled.form`
  display: flex; flex-direction: column; gap: 16px;
`
export const Row = styled.div`
  display: flex; align-items: center; gap: 0; min-height: 52px; padding: 10px 16px; border-bottom: 1px solid #edf1ee;
  > label, > span { width: 80px; flex-shrink: 0; color: #78918c; font-size: 13px; line-height: 1.4; font-weight: 700; }
  input:not([type=date]) { min-width: 0; flex: 1; width: 100%; height: 31px; border: none; background: transparent; color: #253f3b; font-size: 14px; }
  input::placeholder { color: #91a39f; }
`
export const Required = styled.span`color: #e45c55; font-weight: 400;`
export const Picker = styled.div`
  position: relative; display: flex; flex: 1; min-width: 0; align-items: center; justify-content: space-between; gap: 5px; min-height: 31px;
  > span { display: flex; align-items: center; gap: 5px; font-size: 12px; color: #78918c; }
  input { position: absolute; inset: 0; width: 100%; height: 100%; opacity: 0; cursor: pointer; }
  &:focus-within { outline: 2px solid var(--color-primary-strong); outline-offset: 2px; }
`
export const Category = styled.button`
  display: flex; align-items: center; justify-content: space-between; gap: 5px; flex: 1; min-width: 0; min-height: 31px;
  text-align: left; color: #253f3b; font-size: 14px; cursor: pointer;
`
export const Agenda = styled.section`
  padding: 12px 16px;
`
export const AgendaHeading = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px;
  label, h3 { color: #78918c; font-size: 13px; line-height: 18px; font-weight: 700; }
`
export const Counter = styled.div`
  display: flex; align-items: center; gap: 6px; color: #b3b3b3; font-size: 12px;
  button { color: #e45c55; cursor: pointer; min-height: 24px; }
`
export const Textarea = styled.textarea`
  display: block; width: 100%; min-height: 110px; padding: 10px 13px; resize: vertical;
  border: 1px solid #ddece7; border-radius: 10px; background: white; color: #253f3b; font-size: 12px; line-height: 20px;
  &::placeholder { color: #91a39f; }
`
export const AddWrap = styled.div`padding: 0 16px 14px;`
export const OutlineButton = styled.button<{ $danger?: boolean }>`
  width: 100%; min-height: 44px; padding: 10px 13px; border: 1px solid #ddece7; border-radius: 12px; background: white;
  color: ${({ $danger }) => $danger ? '#ea5a55' : '#367d70'}; font-size: 14px; font-weight: 700; cursor: pointer;
`
export const Submit = styled(Button)`box-shadow: 0 5px 14px rgb(63 141 124 / 17%);`
export const Error = styled.p`color: #b43b34; font-size: 13px; line-height: 1.5;`
export const Notice = styled.div`
  padding: 24px 20px;
  h1 { margin-bottom: 16px; font-size: 18px; font-weight: 700; }
  a { color: #367d70; text-decoration: underline; }
`
export const Heading = styled.div`
  display: flex; flex-direction: column; gap: 6px;
  h2 { font-size: 18px; line-height: 1.4; font-weight: 700; overflow-wrap: anywhere; }
  p { color: #78918c; font-size: 12px; line-height: 18px; }
`
export const ProgressCard = styled(Card)`display: flex; flex-direction: column; gap: 10px; padding: 10px 16px; border-radius: 14px;`
export const ProgressHeading = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 26px;
  h3 { color: #17251e; font-size: 16px; font-weight: 700; }
  span { color: black; font-size: 12px; }
`
export const ProgressText = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px; color: #367d70; font-size: 11px; line-height: 18px;
`
export const Progress = styled.progress`
  appearance: none; width: 100%; height: 11px; overflow: hidden; border: none; border-radius: 999px;
  &::-webkit-progress-bar { background: #e1e1e1; }
  &::-webkit-progress-value { border-radius: 999px; background: linear-gradient(173deg, #ccf0e8 19%, #98bdb6 81%); }
  &::-moz-progress-bar { background: #98bdb6; }
`
export const AgendaTabs = styled.div`
  display: flex; gap: 4px; overflow-x: auto; border-radius: 16px; background: #f0f0f0;
`
export const AgendaTab = styled.button<{ $active: boolean }>`
  min-height: 33px; min-width: 80px; flex: 1; padding: 6px 12px; white-space: nowrap; border-radius: 999px;
  background: ${({ $active }) => $active ? 'white' : 'transparent'}; color: ${({ $active }) => $active ? '#367d70' : '#78918c'};
  box-shadow: ${({ $active }) => $active ? '0 2px 5px rgb(54 125 112 / 9%)' : 'none'}; font-size: 12px; cursor: pointer;
`
export const RunCard = styled(Card)`padding: 16px;`
export const RunHeading = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  h3 { color: #78918c; font-size: 13px; font-weight: 700; }
`
export const Status = styled.span<{ $done: boolean }>`
  display: inline-flex; min-height: 18px; align-items: center; border-radius: 12px; padding: 0 8px;
  background: ${({ $done }) => $done ? '#e5f4ea' : '#ffebde'}; color: ${({ $done }) => $done ? '#367d70' : '#a15b31'};
  font-size: 10px; font-weight: 700; line-height: 18px;
`
export const Preparation = styled.p`
  padding: 10px 13px; margin-top: 12px; border: 1px solid #ddece7; border-radius: 10px; background: #f0f0f0;
  font-size: 12px; line-height: 20px; white-space: pre-wrap; overflow-wrap: anywhere;
`
export const RunField = styled.label`
  display: flex; flex-direction: column; gap: 12px; margin-top: 24px; color: #78918c; font-size: 13px; line-height: 18px; font-weight: 700;
  textarea { font-weight: 400; }
`
export const DateRow = styled(Row)`
  position: relative;
  cursor: pointer;

  > label,
  ${Picker} {
    pointer-events: none;
  }

  &:focus-within {
    outline: 2px solid var(--color-primary-strong);
    outline-offset: -2px;
  }
`

export const DateInput = styled.input`
  position: absolute;
  inset: 0;
  z-index: 1;
  width: 100%;
  height: 100%;
  margin: 0;
  padding: 0;
  border: 0;
  opacity: 0;
  cursor: pointer;

  &::-webkit-calendar-picker-indicator {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    margin: 0;
    padding: 0;
    cursor: pointer;
  }
`