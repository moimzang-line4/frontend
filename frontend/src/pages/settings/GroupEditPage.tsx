import { useRef, useState } from 'react'
import type { FormEvent } from 'react'
import { isAxiosError } from 'axios'
import { Navigate } from 'react-router'
import { useQueryClient } from '@tanstack/react-query'

import Header from '../../layouts/Header'
import Button from '../../components/Button'

import {
  getGetGroupQueryKey,
  useUpdateGroup,
} from '../../api/generated'

import type { GroupUpdateResponse } from '../../api/models/groupUpdateResponse'

import useSettingsBack from '../../hooks/settings/useSettingsBack'
import useOnboarding from '../../hooks/onboarding/useOnboarding'
import useCurrentGroup from '../../hooks/groups/useCurrentGroup'

import * as S from '../../styles/settings/SettingsPage.styles'
import * as M from '../../styles/settings/ManagementPage.styles'

export default function GroupEditPage() {
  const backToSettings = useSettingsBack('/settings')
  const queryClient = useQueryClient()

  const onboarding = useOnboarding()
  const currentGroup = useCurrentGroup()

  const mutation = useUpdateGroup({
    mutation: {
      retry: false,
    },
    axios: {
      timeout: 15000,
    },
  })

  const [editedName, setEditedName] = useState<string | null>(null)
  const [newTermName, setNewTermName] = useState('')
  const [pending, setPending] = useState(false)
  const [error, setError] = useState('')

  const busy = useRef(false)

  // 서버 저장 후 브라우저 저장만 실패했을 때,
  // 재시도로 새 기수가 중복 생성되지 않도록 보관해요.
  const completed = useRef<{
    key: string
    data: GroupUpdateResponse
  } | null>(null)

  const group = onboarding.group
  const serverName = currentGroup.group?.name ?? ''
  const name = editedName ?? serverName

  const selectedTerm = currentGroup.group?.terms?.find(
    term => term.termId === group?.termId,
  )

  const currentTermName =
    selectedTerm?.name ?? group?.generation ?? ''

  const ready =
    !!currentGroup.group &&
    !currentGroup.loading &&
    !currentGroup.errorMessage

  const changed =
    name.trim() !== serverName ||
    newTermName.trim().length > 0

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!group || !ready || !name.trim() || busy.current) {
      return
    }

    const groupId = group.groupId

    if (
      typeof groupId !== 'number' ||
      !Number.isSafeInteger(groupId) ||
      groupId <= 0
    ) {
      setError('저장된 그룹 ID가 없어요.')
      return
    }

    busy.current = true
    setPending(true)
    setError('')

    const nextName = name.trim()
    const addedTermName = newTermName.trim()

    const request = {
      name: nextName,
      ...(addedTermName
        ? { termName: addedTermName }
        : {}),
    }

    const key = JSON.stringify({
      groupId,
      request,
    })

    try {
      let saved =
        completed.current?.key === key
          ? completed.current.data
          : undefined

      if (!saved) {
        const response = await mutation.mutateAsync({
          groupId,
          data: request,
        })

        const body = response.data

        if (
          body.success !== true ||
          !body.data ||
          body.data.groupId !== groupId ||
          typeof body.data.name !== 'string' ||
          !body.data.name.trim()
        ) {
          throw new Error(
            body.message || '그룹 수정 결과를 확인할 수 없어요.',
          )
        }

        saved = body.data

        completed.current = {
          key,
          data: saved,
        }
      }

      const savedName = saved.name

      if (
        typeof savedName !== 'string' ||
        !savedName.trim()
      ) {
        throw new Error('수정된 그룹명을 확인할 수 없어요.')
      }

      // 그룹명만 수정했다면 현재 선택한 기수를 유지해요.
      let termId = group.termId
      let generation = group.generation

      if (addedTermName) {
        const returnedTermId = saved.termId
        const returnedTermName = saved.termName

        if (
          typeof returnedTermId !== 'number' ||
          !Number.isSafeInteger(returnedTermId) ||
          returnedTermId <= 0 ||
          typeof returnedTermName !== 'string' ||
          !returnedTermName.trim()
        ) {
          throw new Error(
            '추가된 기수 정보를 확인할 수 없어요.',
          )
        }

        // 새 기수를 추가하면 그 기수를 선택해요.
        termId = returnedTermId
        generation = returnedTermName
      }

      onboarding.update({
        group: {
          ...group,
          name: savedName,
          shortName: savedName,
          termId,
          generation,
        },
      })

      await queryClient.invalidateQueries({
        queryKey: getGetGroupQueryKey(groupId),
      })

      backToSettings()
    } catch (caught) {
      if (isAxiosError<{ message?: unknown }>(caught)) {
        const message = caught.response?.data?.message

        setError(
          typeof message === 'string' && message.trim()
            ? message
            : caught.response
              ? '그룹 정보를 수정하지 못했어요.'
              : '서버에 연결하지 못했어요. 네트워크 상태를 확인해주세요.',
        )
      } else {
        setError(
          caught instanceof Error
            ? caught.message
            : '그룹 정보를 수정하지 못했어요.',
        )
      }
    } finally {
      busy.current = false
      setPending(false)
    }
  }

  if (!group) {
    return <Navigate to="/groups/new" replace />
  }

  return (
    <S.Page>
      <Header
        title="그룹 정보 수정"
        onBack={() => {
          if (!pending) backToSettings()
        }}
      />

      <S.Content>
        {currentGroup.loading && (
          <p role="status">
            그룹 정보를 불러오는 중이에요.
          </p>
        )}

        {currentGroup.errorMessage && (
          <div>
            <p role="alert">
              {currentGroup.errorMessage}
            </p>

            {currentGroup.canRetry && (
              <button
                type="button"
                disabled={currentGroup.refreshing}
                onClick={() => void currentGroup.reload()}
              >
                {currentGroup.refreshing
                  ? '불러오는 중…'
                  : '다시 불러오기'}
              </button>
            )}
          </div>
        )}

        {ready && (
          <M.EditForm
            id="group-edit"
            onSubmit={submit}
            style={{ marginTop: 0 }}
          >
            <label>
              <div>
                그룹명 <span aria-hidden="true">*</span>
              </div>

              <input
                aria-label="그룹명"
                required
                maxLength={100}
                value={name}
                disabled={pending}
                onChange={event =>
                  setEditedName(event.target.value)
                }
                placeholder="그룹명"
              />
            </label>

            <label>
              <div>현재 기수</div>

              <input
                aria-label="현재 기수"
                value={currentTermName}
                readOnly
              />
            </label>

            <label>
              <div>새 기수 추가 (선택)</div>

              <input
                aria-label="새 기수 추가"
                maxLength={100}
                value={newTermName}
                disabled={pending}
                onChange={event =>
                  setNewTermName(event.target.value)
                }
                placeholder="예) 13기"
              />
            </label>
          </M.EditForm>
        )}

        {error && <p role="alert">{error}</p>}
      </S.Content>

      <S.ActionBar>
        <Button
          type="submit"
          form="group-edit"
          disabled={
            !ready ||
            !name.trim() ||
            !changed ||
            pending
          }
        >
          {pending ? '저장 중…' : '수정하기'}
        </Button>
      </S.ActionBar>
    </S.Page>
  )
}