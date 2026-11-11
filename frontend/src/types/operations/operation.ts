export type OperationRecord = {
  id: string
  kind: 'schedule' | 'minute'
  title: string
  date: string
  past: boolean
}
export type OperationFilter = 'all' | OperationRecord['kind']
