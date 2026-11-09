import styled from 'styled-components'
import type { ScheduleCategory } from '../../types/home/schedule'

export const Calendar = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding-top: 15px;
  border-radius: var(--radius-app-bar);
  background: var(--color-surface);
`
export const MonthNavigation = styled.div`
  display: flex;
  height: 30px;
  align-items: center;
  justify-content: center;
  gap: 8px;
`
export const Month = styled.h3`
  color: var(--color-muted);
  font-size: 14px;
  font-weight: 600;
  line-height: 1.4;
`
export const MonthButton = styled.button<{ $previous?: boolean }>`
  display: flex;
  width: 16px;
  height: 30px;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  img { transform: ${({ $previous }) => $previous ? 'scaleX(-1)' : 'none'}; }
`
export const Weekdays = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  height: 20px;
  font-size: 11px;
  line-height: 1.4;
  > span { display: flex; align-items: center; justify-content: center; }
`
export const Days = styled.div`
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  row-gap: 8px;
`
export const DayCell = styled.div<{ $eventCount: number }>`
  display: flex;
  min-width: 0;
  height: ${({ $eventCount }) => $eventCount > 2 ? 'auto' : '39px'};
  min-height: 39px;
  > button { flex-shrink: 0; }
  flex-direction: column;
  align-items: center;
  padding-top: 4px;
  gap: 2px;
`
export const DayButton = styled.button<{ $selected: boolean }>`
  font-size: 11px;
  font-weight: var(--font-weight-bold);
  line-height: 1.4;
  padding: ${({ $selected }) => $selected ? '0.5px 2px' : '0'};
  color: ${({ $selected }) => $selected ? 'white' : 'inherit'};
  background: ${({ $selected }) => $selected ? 'linear-gradient(119.96deg, #438b7e 10.022%, #96cebc 131.72%)' : 'transparent'};
  border-radius: 999px;
  cursor: pointer;
`
const categoryColors: Record<ScheduleCategory, string> = {
  meeting: 'var(--color-calendar-meeting)', session: 'var(--color-calendar-session)', performance: 'var(--color-calendar-performance)', newcomer: 'var(--color-calendar-newcomer)',
}
export const EventBadge = styled.button<{ $category: ScheduleCategory }>`
  width: 40px;
  max-width: calc(100% - 4px);
  padding-inline: 2px;
  border-radius: 5px;
  background: ${({ $category }) => categoryColors[$category]};
  color: ${({ $category }) => $category === 'performance' ? 'var(--color-primary-strong)' : 'inherit'};
  font-size: 8px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
`
export const SelectionStatus = styled.p`
  position: absolute;
  width: 1px;
  height: 1px;
  overflow: hidden;
  clip-path: inset(50%);
`
