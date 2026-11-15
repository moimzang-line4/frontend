import styled from 'styled-components'

export const Page = styled.div`
  width: 100%;
  max-width: var(--container-app);
  min-height: 100dvh;
  margin-inline: auto;
  background: var(--color-page-background);
  color: #253f3b;
  padding-bottom: calc(107px + env(safe-area-inset-bottom, 0px));
`
export const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 20px 20px;
`
export const SearchRow = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 6px;
`
export const Search = styled.label`
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
  min-width: 0;
  padding: 0 12px;
  border-radius: 999px;
  background: #f0f0f0;
  img {
    flex-shrink: 0;
  }
  input {
    width: 100%;
    min-width: 0;
    height: 38px;
    background: transparent;
    font-size: 14px;
  }
  input::placeholder {
    color: #636363;
  }
`
export const Attach = styled.button`
  flex-shrink: 0;
  min-height: 38px;
  font-size: 12px;
  font-weight: 700;
  color: var(--color-primary-strong);
  cursor: pointer;
`
export const Tabs = styled.div`
  display: flex;
  gap: 10px;
  background: #f0f0f0;
  border-radius: 999px;
`
export const Tab = styled.button<{ $active: boolean }>`
  flex: 1;
  min-width: 0;
  min-height: 33px;
  border-radius: 999px;
  font-size: 12px;
  white-space: nowrap;
  cursor: pointer;
  background: ${({ $active }) => ($active ? 'white' : 'transparent')};
  color: ${({ $active }) => ($active ? '#367d70' : '#78918c')};
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  box-shadow: ${({ $active }) => ($active ? '0 2px 5px rgb(54 125 112 / 9%)' : 'none')};
`
export const Summary = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  strong {
    font-size: 14px;
  }
`
export const DownloadAll = styled.button`
  display: flex;
  gap: 4px;
  align-items: center;
  align-self: flex-end;
  min-height: 20px;
  color: #636363;
  font-size: 12px;
  cursor: pointer;
  img {
    width: 13px;
    height: 13px;
  }
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`
export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 14px;
`

export const ViewToolbar = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  > button:last-child {
    margin-left: auto;
  }
`

export const ViewOptions = styled.div`
  display: flex;
  gap: 7px;
`

export const ViewButton = styled.button`
  display: grid;
  place-items: center;
  width: 24px;
  height: 24px;
  border-radius: 4px;
  background: #d9d9d9;
  color: #000;
  cursor: pointer;
  &[aria-pressed='true'] {
    background: #5aa997;
    color: #fff;
  }
  &:focus-visible {
    outline: 2px solid #367d70;
    outline-offset: 3px;
  }
`

export const Grid = styled.ul`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px 10px;
`

export const GridCard = styled.li`
  position: relative;
  min-width: 0;
`

export const GridFileButton = styled.button`
  display: flex;
  flex-direction: column;
  gap: 2px;
  width: 100%;
  min-width: 0;
  text-align: left;
  cursor: pointer;
  strong {
    width: 100%;
    margin-top: 6px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 12px;
    font-weight: 700;
  }
  small {
    color: #253f3b;
    font-size: 10px;
  }
`

export const Thumbnail = styled.span`
  position: relative;
  display: block;
  width: 100%;
  aspect-ratio: 170 / 102;
  overflow: hidden;
  border-radius: 8px;
  background: #e7eeeb;
`

export const ThumbnailImage = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const ThumbnailFallback = styled.span`
  display: grid;
  place-items: center;
  width: 100%;
  height: 100%;
`

export const ThumbnailLabel = styled.span`
  position: absolute;
  inset: auto 0 0;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 24px;
  padding: 0 8px;
  background: rgb(0 0 0 / 50%);
  color: #dfdfdf;
  font-size: 8px;
`

export const GridMore = styled.button`
  position: absolute;
  top: 4px;
  right: 4px;
  display: grid;
  place-items: center;
  width: 32px;
  height: 32px;
  border-radius: 4px;
  background: rgb(0 0 0 / 50%);
  cursor: pointer;
`
export const Card = styled.li`
  display: flex;
  align-items: center;
  min-height: 65px;
  padding: 8px 0 8px 14px;
  border: 1px solid white;
  border-radius: 16px;
  background: white;
  box-shadow: var(--shadow-app-bar);
`
export const FileButton = styled.button`
  display: flex;
  align-items: center;
  gap: 14px;
  flex: 1;
  min-width: 0;
  min-height: 47px;
  text-align: left;
  cursor: pointer;
  > img {
    flex-shrink: 0;
  }
  > span {
    min-width: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
  strong {
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    font-size: 14px;
    font-weight: 700;
  }
  small {
    font-size: 12px;
  }
`
export const More = styled.button`
  display: grid;
  place-items: center;
  flex-shrink: 0;
  width: 44px;
  height: 44px;
  margin-right: 0;
  cursor: pointer;
`
export const Empty = styled.p`
  padding: 50px 0;
  text-align: center;
  color: var(--color-muted);
  font-size: 14px;
`
export const ErrorText = styled.p`
  font-size: 13px;
  color: #bd3838;
  overflow-wrap: anywhere;
`
export const Action = styled.button<{ $danger?: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  min-height: 60px;
  width: 100%;
  padding: 0 14px;
  text-align: left;
  font-size: 16px;
  cursor: pointer;
  color: ${({ $danger }) => ($danger ? '#ff3b30' : '#253f3b')};
  ${({ $danger }) => $danger && 'border-top: 1px solid #d9d9d9; margin-top: 6px; padding-top: 6px; min-height: 66px;'}
  img {
    width: 20px;
    height: 20px;
  }
`

export const Generation = styled.select`
  width: 100%;
  min-height: 33px;
  border: 1px solid #d9d9d9;
  border-radius: 999px;
  background: #e7e7e7;
  text-align: center;
  color: #17251e;
  font-size: 13px;
  margin-bottom: -4px;
  cursor: pointer;
`
