import styled from 'styled-components'

export const Header = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  padding-top: env(safe-area-inset-top, 0px);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-home-divider);
`
export const HeaderRow = styled.div`
  height: var(--spacing-header);
  padding: 0 6px 0 var(--spacing-page-x);
  display: flex;
  align-items: center;
  justify-content: space-between;
`
export const Brand = styled.h1`
  color: var(--color-primary-strong);
  font-size: 24px;
  font-weight: 800;
  line-height: normal;
`
export const SettingsButton = styled.button`
  display: flex;
  width: var(--spacing-touch-target);
  height: var(--spacing-touch-target);
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border-radius: var(--radius-control);
`
export const Content = styled.div`
  display: flex;
  flex-direction: column;
  gap: 7px;
  padding: 18px var(--spacing-page-x) 28px;
  background: var(--color-page-background);
  color: var(--color-home-ink);
  line-height: 1.4;
`
export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  min-height: 33px;
  gap: 8px;
`
export const Heading = styled.h2`
  font-size: 17px;
  line-height: 1.4;
  font-weight: var(--font-weight-bold);
`
export const AddButton = styled.button`
  color: var(--color-primary-strong);
  font-size: 12px;
  font-weight: var(--font-weight-bold);
  white-space: nowrap;
  cursor: pointer;
`
export const StorageNotice = styled.p`
  font-size: 12px;
  color: #a33b30;
`
