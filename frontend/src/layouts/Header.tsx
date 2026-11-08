import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import backIcon from '../assets/navigation/back.svg'

type HeaderProps = {
  title: string
  showBack?: boolean
  onBack?: () => void
  rightAction?: ReactNode
}

export default function Header({ title, showBack = true, onBack, rightAction }: HeaderProps) {
  const navigate = useNavigate()

  function handleBack() {
    if (onBack) onBack()
    else if (window.history.state?.idx > 0) navigate(-1)
    else navigate('/')
  }

  return (
    <header className="sticky top-0 z-20 overflow-hidden rounded-b-app-bar border border-border bg-surface pt-[env(safe-area-inset-top)] shadow-app-bar">
      <div className="grid h-14 grid-cols-[56px_minmax(0,1fr)_56px] items-center border-b border-divider">
        <div className="flex justify-center">
          {showBack && (
            <button type="button" aria-label="뒤로가기" onClick={handleBack} className="flex size-11 cursor-pointer items-center justify-center rounded-lg">
              <img src={backIcon} alt="" width={24} height={24} />
            </button>
          )}
        </div>
        <h1 className="truncate text-center text-page-title font-bold">{title}</h1>
        <div className="flex items-center justify-center">{rightAction}</div>
      </div>
    </header>
  )
}
