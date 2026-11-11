import styled from 'styled-components'
import { Link } from 'react-router'
import Button from '../../components/Button'

export const Page = styled.div<{ $footer?: boolean }>`
  width: 100%; max-width: var(--container-app); min-height: 100dvh; margin-inline: auto;
  padding-bottom: ${({ $footer }) => $footer ? 'calc(107px + env(safe-area-inset-bottom, 0px))' : 'env(safe-area-inset-bottom, 0px)'};
  background: #f7f8fa; color: #253f3b;
`
export const ListContent = styled.main`
  display: flex; flex-direction: column; gap: 12px; padding: 16px 20px 28px;
`
export const Search = styled.label`
  display: flex; align-items: center; gap: 8px; min-height: 38px; padding: 0 13px;
  border: 1px solid #ddece7; border-radius: 22px; background: white;
  img { flex-shrink: 0; }
  input { min-width: 0; width: 100%; height: 36px; border: none; background: transparent; font-size: 13px; color: #253f3b; }
  input::placeholder { color: #78918c; }
`
export const Filters = styled.div`
  display: flex; gap: 6px; overflow-x: auto; padding: 1px 0;
`
export const Filter = styled.button<{ $active: boolean }>`
  flex-shrink: 0; min-height: 32px; padding: 5px 12px; border: 1px solid ${({ $active }) => $active ? '#367d70' : '#ddece7'};
  border-radius: 18px; background: ${({ $active }) => $active ? '#367d70' : 'white'}; color: ${({ $active }) => $active ? 'white' : '#78918c'};
  font-size: 12px; line-height: 18px; font-weight: ${({ $active }) => $active ? 700 : 400}; cursor: pointer;
`
export const Heading = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  h2 { font-size: 17px; line-height: 24px; font-weight: 700; }
  a { display: flex; align-items: center; min-height: 36px; color: #3f8275; font-size: 12px; font-weight: 700; }
`
export const List = styled.ul`display: flex; flex-direction: column; gap: 12px;`
export const Card = styled(Link)`
  display: flex; flex-direction: column; gap: 12px; padding: 14px; border-radius: 16px;
  background: white; box-shadow: 0 6px 18px rgb(63 141 124 / 9%); color: inherit;
`
export const CardTop = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px; min-height: 22px;
  time { color: #78918c; font-size: 12px; line-height: 18px; }
`
export const Badge = styled.span<{ $color: string; $background: string }>`
  display: inline-flex; align-items: center; min-height: 18px; padding: 0 8px; border-radius: 12px;
  background: ${({ $background }) => $background}; color: ${({ $color }) => $color}; font-size: 10px; line-height: 18px; font-weight: 700;
`
export const CardTitle = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 8px;
  h3 { min-width: 0; overflow-wrap: anywhere; font-size: 16px; line-height: 24px; font-weight: 700; }
  span { flex-shrink: 0; color: #78918c; font-size: 22px; line-height: 24px; }
`
export const Preview = styled.p`
  display: -webkit-box; -webkit-box-orient: vertical; -webkit-line-clamp: 2;
  overflow: hidden; white-space: pre-wrap; overflow-wrap: anywhere; color: #78918c; font-size: 13px; line-height: 20px;
`
export const Metadata = styled.div`
  display: flex; align-items: center; flex-wrap: wrap; gap: 6px; min-height: 22px; padding-top: 12px; border-top: 1px solid #edf1ee;
  color: #78918c; font-size: 12px; line-height: 18px;
  span { display: inline-flex; align-items: center; gap: 6px; min-width: 0; overflow-wrap: anywhere; }
  img { flex-shrink: 0; }
`
export const Empty = styled.p`padding: 40px 12px; color: #78918c; text-align: center; font-size: 14px; line-height: 1.6;`
export const FormContent = styled.main`padding: 24px 20px 28px;`
export const Form = styled.form`display: flex; flex-direction: column; gap: 16px;`
export const FormCard = styled.div`
  overflow: hidden; border: 1px solid #ddece7; border-radius: 16px; background: white;
  box-shadow: 0 7px 18px rgb(63 141 124 / 10%);
`
export const Row = styled.div`
  display: flex; align-items: center; gap: 0; min-height: 52px; padding: 10px 16px; border-bottom: 1px solid #edf1ee;
  > label, > span { width: 80px; flex-shrink: 0; font-size: 13px; line-height: 1.4; font-weight: 700; color: #78918c; }
  input { width: 100%; min-width: 0; flex: 1; height: 31px; border: none; background: transparent; color: #253f3b; font-size: 14px; }
  input::placeholder { color: #91a39f; }
`
export const Required = styled.span`color: #e45c55; font-weight: 400;`
export const TypeButton = styled.button`
  display: flex; flex: 1; min-width: 0; min-height: 31px; align-items: center; justify-content: space-between; gap: 8px;
  color: #5f756e; text-align: left; font-size: 14px; cursor: pointer;
  img { flex-shrink: 0; }
`
export const BodyField = styled.div`padding: 12px 16px;`
export const BodyHeading = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px; margin-bottom: 12px;
  label { color: #78918c; font-size: 13px; line-height: 18px; font-weight: 700; }
  > span { color: #b3b3b3; font-size: 12px; }
`
export const Textarea = styled.textarea`
  display: block; width: 100%; min-height: 110px; padding: 10px 13px; border: 1px solid #ddece7; border-radius: 10px;
  background: white; color: #253f3b; font-size: 13px; line-height: 20px; resize: vertical;
  &::placeholder { color: #91a39f; font-size: 12px; }
`
export const Submit = styled(Button)`box-shadow: 0 5px 14px rgb(63 141 124 / 17%);`
export const Delete = styled.button`
  width: 100%; min-height: 44px; margin-top: -4px; padding: 10px; border: 1px solid #ddece7; border-radius: 12px; background: white;
  color: #ea5a55; font-size: 14px; line-height: 20px; font-weight: 700; cursor: pointer;
`
export const Error = styled.p`color: #b43b34; font-size: 13px; line-height: 1.5;`
export const Notice = styled.main`
  padding: 24px 20px;
  h1 { font-size: 18px; font-weight: 700; margin-bottom: 16px; }
  a { color: #367d70; text-decoration: underline; }
`
export const TypeOptions = styled.div`display: flex; flex-direction: column; gap: 4px;`
export const TypeOption = styled.button<{ $active: boolean }>`
  display: flex; align-items: center; justify-content: space-between; min-height: 52px; width: 100%; padding: 10px 14px;
  border-radius: 12px; background: ${({ $active }) => $active ? '#e6f4f0' : 'transparent'};
  color: ${({ $active }) => $active ? '#367d70' : '#253f3b'}; font-size: 16px; text-align: left; cursor: pointer;
`
