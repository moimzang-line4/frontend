export const fileCategories = ['활동 문서', '예산·회계', '활동사진'] as const
export type FileCategory = typeof fileCategories[number]
export type ScheduleFile = {
  id: string
  scheduleId: string
  name: string
  category: FileCategory
  createdAt: number
  // 서버 파일 크기(byte). 내용은 필요할 때 fetchFileBlob으로 받아옴
  size: number
  mimeType?: string
}
