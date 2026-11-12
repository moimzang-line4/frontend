import { TabList } from '../styles/members/MemberTabs.styles'
import { SegmentTab } from '../styles/SegmentTabs.styles'

type Props<T extends string> = {
  label: string
  tabs: readonly { id: T; label: string }[]
  value: T
  onChange: (id: T) => void
  // 맨 끝에 붙는 보조 버튼 (예: '+ 차수 추가')
  extra?: { label: string; onClick: () => void }
}

// 화면 안에서 전환하는 세그먼트 탭 (주소 이동은 RouteTabs)
export default function SegmentTabs<T extends string>({ label, tabs, value, onChange, extra }: Props<T>) {
  return (
    <TabList role="tablist" aria-label={label}>
      {tabs.map(tab => (
        <SegmentTab
          key={tab.id}
          type="button"
          role="tab"
          aria-selected={value === tab.id}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </SegmentTab>
      ))}
      {extra && (
        <SegmentTab type="button" onClick={extra.onClick}>
          {extra.label}
        </SegmentTab>
      )}
    </TabList>
  )
}
