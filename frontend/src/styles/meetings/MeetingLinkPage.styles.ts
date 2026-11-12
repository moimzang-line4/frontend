import styled from 'styled-components'

export const Content = styled.main`
  display: flex; flex-direction: column; gap: 14px; padding: 18px 20px calc(28px + env(safe-area-inset-bottom, 0px));
`
export const Toolbar = styled.div`
  position: sticky; top: calc(var(--spacing-header) + env(safe-area-inset-top, 0px) + 1px); z-index: 10;
  display: flex; align-items: center; gap: 10px; padding: 8px 0; background: white;
`
export const Search = styled.label`
  display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; min-height: 38px; padding: 0 12px;
  border-radius: 12px; background: #f0f0f0;
  input { width: 100%; min-width: 0; height: 38px; background: transparent; border: none; font-size: 14px; }
  input::placeholder { color: #636363; }
  img { flex-shrink: 0; }
`
export const Add = styled.button`
  flex-shrink: 0; min-width: 78px; min-height: 32px; padding: 6px 12px; border: 1px solid rgb(255 255 255 / 45%); border-radius: 12px;
  background: linear-gradient(151deg, #5aa997 10.714%, #438b7e 82.143%); color: white; font-size: 12px; font-weight: 700; cursor: pointer;
  &:disabled { background: #dce5e2; color: #78918c; cursor: default; }
`
export const Count = styled.div`
  display: flex; justify-content: space-between; align-items: center; gap: 8px; min-height: 33px;
  h2 { color: #19251f; font-size: 17px; line-height: 1.4; font-weight: 700; }
  span { color: #78918c; font-size: 12px; }
`
export const List = styled.ul`display: flex; flex-direction: column; gap: 10px;`
export const Empty = styled.p`padding: 40px 12px; text-align: center; color: #78918c; font-size: 14px; line-height: 1.6;`
export const Page = styled.div`width: 100%; max-width: var(--container-app); min-height: 100dvh; margin-inline: auto; background: white;`
