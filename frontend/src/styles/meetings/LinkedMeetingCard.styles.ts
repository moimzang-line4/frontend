import styled from 'styled-components'
import { Link } from 'react-router'

export const List = styled.div`display: flex; flex-direction: column; gap: 8px; margin-top: 8px;`
export const Card = styled(Link)`
  display: flex; align-items: center; justify-content: space-between; gap: 12px; width: 100%; min-height: 86px;
  padding: 12px 14px; border: 1px solid white; border-radius: 16px;
  background: linear-gradient(161.71deg, white 10.714%, #f3faf7 82.143%);
  box-shadow: 0 7px 18px rgb(63 141 124 / 10%);
  > div { display: flex; flex: 1; flex-direction: column; gap: 4px; min-width: 0; }
  strong { color: #367d70; font-size: 11px; font-weight: 700; line-height: 1.4; }
  h3 { color: black; font-size: 18px; font-weight: 700; line-height: 1.4; overflow-wrap: anywhere; }
  p { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; color: #637069; font-size: 12px; line-height: 1.4; }
  > img { flex-shrink: 0; }
`
export const EditButton = styled.button`
  color: #e45c55; min-height: 28px; font-size: 12px; font-weight: 700; cursor: pointer;
`
export const ManageRow = styled.div`
  display: flex; justify-content: flex-end; gap: 12px; padding: 8px 4px 0;
  button { color: #e45c55; min-height: 28px; font-size: 12px; cursor: pointer; }
`
export const CreateButton = styled.button`
  width: 100%; min-height: 44px; margin-top: 12px; padding: 10px; border: 1px solid #d8e6e0;
  border-radius: 12px; background: white; color: #367d70; font-size: 14px; font-weight: 700; cursor: pointer;
`
