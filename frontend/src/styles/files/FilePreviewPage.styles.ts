import styled from 'styled-components'

export const Page = styled.div`
  min-height: 100dvh; width: 100%; max-width: var(--container-app); margin-inline: auto;
  background: var(--color-page-background); color: #253f3b; padding-bottom: env(safe-area-inset-bottom, 0px);
`
export const Header = styled.header`
  position: sticky; top: 0; z-index: 20; display: flex; align-items: center; min-height: 56px;
  padding: env(safe-area-inset-top, 0px) 6px 0; background: white; box-shadow: var(--shadow-app-bar);
  h1 { flex: 1; min-width: 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; font-size: 15px; font-weight: 700; }
`
export const IconButton = styled.button`
  display: grid; place-items: center; width: 44px; height: 44px; flex-shrink: 0; cursor: pointer;
  &:disabled { opacity: .4; cursor: default; }
`
export const Main = styled.main`padding: 16px 20px 30px;`
export const Info = styled.p`display: flex; align-items: center; min-height: 42px; margin-bottom: 6px; color: #78918c; font-size: 12px;`
export const Paper = styled.div`
  min-height: 510px; padding: 32px 25px; border: 1px solid #dee7e3; background: white;
  h2 { margin-bottom: 18px; font-size: 20px; line-height: 26px; font-weight: 700; overflow-wrap: anywhere; }
  pre { white-space: pre-wrap; overflow-wrap: anywhere; font: inherit; font-size: 13px; line-height: 26px; }
  p { font-size: 13px; line-height: 26px; margin-bottom: 16px; overflow-wrap: anywhere; }
`
export const Media = styled.div`
  display: flex; justify-content: center; align-items: center; min-height: 350px;
  padding: 12px; border: 1px solid #dee7e3; background: white;
  img, video { width: 100%; max-height: 70dvh; object-fit: contain; }
  audio { width: 100%; }
`
export const Notice = styled.p`padding: 30px 0; font-size: 14px; line-height: 24px; color: #647269; overflow-wrap: anywhere;`
export const Pager = styled.div`
  display: flex; gap: 16px; align-items: center; justify-content: center; min-height: 40px; margin-top: 18px;
  color: #78918c; font-size: 12px;
  button { min-width: 44px; min-height: 40px; color: #367d70; cursor: pointer; }
  button:disabled { opacity: .35; cursor: default; }
`
export const CanvasFrame = styled.div`
  border: 1px solid #dee7e3; background: white; min-height: 200px;
  canvas { display: block; width: 100%; height: auto; }
`
export const Sections = styled.select`
  width: 100%; padding: 10px 12px; margin-bottom: 12px; border: 1px solid #dee7e3;
  border-radius: 10px; background: white; font-size: 13px;
`
export const TableScroll = styled.div`
  width: 100%; max-height: 65dvh; overflow: auto; background: white; border: 1px solid #dee7e3;
  table { border-collapse: collapse; font-size: 12px; min-width: 100%; }
  td { min-width: 80px; padding: 10px; border: 1px solid #dee7e3; white-space: pre-wrap; max-width: 250px; overflow-wrap: anywhere; }
`
