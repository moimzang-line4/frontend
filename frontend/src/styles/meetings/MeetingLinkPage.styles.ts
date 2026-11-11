import styled from 'styled-components'
import { Card } from './MeetingCard.styles'
import { Search as OperationSearch } from '../operations/OperationsPage.styles'

export const Confirm = styled.button`
  display: flex; align-items: center; justify-content: center;
  min-width: 44px; min-height: 44px; color: #367d70; font-size: 14px; font-weight: 700; cursor: pointer;
  &:disabled { color: #b3b3b3; cursor: default; }
`
export const Summary = styled.div`
  display: flex; flex-direction: column; gap: 6px;
  h2 { font-size: 18px; line-height: 1.4; font-weight: 700; overflow-wrap: anywhere; }
  p { font-size: 13px; line-height: 18px; color: #78918c; }
`
export const List = styled.ul`display: flex; flex-direction: column; gap: 12px;`
export const Selectable = styled(Card).attrs({ as: 'label' })`
  display: flex; flex-direction: column; gap: 12px; cursor: pointer; border: 1px solid transparent;
  &:has(input:checked) { border-color: #9ccfc2; background: #f3faf7; }
  &:focus-within { outline: 2px solid #367d70; outline-offset: 2px; }
`
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  width: 22px; height: 22px; flex-shrink: 0; accent-color: #367d70; cursor: pointer;
`
export const Footer = styled.div`
  border-top: 1px solid #edf1ee; padding-top: 12px; display: flex; align-items: center; gap: 8px;
  color: #78918c; font-size: 12px; line-height: 18px; flex-wrap: wrap;
  span { display: flex; align-items: center; gap: 6px; }
`
export const Empty = styled.p`
  padding: 40px 12px; color: #78918c; text-align: center; font-size: 14px; line-height: 1.6;
`

export const Search = styled(OperationSearch)`flex: none; min-height: 38px;`
