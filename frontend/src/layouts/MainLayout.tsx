import { Outlet } from 'react-router'
import Header from './Header'
import Footer from './Footer'
import type { FooterItem } from './Footer'

type MainLayoutProps = {
  title: string
  showBack?: boolean
  showFooter?: boolean
  footerItems?: readonly FooterItem[]
  headerAlign?: 'left' | 'center'
}

export default function MainLayout({
  title,
  showBack = true,
  showFooter = true,
  footerItems,
  headerAlign = 'center',
}: MainLayoutProps) {
  return (
    <div
      className="
        mx-auto flex min-h-dvh w-full
        max-w-app flex-col bg-[#F7F8FA]
      "
    >
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:p-3"
      >
        본문 바로가기
      </a>

      <Header
        title={title}
        showBack={showBack}
        align={headerAlign}
      />

      <main
        id="main-content"
        className={`flex-1 min-h-0 px-page-x pt-page-top ${
          showFooter ? 'pb-layout' : 'pb-0'
        }`}
      >
        <Outlet />
      </main>

      {showFooter && <Footer items={footerItems} />}
    </div>
  )
}