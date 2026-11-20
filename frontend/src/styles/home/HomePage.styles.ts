import styled from 'styled-components'

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

export const EmptyMessage = styled.p`
  font-size: 13px;
  color: var(--color-muted);
  padding-block: 12px;
`

export const UpcomingSection = styled.section`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 20px;
`
export const UpcomingEmpty = styled(EmptyMessage)`
  display: flex;
  min-height: 140px;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 24px 12px;
`

export const CalendarTitle = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  min-width: 0;
  gap: 4px;
  font-size: 17px;
  line-height: 1.4;
  font-weight: 700;
  > span { flex-shrink: 0; white-space: nowrap; }
`
