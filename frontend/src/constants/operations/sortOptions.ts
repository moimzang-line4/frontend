import type { OperationSort } from '../../types/operations/operation'

export const sortLabels: Record<OperationSort, string> = {
  upcoming: '다가오는순', latest: '최신순', earliest: '오래된순', name: '이름순',
}
export const sortOptions: { value: OperationSort; description: string }[] = [
  { value: 'upcoming', description: '일정이 가까운 순서' },
  { value: 'latest', description: '최근 등록한 기록부터' },
  { value: 'earliest', description: '먼저 등록한 기록부터' },
  { value: 'name', description: '가나다순' },
]
