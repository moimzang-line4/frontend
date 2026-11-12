export type OperationRecord = {
  id: string
  kind: 'schedule' | 'minute'
  title: string
  date: string
  createdAt: string
  past: boolean
}
export type OperationFilter = 'all' | OperationRecord['kind']

export type OperationSort = 'upcoming' | 'latest' | 'earliest' | 'name'
