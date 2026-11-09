import type { CategoryOption } from '../../types/schedules/schedule'
import color1 from '../../assets/schedules/color-1.svg'
import color2 from '../../assets/schedules/color-2.svg'
import color3 from '../../assets/schedules/color-3.svg'
import color4 from '../../assets/schedules/color-4.svg'
import color5 from '../../assets/schedules/color-5.svg'
import color6 from '../../assets/schedules/color-6.svg'
import color7 from '../../assets/schedules/color-7.svg'
import color8 from '../../assets/schedules/color-8.svg'

export const defaultCategories: CategoryOption[] = [
  { id: 'performance', label: '공연', kind: 'performance' },
  { id: 'afterparty', label: '뒤풀이', kind: 'afterparty' },
  { id: 'meeting', label: '정기회의', kind: 'meeting' },
]
export const scheduleColors = [
  { label: '빨강', value: '#e86159', icon: color1 },
  { label: '주황', value: '#f2a74b', icon: color2 },
  { label: '노랑', value: '#e7cb58', icon: color3 },
  { label: '초록', value: '#5fbf92', icon: color4 },
  { label: '하늘', value: '#60b7c7', icon: color5 },
  { label: '파랑', value: '#6898e5', icon: color6 },
  { label: '보라', value: '#a38add', icon: color7 },
  { label: '분홍', value: '#d68eb5', icon: color8 },
]
