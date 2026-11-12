import styled from 'styled-components'
import { Link } from 'react-router'

export const Section = styled.section`
  display: flex; flex-direction: column; gap: 24px; margin-top: 22px; padding: 16px 14px;
  border: 1px solid #ddece7; border-radius: 16px; background: white; box-shadow: 0 7px 18px rgb(63 141 124 / 10%);
`
export const Heading = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  h2 { color: #19251f; font-size: 16px; line-height: 1.4; font-weight: 700; }
  a { color: #367d70; font-size: 12px; line-height: 24px; font-weight: 700; }
`
export const Top = styled.div`display: flex; flex-direction: column; gap: 14px;`
export const Tabs = styled.div`display: flex; gap: 4px; min-height: 33px; border-radius: 16px; background: #f0f0f0;`
export const Tab = styled.button<{ $active: boolean }>`
  flex: 1; min-width: 0; min-height: 32px; padding: 6px 8px; border-radius: 999px;
  background: ${({ $active }) => $active ? 'white' : 'transparent'}; color: ${({ $active }) => $active ? '#367d70' : '#78918c'};
  box-shadow: ${({ $active }) => $active ? '0 2px 5px rgb(54 125 112 / 9%)' : 'none'};
  font-size: 12px; font-weight: ${({ $active }) => $active ? 700 : 500}; cursor: pointer;
`
export const List = styled.ul`display: flex; flex-direction: column; gap: 24px; min-width: 0;`
export const Empty = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 10px; padding: 8px 0;
  text-align: center;
  strong { color: #8c8c8c; font-size: 14px; line-height: 1.4; }
  p { color: #b3b3b3; font-size: 12px; line-height: 1.4; }
`
export const Actions = styled.div`display: flex; gap: 10px;`
export const Action = styled(Link)<{ $primary?: boolean }>`
  display: flex; flex: 1; min-width: 0; min-height: 32px; align-items: center; justify-content: center;
  padding: 6px 8px; border: 1px solid #ddece7; border-radius: 999px; background: ${({ $primary }) => $primary ? '#367d70' : 'white'};
  color: ${({ $primary }) => $primary ? 'white' : '#367d70'}; font-size: 12px; font-weight: 700; text-align: center;
`
export const Card = styled.article`
  min-width: 0; padding: 12px 14px; border: 1px solid #ddece7; border-radius: 16px; background: white;
  box-shadow: 0 6px 18px rgb(63 141 124 / 9%);
`
export const Header = styled.div`display: flex; align-items: center; gap: 10px;`
export const Toggle = styled.button`
  display: flex; flex: 1; min-width: 0; align-items: center; gap: 12px; width: 100%; min-height: 52px;
  text-align: left; cursor: pointer;
`
export const HeaderText = styled.span`
  display: flex; flex: 1; flex-direction: column; gap: 3px; min-width: 0;
  strong { color: #253f3b; font-size: 14px; line-height: 21px; font-weight: 600; overflow-wrap: anywhere; }
  small { color: #78918c; font-size: 12px; line-height: 19px; overflow-wrap: anywhere; }
`
export const Chevron = styled.img<{ $expanded: boolean }>`
  flex-shrink: 0; transform: rotate(${({ $expanded }) => $expanded ? '180deg' : '0deg'}); transition: transform 160ms ease;
  @media (prefers-reduced-motion: reduce) { transition: none; }
`
export const Status = styled.span<{ $done: boolean }>`
  display: inline-flex; flex-shrink: 0; min-height: 18px; align-items: center; justify-content: center; padding: 0 8px; border-radius: 12px;
  background: ${({ $done }) => $done ? '#e5f4ea' : '#ffebde'}; color: ${({ $done }) => $done ? '#367d70' : '#a15b31'};
  font-size: 10px; line-height: 18px; font-weight: 700;
`
export const Checkbox = styled.input.attrs({ type: 'checkbox' })`
  flex-shrink: 0; width: 20px; height: 20px; accent-color: #367d70; cursor: pointer;
`
export const Panel = styled.div`display: flex; flex-direction: column; gap: 10px; padding-top: 10px;`
export const Disconnect = styled.button`
  min-height: 44px; width: 100%; padding: 10px; border: 1px solid #ddece7; border-radius: 12px;
  background: white; color: #ea5a55; font-size: 14px; line-height: 20px; font-weight: 700; cursor: pointer;
`
export const Detail = styled.div`
  display: flex; flex-direction: column; gap: 24px; padding: 16px; border: 1px solid #ddece7; border-radius: 16px;
  background: white; box-shadow: 0 7px 18px rgb(63 141 124 / 10%);
`
export const DetailHeading = styled.div`
  display: flex; align-items: flex-start; gap: 6px;
  h4 { flex-shrink: 0; color: #78918c; font-size: 13px; font-weight: 700; line-height: 20px; }
  > p { flex: 1; min-width: 0; font-size: 14px; line-height: 20px; overflow-wrap: anywhere; }
`
export const Preparation = styled.p`
  margin-top: 12px; padding: 10px 13px; border: 1px solid #ddece7; border-radius: 10px;
  background: #f0f0f0; color: #253f3b; font-size: 12px; line-height: 20px; white-space: pre-wrap; overflow-wrap: anywhere;
`
export const Field = styled.label`
  display: flex; flex-direction: column; gap: 12px; color: #78918c; font-size: 13px; font-weight: 700; line-height: 18px;
  textarea { width: 100%; min-height: 110px; padding: 10px 13px; resize: vertical; border: 1px solid #ddece7; border-radius: 10px;
    background: white; color: #253f3b; font-size: 12px; line-height: 20px; font-weight: 400; }
  textarea::placeholder { color: #91a39f; }
`
export const Footer = styled.div`
  display: flex; flex-wrap: wrap; justify-content: space-between; align-items: center; gap: 8px; padding-top: 12px; border-top: 1px solid #edf1ee; margin-top: 12px;
  p { display: flex; align-items: center; flex-wrap: wrap; gap: 6px; color: #78918c; font-size: 12px; line-height: 18px; }
  a { min-height: 28px; padding: 5px 10px; border-radius: 12px; background: #367d70; color: white; font-size: 11px; line-height: 18px; }
`
export const MeetingTop = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  > span { display: flex; align-items: center; gap: 4px; flex-wrap: wrap; }
  time { color: #78918c; font-size: 12px; line-height: 18px; }
`
export const Category = styled.span`padding: 0 6px; border-radius: 12px; background: #f0f3f2; color: #78918c; font-size: 10px; line-height: 18px;`
export const Preview = styled.p`
  overflow: hidden; display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
  color: #78918c; font-size: 13px; line-height: 20px; overflow-wrap: anywhere;
`
export const EditLink = styled(Link)`color: #367d70; font-size: 13px; font-weight: 700; text-align: center; padding: 8px;`

export const MeetingHeaderText = styled(HeaderText)`strong { font-size: 16px; line-height: 24px; font-weight: 700; }`
