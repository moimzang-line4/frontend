import { isAxiosError } from 'axios'

import { useGetGroup } from '../../api/generated'
import useOnboarding from '../onboarding/useOnboarding'

export default function useCurrentGroup() {
  const { group } = useOnboarding()

  const groupId = group?.groupId

  const hasGroupId =
    typeof groupId === 'number' &&
    Number.isSafeInteger(groupId) &&
    groupId > 0

  const query = useGetGroup(hasGroupId ? groupId : 0, {
    query: {
      enabled: hasGroupId,
      staleTime: 60_000,
      retry: 1,

      select: response => {
        const body = response.data

        if (body.success !== true) {
          throw new Error(
            body.message || '그룹 정보를 불러오지 못했어요.',
          )
        }

        const data = body.data

        if (
          !data ||
          data.groupId !== groupId ||
          typeof data.name !== 'string' ||
          !data.name.trim()
        ) {
          throw new Error('서버의 그룹 정보를 확인할 수 없어요.')
        }

        return {
          ...data,
          name: data.name,
        }
      },
    },

    axios: {
      timeout: 15000,
    },
  })

  let errorMessage = ''
  const caught: unknown = query.error

  if (!hasGroupId) {
    errorMessage = '저장된 서버 그룹 ID가 없어요.'
  } else if (caught) {
    if (isAxiosError(caught)) {
      errorMessage = caught.response
        ? '그룹 정보를 불러오지 못했어요.'
        : '서버에 연결하지 못했어요. 네트워크 상태를 확인해주세요.'
    } else if (caught instanceof Error) {
      errorMessage = caught.message
    } else {
      errorMessage = '그룹 정보를 불러오지 못했어요.'
    }
  }

  return {
    group: query.data,
    loading: query.isLoading,
    refreshing: query.isFetching,
    errorMessage,
    canRetry: hasGroupId,
    reload: query.refetch,
  }
}