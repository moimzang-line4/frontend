import { Tab, TabList } from '../styles/members/MemberTabs.styles'

type Props = {
  label: string
  tabs: readonly { label: string; to: string }[]
}

// 주소로 이동하는 세그먼트 탭 (명단방 탭과 같은 디자인)
export default function RouteTabs({ label, tabs }: Props) {
  return (
    <TabList aria-label={label}>
      {tabs.map(tab => (
        <Tab key={tab.to} to={tab.to} end replace>
          {tab.label}
        </Tab>
      ))}
    </TabList>
  )
}
