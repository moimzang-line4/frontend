import { NavLink } from 'react-router'
import background from '../assets/navigation/tab-bar.svg'
import homeIcon from '../assets/navigation/home.svg'
import usersIcon from '../assets/navigation/users.svg'
import aiIcon from '../assets/navigation/ai.svg'
import opsIcon from '../assets/navigation/ops.svg'
import filesIcon from '../assets/navigation/files.svg'

export type FooterItem = {
  label: string
  to: string
  icon: string
  elevated?: boolean
  end?: boolean
}

const defaultFooterItems: readonly FooterItem[] = [
  { label: '홈', to: '/', icon: homeIcon, end: true },
  { label: '부원', to: '/members', icon: usersIcon },
  { label: 'AI', to: '/ai', icon: aiIcon, elevated: true },
  { label: '운영 공간', to: '/operations', icon: opsIcon },
  { label: '문서함', to: '/files', icon: filesIcon },
]

type FooterProps = { items?: readonly FooterItem[] }

export default function Footer({ items = defaultFooterItems }: FooterProps) {
  return (
    <footer className="fixed bottom-0 left-1/2 z-30 w-full max-w-app -translate-x-1/2 bg-surface pb-[env(safe-area-inset-bottom)]">
      <div className="relative h-[83px]">
        <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 -top-3 h-[95px] overflow-hidden">
          <img src={background} alt="" width={390} height={95} className="absolute left-1/2 max-w-none -translate-x-1/2" />
        </div>
        <nav aria-label="하단 메뉴" className="relative grid grid-cols-5">
          {items.map(({ label, to, icon, elevated, end }) => (
            <NavLink key={to} to={to} end={end} className={({ isActive }) =>
              elevated
                ? 'relative -top-[9px] flex size-[60px] flex-col items-center justify-center justify-self-center gap-0.5 rounded-full bg-primary text-nav-ai font-bold text-white drop-shadow-ai'
                : `mt-[9px] flex h-[50px] min-w-0 flex-col items-center justify-center gap-1 rounded-lg text-nav ${isActive ? 'font-bold text-primary-strong' : 'font-normal text-muted'}`
            }>
              <img src={icon} alt="" width={22} height={22} />
              <span className="whitespace-nowrap">{label}</span>
            </NavLink>
          ))}
        </nav>
      </div>
    </footer>
  )
}
