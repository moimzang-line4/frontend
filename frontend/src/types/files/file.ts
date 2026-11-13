export const fileCategories = ['활동 문서', '예산안', '활동사진'] as const
export type FileCategory = typeof fileCategories[number]
export type ScheduleFile = {
  id: string
  scheduleId: string
  name: string
  category: FileCategory
  createdAt: number
  blob: Blob
}
