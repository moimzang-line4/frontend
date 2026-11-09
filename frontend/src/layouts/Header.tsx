import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import backIcon from '../assets/navigation/back.svg'

type HeaderProps = {
  title: string
  showBack?: boolean
  onBack?: () => void
  align?: 'left' | 'center'
  rightAction?: ReactNode
}

export default function Header({
  title,
  showBack = true,
  onBack,
  align = 'center',
  rightAction,
}: HeaderProps) {
  const navigate = useNavigate()

  function handleBack() {
    if (onBack) {
      onBack()
      return
    }

    if (window.history.state?.idx > 0) {
      navigate(-1)
      return
    }

    navigate('/')
  }

  return (
    <header
      className="
        sticky top-0 z-20 overflow-hidden
        rounded-b-app-bar border border-border
        bg-surface pt-safe shadow-app-bar
      "
    >
      <div
        className={
          align === 'left'
            ? 'flex h-header items-center border-b border-divider px-page-x'
            : 'grid h-header grid-cols-header items-center border-b border-divider'
        }
      >
        {showBack && (
          <div className="flex justify-center">
            <button
              type="button"
              aria-label="뒤로가기"
              onClick={handleBack}
              className="
                flex size-touch-target cursor-pointer
                items-center justify-center rounded-control
              "
            >
              <img
                src={backIcon}
                alt=""
                width={24}
                height={24}
              />
            </button>
          </div>
        )}

        <h1
          className={
            align === 'left'
              ? 'truncate text-left text-page-title font-bold'
              : 'truncate text-center text-page-title font-bold'
          }
        >
          {title}
        </h1>

        {align === 'center' && (
          <div className="flex items-center justify-center">
            {rightAction}
          </div>
        )}
      </div>
    </header>
  )
}