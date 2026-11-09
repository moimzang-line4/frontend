import styled from 'styled-components'
import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import type { FooterItem } from './Footer'

type MainLayoutProps = {
  title: string
  showBack?: boolean
  footerItems?: readonly FooterItem[]
  headerAlign?: 'left' | 'center'
}

export default function MainLayout({
  title,
  showBack = true,
  footerItems,
  headerAlign = 'center',
}: MainLayoutProps) {
  return (
    <LayoutRoot>
      <SkipLink href="#main-content">본문 바로가기</SkipLink>
      <Header title={title} showBack={showBack} align={headerAlign} />
      <Content id="main-content"><Outlet /></Content>
      <Footer items={footerItems} />
    </LayoutRoot>
  )
}

const LayoutRoot = styled.div`
  margin-inline: auto;
  display: flex;
  min-height: 100dvh;
  width: 100%;
  max-width: var(--container-app);
  flex-direction: column;
  background: var(--color-surface);
`

const SkipLink = styled.a`
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
  &:focus {
    position: static;
    width: auto;
    height: auto;
    padding: 12px;
    margin: 0;
    overflow: visible;
    clip: auto;
    white-space: normal;
  }
`

const Content = styled.main`
  flex: 1;
  padding-inline: var(--spacing-page-x);
  padding-top: var(--spacing-page-top);
  padding-bottom: calc(var(--spacing-content-bottom) + env(safe-area-inset-bottom, 0px));
`
