import styled from 'styled-components'

export const Page = styled.div`
  width: 100%; max-width: var(--container-app); min-height: 100dvh; margin-inline: auto;
  background: var(--color-page-background); color: #253f3b;
  padding-bottom: calc(107px + env(safe-area-inset-bottom, 0px));
`
export const Content = styled.main`display: flex; flex-direction: column; gap: 12px; padding: 20px;`
export const SearchRow = styled.div`display: flex; align-items: center; gap: 16px; margin-bottom: 6px;`
export const Search = styled.label`
  display: flex; align-items: center; gap: 6px; flex: 1; min-width: 0; padding: 0 12px;
  border-radius: 999px; background: #f0f0f0;
  img { flex-shrink: 0; }
  input { width: 100%; min-width: 0; height: 38px; background: transparent; font-size: 14px; }
  input::placeholder { color: #636363; }
`
export const Attach = styled.button`flex-shrink: 0; min-height: 38px; font-size: 12px; font-weight: 700; color: var(--color-primary-strong); cursor: pointer;`
export const Tabs = styled.div`display: flex; gap: 10px; background: #f0f0f0; border-radius: 999px;`
export const Tab = styled.button<{ $active: boolean }>`
  flex: 1; min-width: 0; min-height: 33px; border-radius: 999px; font-size: 12px; white-space: nowrap; cursor: pointer;
  background: ${({ $active }) => $active ? 'white' : 'transparent'};
  color: ${({ $active }) => $active ? '#367d70' : '#78918c'};
  font-weight: ${({ $active }) => $active ? 700 : 500};
  box-shadow: ${({ $active }) => $active ? '0 2px 5px rgb(54 125 112 / 9%)' : 'none'};
`
export const Summary = styled.div`
  display: flex; align-items: center; justify-content: space-between; gap: 12px;
  strong { font-size: 14px; }
  select { background: transparent; font-size: 12px; color: #17251e; cursor: pointer; min-height: 24px; }
`
export const DownloadAll = styled.button`
  display: flex; gap: 4px; align-items: center; align-self: flex-end; min-height: 20px; color: #636363; font-size: 12px; cursor: pointer;
  img { width: 13px; height: 13px; }
  &:disabled { opacity: .5; cursor: default; }
`
export const List = styled.ul`display: flex; flex-direction: column; gap: 14px;`
export const Card = styled.li`
  display: flex; align-items: center; min-height: 65px; padding: 8px 0 8px 14px;
  border: 1px solid white; border-radius: 16px; background: white; box-shadow: var(--shadow-app-bar);
`
export const FileButton = styled.button`
  display: flex; align-items: center; gap: 14px; flex: 1; min-width: 0; min-height: 47px; text-align: left; cursor: pointer;
  > img { flex-shrink: 0; }
  > span { min-width: 0; display: flex; flex-direction: column; gap: 4px; }
  strong { overflow: hidden; white-space: nowrap; text-overflow: ellipsis; font-size: 14px; font-weight: 700; }
  small { font-size: 12px; }
`
export const More = styled.button`display: grid; place-items: center; flex-shrink: 0; width: 44px; height: 44px; margin-right: 0; cursor: pointer;`
export const Empty = styled.p`padding: 50px 0; text-align: center; color: var(--color-muted); font-size: 14px;`
export const ErrorText = styled.p`font-size: 13px; color: #bd3838; overflow-wrap: anywhere;`
export const Action = styled.button<{ $danger?: boolean }>`
  display: flex; align-items: center; gap: 12px; min-height: 60px; width: 100%; padding: 0 14px;
  text-align: left; font-size: 16px; cursor: pointer; color: ${({ $danger }) => $danger ? '#ff3b30' : '#253f3b'};
  ${({ $danger }) => $danger && 'border-top: 1px solid #d9d9d9; margin-top: 6px; padding-top: 6px; min-height: 66px;'}
  img { width: 20px; height: 20px; }
`
