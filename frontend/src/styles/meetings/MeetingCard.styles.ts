import styled from 'styled-components'
import { Link } from 'react-router'

export const Card = styled.article`
  border-radius: 16px; background: white; padding: 14px; box-shadow: 0 6px 18px rgb(63 141 124 / 9%);
`
export const MainLink = styled(Link)`display: flex; flex-direction: column; gap: 12px; color: inherit;`
export const Top = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 22px;
  time { color: #78918c; font-size: 12px; line-height: 18px; }
`
export const Badges = styled.div`display: flex; flex-wrap: wrap; gap: 4px;`
export const Category = styled.span`
  display: inline-flex; align-items: center; min-height: 18px; padding: 0 8px; border-radius: 12px;
  background: #f0f3f2; color: #78918c; font-size: 10px; line-height: 18px; font-weight: 700;
`
export const Status = styled(Category)<{ $done: boolean }>`
  background: ${({ $done }) => $done ? '#e5f4ea' : '#ffebde'};
  color: ${({ $done }) => $done ? '#367d70' : '#a15b31'};
`
export const Title = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  h3 { font-size: 16px; line-height: 24px; font-weight: 700; color: #253f3b; overflow-wrap: anywhere; }
  span { color: #78918c; font-size: 22px; line-height: 24px; }
`
export const Preview = styled.p`
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2; overflow: hidden;
  color: #78918c; font-size: 13px; line-height: 20px; overflow-wrap: anywhere;
`
export const Footer = styled.div`
  display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 8px;
  border-top: 1px solid #edf1ee; margin-top: 12px; padding-top: 12px;
`
export const Metadata = styled.div`
  display: flex; align-items: center; flex-wrap: wrap; gap: 6px; min-width: 0; color: #78918c; font-size: 12px; line-height: 18px;
  span { display: inline-flex; align-items: center; gap: 6px; }
`
export const Action = styled(Link)<{ $filled: boolean }>`
  display: inline-flex; min-height: 28px; align-items: center; justify-content: center; padding: 4px 12px;
  border: 1px solid rgb(54 125 112 / 30%); border-radius: 12px; font-size: 11px; line-height: 18px;
  color: ${({ $filled }) => $filled ? 'white' : '#367d70'}; background: ${({ $filled }) => $filled ? '#367d70' : 'white'};
`
