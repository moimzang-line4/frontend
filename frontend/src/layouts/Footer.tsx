import { NavLink } from 'react-router'
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
  return (
    <footer
      className="
        fixed bottom-0 left-1/2 z-30
        w-full max-w-app -translate-x-1/2
        bg-surface pb-safe
      "
    >
      <div className="relative h-footer">
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-x-0
            -top-footer-curve h-footer-background overflow-hidden
          "
        >
          <img
            src={background}
            alt=""
            width={390}
            height={98}
            className="absolute left-1/2 max-w-none -translate-x-1/2"
          />
        </div>

        <nav
          aria-label="하단 메뉴"
          className="relative grid grid-cols-5"
        >
          {items.map(({ label, to, icon, activeIcon, activeIconSize = 22, elevated, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) =>
                elevated
                  ? `
                    relative -top-footer-offset
                    flex size-ai-button flex-col
                    items-center justify-center justify-self-center
                    gap-0.5 rounded-ai bg-ai-gradient
                    text-nav-ai font-bold text-white drop-shadow-ai
                  `
                  : `
                    mt-footer-offset flex h-footer-item min-w-0
                    flex-col items-center justify-center
                    gap-1 rounded-control text-nav
                    ${
                      isActive
                        ? 'font-bold text-primary-strong'
                        : 'font-regular text-muted'
                    }
                  `
              }
            >
              {({ isActive }) => (
                <>
                  <span className="flex size-icon shrink-0 items-center justify-center">
                    <img
                      src={isActive && activeIcon ? activeIcon : icon}
                      alt=""
                      width={isActive && activeIcon ? activeIconSize : 22}
                      height={isActive && activeIcon ? activeIconSize : 22}
                      className="shrink-0"
                    />
                  </span>
                  <span className="whitespace-nowrap">{label}</span>
                </>
              )}
            </NavLink>
          ))}
        </nav>
      </div>
    </footer>
  )
}
