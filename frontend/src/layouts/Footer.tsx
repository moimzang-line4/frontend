import styled, { css } from 'styled-components'
import { NavLink, useLocation } from 'react-router'
import background from '../assets/navigation/tab-bar.svg'
import homeIcon from '../assets/navigation/home.svg'
import homeInactiveIcon from '../assets/navigation/home-inactive.svg'
import usersIcon from '../assets/navigation/users.svg'
import usersActiveIcon from '../assets/navigation/users-active.svg'
import aiIcon from '../assets/navigation/ai.svg'
import opsIcon from '../assets/navigation/ops.svg'
import opsActiveIcon from '../assets/navigation/ops-active.svg'
import filesIcon from '../assets/navigation/files.svg'
import filesActiveIcon from '../assets/navigation/files-active.svg'

export type FooterItem = {
  label: string
  to: string
  icon: string
  activeIcon?: string
  activeIconSize?: number
  elevated?: boolean
  end?: boolean
}

const defaultFooterItems: readonly FooterItem[] = [
  { label: '홈', to: '/', icon: homeInactiveIcon, activeIcon: homeIcon, end: true },
  { label: '부원', to: '/members', icon: usersIcon, activeIcon: usersActiveIcon },
  { label: 'AI', to: '/ai', icon: aiIcon, elevated: true },
  { label: '운영 공간', to: '/operations', icon: opsIcon, activeIcon: opsActiveIcon },
  { label: '문서함', to: '/files', icon: filesIcon, activeIcon: filesActiveIcon, activeIconSize: 19 },
]

type FooterProps = {
  items?: readonly FooterItem[]
}

export default function Footer({
  items = defaultFooterItems,
}: FooterProps) {
  const { pathname } = useLocation()
  const scheduleSection = pathname.startsWith('/schedules/') && pathname !== '/schedules/new'
  return (
    <FooterRoot>
      <FooterContent>
        <BackgroundSlot aria-hidden="true">
          <Background src={background} alt="" width={390} height={98} />
        </BackgroundSlot>
        <Navigation aria-label="하단 메뉴">
          {items.map(({ label, to, icon, activeIcon, activeIconSize = 22, elevated, end }) => (
            <MenuLink key={to} to={to} end={end} data-section-active={to === '/operations' && scheduleSection} $elevated={Boolean(elevated)}>
              {({ isActive }) => (
                <>
                  <IconSlot>
                    <Icon
                      src={(isActive || (to === '/operations' && scheduleSection)) && activeIcon ? activeIcon : icon}
                      alt=""
                      width={(isActive || (to === '/operations' && scheduleSection)) && activeIcon ? activeIconSize : 22}
                      height={(isActive || (to === '/operations' && scheduleSection)) && activeIcon ? activeIconSize : 22}
                    />
                  </IconSlot>
                  <Label>{label}</Label>
                </>
              )}
            </MenuLink>
          ))}
        </Navigation>
      </FooterContent>
    </FooterRoot>
  )
}

const FooterRoot = styled.footer`
  position: fixed;
  bottom: 0;
  left: 50%;
  z-index: 30;
  width: 100%;
  max-width: var(--container-app);
  transform: translateX(-50%);
  background: var(--color-surface);
  padding-bottom: env(safe-area-inset-bottom, 0px);
`

const FooterContent = styled.div`
  position: relative;
  height: var(--spacing-footer);
`

const BackgroundSlot = styled.div`
  pointer-events: none;
  position: absolute;
  inset-inline: 0;
  top: calc(-1 * var(--spacing-footer-curve));
  height: var(--spacing-footer-background);
  overflow: hidden;
`

const Background = styled.img`
  position: absolute;
  left: 50%;
  max-width: none;
  transform: translateX(-50%);
`

const Navigation = styled.nav`
  position: relative;
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
`

const MenuLink = styled(NavLink)<{ $elevated: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  ${({ $elevated }) => $elevated ? css`
    position: relative;
    top: calc(-1 * var(--spacing-footer-offset) + 4px);
    width: var(--spacing-ai-button);
    height: var(--spacing-ai-button);
    justify-self: center;
    gap: 2px;
    border-radius: var(--radius-ai);
    background-image: linear-gradient(126.87deg, var(--color-button-start) 10.714%, var(--color-button-end) 82.143%);
    font-size: var(--text-nav-ai);
    line-height: var(--text-nav-ai--line-height);
    font-weight: var(--font-weight-bold);
    color: white;
    filter: drop-shadow(var(--drop-shadow-ai));
  ` : css`
    margin-top: var(--spacing-footer-offset);
    height: var(--spacing-footer-item);
    min-width: 0;
    gap: 4px;
    border-radius: var(--radius-control);
    font-size: var(--text-nav);
    line-height: var(--text-nav--line-height);
    font-weight: var(--font-weight-regular);
    color: var(--color-muted);
    &[aria-current='page'], &[data-section-active='true'] {
      font-weight: var(--font-weight-bold);
      color: var(--color-primary-strong);
    }
  `}
`

const IconSlot = styled.span`
  display: flex;
  width: var(--spacing-icon);
  height: var(--spacing-icon);
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
`

const Icon = styled.img`
  flex-shrink: 0;
`

const Label = styled.span`
  white-space: nowrap;
`
