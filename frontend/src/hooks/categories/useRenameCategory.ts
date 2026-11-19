import { useRef, useState } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { isAxiosError } from 'axios'
import type { AxiosResponse } from 'axios'
import {
  renameMeetingCategory,
  renameScheduleCategory,
} from '../../api/categoryUpdates'
import {
  getListCategoriesQueryKey,
  getListCategories1QueryKey,
} from '../../api/generated'
import type { BaseResponseScheduleCategoryListResponse } from '../../api/models/baseResponseScheduleCategoryListResponse'
import type { CategoryOption } from '../../types/schedules/schedule'
import useOnboarding from '../onboarding/useOnboarding'

export default function useRenameCategory(kind: 'schedule' | 'meeting') {
  const client = useQueryClient()
  const { group } = useOnboarding()
  const [pending, setPending] = useState(false)
  const busy = useRef(false)

  async function rename(option: CategoryOption, label: string) {
    if (busy.current) return
    const id = Number(option.id)
    const termId = group?.termId
    const name = label.trim()
    if (!Number.isSafeInteger(id) || id <= 0 || !termId)
      throw new Error('카테고리와 기수 정보를 확인해주세요.')
    if (!name || name.length > 50)
      throw new Error('카테고리 이름을 1~50자로 입력해주세요.')
    if (name === option.label) return option
    busy.current = true
    setPending(true)
    try {
      const response = await (
        kind === 'schedule' ? renameScheduleCategory : renameMeetingCategory
      )(id, name)
      const body = response.data
      if (body.success !== true)
        throw new Error(body.message || '카테고리를 수정하지 못했어요.')
      const updated = body.data
      if (
        updated?.categoryId !== id ||
        typeof updated.name !== 'string' ||
        !updated.name.trim()
      ) {
        throw new Error('카테고리 수정 결과를 확인할 수 없어요.')
      }
      const queryKey =
        kind === 'schedule'
          ? getListCategories1QueryKey(termId)
          : getListCategoriesQueryKey(termId)
      client.setQueriesData<
        AxiosResponse<BaseResponseScheduleCategoryListResponse>
      >({ queryKey }, current =>
        current
          ? {
              ...current,
              data: {
                ...current.data,
                data: {
                  ...current.data.data,
                  categories: current.data.data?.categories?.map(item =>
                    item.categoryId === id ? updated : item,
                  ),
                },
              },
            }
          : current,
      )
      await client.invalidateQueries({
        predicate: query => {
          const first = query.queryKey[0]
          return (
            first === 'operation-records' ||
            first === 'home-calendar' ||
            (typeof first === 'string' &&
              /\/api\/(?:schedules\/|meetings\/|terms\/\d+\/(?:categories|meeting-categories|schedules|meetings))/.test(
                first,
              ))
          )
        },
      })
      return { ...option, label: updated.name }
    } catch (caught) {
      if (isAxiosError<{ message?: string }>(caught)) {
        throw new Error(
          caught.response?.data.message ||
            '카테고리를 수정하지 못했어요. 다시 시도해주세요.',
        )
      }
      throw caught
    } finally {
      busy.current = false
      setPending(false)
    }
  }
  return { rename, pending }
}
