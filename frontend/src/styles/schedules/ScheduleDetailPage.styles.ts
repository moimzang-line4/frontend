import styled from 'styled-components'
import { Link } from 'react-router'

export const Page = styled.div`
  width: 100%;
  max-width: var(--container-app);
  min-height: 100dvh;
  margin-inline: auto;
  padding-bottom: calc(107px + env(safe-area-inset-bottom, 0px));
  background: var(--color-page-background);
  color: #19251f;
`
export const Hero = styled.header`
  position: relative;
  min-height: 183px;
  overflow: hidden;
`
export const HeroBackground = styled.img`
  position: absolute;
  top: -28px;
  right: 0;
  max-width: none;
  pointer-events: none;
`
export const HeroNavigation = styled.div`
  position: relative;
  display: flex;
  height: 56px;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  padding: 0 20px;
  border-bottom: 1px solid rgb(255 255 255 / 40%);
`
export const Brand = styled(Link)`
  color: white;
  font-size: 24px;
  font-weight: 700;
`
export const EditLink = styled(Link)`
  color: #e45c55;
  font-size: 12px;
  line-height: 1.4;
  font-weight: 700;
`
export const Metadata = styled.div`
  position: relative;
  display: flex;
  max-width: calc(100% - 165px);
  flex-direction: column;
  gap: 3px;
  margin: 21px 0 0 27px;
  color: white;
  line-height: 1.4;
`
export const Date = styled.p`
  font-size: 12px;
  font-weight: 500;
`
export const Title = styled.h1`
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
  font-size: 20px;
  font-weight: 700;
`
export const TimeVenue = styled.p`
  font-size: 14px;
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
`
export const Countdown = styled.p<{ $length: number }>`
  position: absolute;
  right: 0;
  bottom: 21px;
  width: 136px;
  text-align: center;
  white-space: nowrap;
  color: #5fa192;
  font-family: var(--font-sans);
  font-size: ${({ $length }) => $length > 8 ? '20px' : $length > 6 ? '24px' : '32px'};
  font-variant-numeric: tabular-nums;
  letter-spacing: 0;
  line-height: 24px;
  font-weight: 800;
`
export const Content = styled.main`
  padding: 25px 20px 20px;
`
export const MenuGrid = styled.nav`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
`
export const MenuCard = styled(Link)`
  position: relative;
  min-height: 142px;
  padding: 14px 13px;
  border: 1px solid white;
  border-radius: var(--radius-app-bar);
  background: white;
  box-shadow: var(--shadow-app-bar);
  h2 { font-size: 16px; font-weight: 700; line-height: 1.4; }
  p { color: #68736d; font-size: 12px; line-height: 1.4; }
`
export const MenuImage = styled.img<{ $right: number; $bottom: number }>`
  position: absolute;
  right: ${({ $right }) => $right}px;
  bottom: ${({ $bottom }) => $bottom}px;
`
export const MeetingSection = styled.section`
  margin-top: 22px;
`
export const SectionHeading = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  h2 { font-size: 17px; line-height: 1.4; font-weight: 700; }
`
export const TextButton = styled.button`
  color: #367d70;
  font-size: 12px;
  font-weight: 700;
  cursor: pointer;
`
export const Empty = styled.div`
  margin-top: 22px;
  text-align: center;
  line-height: 1.4;
  h3 { color: #8c8c8c; font-size: 14px; font-weight: 700; }
  p { margin-top: 4px; color: #b3b3b3; font-size: 12px; font-weight: 500; }
`
export const FindButton = styled.button`
  display: flex;
  width: 100%;
  min-height: 44px;
  margin-top: 26px;
  align-items: center;
  justify-content: center;
  border: 1px solid #d8e6e0;
  border-radius: 12px;
  background: white;
  color: var(--color-primary-strong);
  font-size: 14px;
  font-weight: 700;
  filter: drop-shadow(0 5px 7px rgb(63 141 124 / 17%));
  cursor: pointer;
`
export const MeetingList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-top: 16px;
`
export const MeetingButton = styled.button`
  width: 100%;
  padding: 14px;
  border: 1px solid var(--color-border);
  border-radius: 12px;
  background: white;
  font-size: 14px;
  text-align: left;
  overflow-wrap: anywhere;
  cursor: pointer;
`
export const Notice = styled.div`
  padding: 24px 20px;
  h1 { margin-bottom: 12px; font-size: 20px; font-weight: 700; }
  p { margin-bottom: 20px; color: var(--color-muted); font-size: 14px; }
  a { color: var(--color-primary-strong); text-decoration: underline; }
`
export const RecordContent = styled.p`
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  font-size: 14px;
  line-height: 1.6;
`
export const Textarea = styled.textarea`
  width: 100%;
  min-height: 160px;
  padding: 10px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-control);
  font-size: 14px;
`
