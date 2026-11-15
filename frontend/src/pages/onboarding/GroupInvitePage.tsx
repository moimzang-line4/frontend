import { useRef, useState } from 'react'
import { isAxiosError } from 'axios'
import { Navigate, useNavigate } from 'react-router'

import Header from '../../layouts/Header'
import Button from '../../components/Button'

import { useCreateGroup } from '../../api/generated'
import useOnboarding from '../../hooks/onboarding/useOnboarding'
import useDemoGroup from '../../hooks/groups/useDemoGroup'

import * as S from '../../styles/settings/SettingsPage.styles'
import * as M from '../../styles/settings/ManagementPage.styles'

type CreatedGroup = {
  groupId: number
  termId: number
}

export default function GroupInvitePage() {
  const navigate = useNavigate()
  const { draft, group } = useOnboarding()
  const { createGroup } = useDemoGroup()

  // Orval이 자동으로 만들어준 그룹 생성 훅
  const mutation = useCreateGroup({
    mutation: {
      retry: false,
    },
    axios: {
      timeout: 15000,
    },
  })

  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [copying, setCopying] = useState(false)
  const [saving, setSaving] = useState(false)

  const input = useRef<HTMLInputElement>(null)
  const submitting = useRef(false)

  // 서버 생성 후 브라우저 저장만 실패한 경우,
  // 다시 눌러도 같은 그룹을 중복 생성하지 않도록 보관
  const created = useRef<CreatedGroup | null>(null)

  if (!draft) {
    return (
      <Navigate
        to={group ? '/' : '/groups/new'}
        replace
      />
    )
  }

  // 기존 초대 링크 표시를 유지합니다.
  // 실제 초대·가입 API 연결은 별도 작업입니다.
  const url = `${window.location.origin}/groups/join/${draft.id}`

  async function copy() {
    setCopying(true)

    try {
      await navigator.clipboard.writeText(url)
      setStatus('초대 링크를 복사했어요.')
    } catch {
      input.current?.focus()
      input.current?.select()
      setStatus('링크를 직접 복사해주세요.')
    } finally {
      setCopying(false)
    }
  }

  async function submit() {
    if (!draft || submitting.current) return

    submitting.current = true
    setSaving(true)
    setError('')

    try {
      if (!created.current) {
        const response = await mutation.mutateAsync({
          data: {
            name: draft.name.trim(),
            termName: draft.generation.trim(),
          },
        })

        const body = response.data

        if (body.success !== true) {
          throw new Error(
            body.message || '그룹을 생성하지 못했어요.',
          )
        }

        const groupId = body.data?.groupId
        const termId = body.data?.termId

        if (
          typeof groupId !== 'number' ||
          !Number.isSafeInteger(groupId) ||
          groupId <= 0 ||
          typeof termId !== 'number' ||
          !Number.isSafeInteger(termId) ||
          termId <= 0
        ) {
          throw new Error(
            '서버 응답에 올바른 그룹·기수 ID가 없어요.',
          )
        }

        created.current = {
          groupId,
          termId,
        }
      }

      const { groupId, termId } = created.current

      createGroup({
        ...draft,
        id: String(groupId),
        groupId,
        termId,
      })

      navigate('/', { replace: true })
    } catch (caught) {
      if (isAxiosError<{ message?: unknown }>(caught)) {
        const message = caught.response?.data?.message

        if (typeof message === 'string' && message.trim()) {
          setError(message)
        } else if (!caught.response) {
          setError(
            '서버에 연결하지 못했어요. 네트워크 상태를 확인해주세요.',
          )
        } else {
          setError('그룹을 생성하지 못했어요.')
        }
      } else {
        setError(
          caught instanceof Error
            ? caught.message
            : '그룹을 생성하지 못했어요.',
        )
      }
    } finally {
      submitting.current = false
      setSaving(false)
    }
  }

  return (
    <S.Page>
      <Header
        title="그룹 만들기"
        onBack={() => {
          if (!saving) navigate('/groups/new')
        }}
      />

      <S.Content>
        <S.GroupInfo>
          <h2>함께 운영할 멤버를 초대해요</h2>
          <p>지금 초대하지 않아도 나중에 추가할 수 있어요</p>
        </S.GroupInfo>

        <M.InviteCard aria-label="운영진 초대 링크">
          <h3>운영진 초대 링크</h3>

          <M.LinkInput
            ref={input}
            aria-label="초대 링크"
            readOnly
            value={url}
            onFocus={event => event.target.select()}
          />

          <M.CopyButton
            type="button"
            disabled={copying || saving}
            onClick={copy}
          >
            링크 복사하기
          </M.CopyButton>

          {status && (
            <M.Status role="status">
              {status}
            </M.Status>
          )}
        </M.InviteCard>

        {error && <p role="alert">{error}</p>}
      </S.Content>

      <S.ActionBar>
        <Button
          disabled={saving}
          onClick={submit}
        >
          {saving ? '그룹 생성 중…' : '그룹 생성하기'}
        </Button>
      </S.ActionBar>
    </S.Page>
  )
}