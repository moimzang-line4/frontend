import styled, { css } from 'styled-components'
import Button from '../../components/Button'

export const Panel = styled.section`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding-top: 6px;
`

export const Balance = styled.div`
  padding: 18px 16px;
  border-radius: 16px;
  background: white;
  box-shadow: var(--shadow-app-bar);
  color: #1b1e20;
`

export const BalanceHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  font-size: 14px;

  button {
    min-height: 28px;
    color: #777;
    font-size: 11px;
    cursor: pointer;
  }
`

export const Total = styled.p`
  padding: 4px 0 8px;
  border-bottom: 1px solid #ededed;
  font-size: 24px;
  font-weight: 700;
  overflow-wrap: anywhere;
`

export const Totals = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
  padding-top: 9px;

  dt {
    color: #888;
    font-size: 11px;
  }
  dd {
    overflow-wrap: anywhere;
    margin: 0;
    padding-top: 5px;
    font-size: 14px;
    font-weight: 700;
  }
  > div:first-child dd {
    color: #08a23a;
  }
`

export const Filters = styled.div`
  display: flex;
  gap: 6px;
`

export const Filter = styled.button<{ $active: boolean }>`
  min-height: 32px;
  padding: 5px 12px;
  border: 1px solid ${({ $active }) => ($active ? '#367d70' : '#ddece7')};
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#367d70' : 'white')};
  color: ${({ $active }) => ($active ? 'white' : '#78918c')};
  font-size: 12px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  cursor: pointer;
`

export const Manual = styled.button`
  align-self: flex-end;
  min-height: 28px;
  margin-top: -10px;
  color: var(--color-primary-strong);
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`

export const Entries = styled.div`
  min-height: 336px;
  padding: 20px 14px;
  border-radius: 16px;
  background: white;
  box-shadow: var(--shadow-app-bar);
`

export const InitialEmpty = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 12px;
  min-height: 296px;
  text-align: center;
  strong {
    color: #78918c;
    font-size: 14px;
    font-weight: 700;
  }
  p {
    color: #91a39f;
    font-size: 12px;
    line-height: 20px;
  }
`

const entryColumns = css`
  display: grid;
  grid-template-columns: minmax(0, 1fr) 112px 44px;
  align-items: center;
  gap: 14px;

  @media (max-width: 360px) {
    grid-template-columns: minmax(0, 1fr) 96px 44px;
  }
`

export const EntryHeading = styled.div`
  ${entryColumns}
  padding-bottom: 12px;
  color: #367d70;
  font-size: 12px;
  font-weight: 700;
  span:nth-child(2),
  span:last-child {
    text-align: center;
  }
`

export const Entry = styled.button<{ $income: boolean }>`
  ${entryColumns}
  width: 100%;
  min-height: 54px;
  padding: 8px 0;
  border-bottom: 1px solid #edf1ee;
  text-align: left;
  cursor: pointer;

  > span:first-child {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;
  }
  strong {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 400;
  }
  small {
    color: #888;
    font-size: 10px;
  }
  > span:nth-child(2) {
    min-width: 0;
    text-align: center;
    overflow-wrap: anywhere;
    font-size: 13px;
    color: ${({ $income }) => ($income ? '#08a23a' : '#1b1e20')};
  }
  > span:last-child {
    display: grid;
    place-items: center;
    color: #78918c;
    font-size: 24px;
  }
`

export const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  padding: 24px 20px;
`

export const Fields = styled.div`
  overflow: hidden;
  border: 1px solid #ddece7;
  border-radius: 16px;
  background: white;
  box-shadow: var(--shadow-app-bar);
`

export const Field = styled.div`
  display: flex;
  align-items: center;
  min-height: 52px;
  padding: 6px 16px;
  border-bottom: 1px solid #edf1ee;
  &:last-child {
    border-bottom: 0;
  }
  > label,
  > span:first-child {
    flex-shrink: 0;
    width: 80px;
    font-size: 13px;
    font-weight: 700;
    color: #78918c;
  }
  em {
    color: #e45c55;
    font-style: normal;
  }
  input {
    flex: 1;
    min-width: 0;
    width: 100%;
    min-height: 38px;
    background: transparent;
    color: #253f3b;
    font-size: 14px;
  }
  input::placeholder {
    color: #253f3b;
  }
  input[type='date'] {
    border: 1px solid #f0f0f0;
    border-radius: 10px;
    padding: 6px 10px;
  }
  > small {
    font-size: 13px;
  }
`

export const Type = styled.div`
  display: flex;
  justify-content: flex-end;
  gap: 8px;
  flex: 1;
`

export const TypeButton = styled.button<{ $active: boolean }>`
  min-width: 52px;
  min-height: 28px;
  border: 1px solid #edf1ee;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? '#d9d9d9' : 'white')};
  color: ${({ $active }) => ($active ? '#263e3a' : '#78918c')};
  font-size: 12px;
  cursor: pointer;
`

export const Submit = styled(Button)`
  height: 48px;
  font-size: 16px;
  border-radius: 12px;
`

export const SourceHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;

  h2 {
    flex: 1;
    font-size: 17px;
    font-weight: 700;
  }
  button {
    min-height: 32px;
    font-size: 11px;
    color: var(--color-primary-strong);
    cursor: pointer;
  }
  button:disabled {
    opacity: 0.5;
    cursor: wait;
  }
`

export const DateControl = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  border: 1px solid #f0f0f0;
  border-radius: 10px;

  min-height: 38px;

  > span {
    width: 100%;
    padding-inline: 34px 30px;
    font-size: 13px;
    pointer-events: none;
  }

  &:focus-within {
    outline: 2px solid var(--color-primary-strong);
    outline-offset: 2px;
  }

  input[type='date'] {
    position: absolute;
    inset: 0;
    opacity: 0;
    cursor: pointer;
    border: 0;
    padding-inline: 34px 30px;
  }
  img {
    position: absolute;
    pointer-events: none;
  }
  img:first-child {
    left: 10px;
  }
  img:last-child {
    right: 8px;
  }
  input::-webkit-calendar-picker-indicator {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
  }
`
