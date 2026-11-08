import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import type { FooterItem } from './Footer'

type MainLayoutProps = {
  title: string
  showBack?: boolean
  footerItems?: readonly FooterItem[]
}

export default function MainLayout({
  title,
  showBack = true,
  footerItems,
}: MainLayoutProps) {
  return (
    <div
      className="
        mx-auto flex min-h-dvh w-full
        max-w-app flex-col bg-surface
      "
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:p-3"
      >
        본문 바로가기
      </a>

      <Header title={title} showBack={showBack} />

      <main
        id="main-content"
        className="flex-1 px-page-x pt-page-top pb-layout"
      >
        <Outlet />
      </main>

      <Footer items={footerItems} />
    </div>
  )
}