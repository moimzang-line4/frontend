import axios from 'axios'
import type { BaseResponseMeetingCategoryResponse } from './models/baseResponseMeetingCategoryResponse'
import type { BaseResponseScheduleCategoryResponse } from './models/baseResponseScheduleCategoryResponse'

// Hand-written adapters for the new Swagger endpoints; generated files stay untouched.
export const renameScheduleCategory = (id: number, name: string) =>
  axios.patch<BaseResponseScheduleCategoryResponse>(
    `https://api.chungs.store/api/categories/${id}`,
    { name },
    { timeout: 15000 },
  )

export const renameMeetingCategory = (id: number, name: string) =>
  axios.patch<BaseResponseMeetingCategoryResponse>(
    `https://api.chungs.store/api/meeting-categories/${id}`,
    { name },
    { timeout: 15000 },
  )
