import styled from 'styled-components'
import type { ReactNode } from 'react'
import { useNavigate } from 'react-router'
import backIcon from '../assets/navigation/back.svg'

type HeaderProps = {
  title: string
  variant?: 'default' | 'brand'
  showBack?: boolean
  onBack?: () => void
  align?: 'left' | 'center'
  rightAction?: ReactNode
}

export default function Header({
  title,
  variant = 'default',
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
    <HeaderRoot>
      <HeaderContent $align={align} $brand={variant === 'brand'}>
        {(showBack || align === 'center') && (
          <BackSlot>
            {showBack && (
              <BackButton type="button" aria-label="뒤로가기" onClick={handleBack}>
                <img src={backIcon} alt="" width={24} height={24} />
              </BackButton>
            )}
          </BackSlot>
        )}
        <Title $align={align} $brand={variant === 'brand'}>{title}</Title>
        {(align === 'center' || rightAction) && <RightAction>{rightAction}</RightAction>}
      </HeaderContent>
    </HeaderRoot>
  )
}

const HeaderRoot = styled.header`
  position: sticky;
  top: 0;
  z-index: 20;
  overflow: hidden;
  border-radius: 0 0 var(--radius-app-bar) var(--radius-app-bar);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  padding-top: env(safe-area-inset-top, 0px);
  box-shadow: var(--shadow-app-bar);
`

const HeaderContent = styled.div<{ $align: 'left' | 'center'; $brand: boolean }>`
  display: ${({ $align }) => $align === 'left' ? 'flex' : 'grid'};
  height: var(--spacing-header);
  align-items: center;
  border-bottom: 1px solid var(--color-divider);
  grid-template-columns: var(--spacing-header-slot) minmax(0, 1fr) var(--spacing-header-slot);
  padding-left: ${({ $align }) => $align === 'left' ? 'var(--spacing-page-x)' : '0'};
  padding-right: ${({ $align, $brand }) => $align === 'left' ? ($brand ? '6px' : 'var(--spacing-page-x)') : '0'};
`

const BackSlot = styled.div`
  display: flex;
  justify-content: center;
`

const BackButton = styled.button`
  display: flex;
  width: var(--spacing-touch-target);
  height: var(--spacing-touch-target);
  cursor: pointer;
  align-items: center;
  justify-content: center;
  border-radius: var(--radius-control);
`

const Title = styled.h1<{ $align: 'left' | 'center'; $brand: boolean }>`
  min-width: 0;
  flex: ${({ $align }) => $align === 'left' ? 1 : 'initial'};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: ${({ $align }) => $align};
  color: ${({ $brand }) => $brand ? 'var(--color-primary-strong)' : 'inherit'};
  font-size: ${({ $brand }) => $brand ? '24px' : 'var(--text-page-title)'};
  line-height: ${({ $brand }) => $brand ? 'normal' : 'var(--text-page-title--line-height)'};
  font-weight: ${({ $brand }) => $brand ? 800 : 'var(--font-weight-bold)'};
`

const RightAction = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`
