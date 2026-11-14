import { useRef, useState } from 'react'
import { Navigate } from 'react-router'

import Header from '../../layouts/Header'
import useSettingsBack from '../../hooks/settings/useSettingsBack'
import useDemoGroup from '../../hooks/groups/useDemoGroup'

import * as S from '../../styles/settings/SettingsPage.styles'
import * as M from '../../styles/settings/ManagementPage.styles'

export default function InviteLinkPage() {
  const backToSettings = useSettingsBack('/settings')
  const { group, isMember } = useDemoGroup()

  const [status, setStatus] = useState('')
  const [copying, setCopying] = useState(false)

  const inputRef = useRef<HTMLInputElement>(null)
  const url = `${window.location.origin}/groups/join/${group.id}`

  async function copy() {
    setCopying(true)

    try {
      await navigator.clipboard.writeText(url)
      setStatus('초대 링크를 복사했어요.')
    } catch {
      inputRef.current?.focus()
      inputRef.current?.select()

      setStatus(
        '링크를 직접 복사해주세요. 브라우저에서 클립보드 접근을 허용하면 자동 복사할 수 있어요.',
      )
    } finally {
      setCopying(false)
    }
  }

  if (!isMember) {
    return <Navigate to="/groups" replace />
  }

  return (
    <S.Page $hasActionBar={false}>
      <Header title="초대 링크 관리" onBack={backToSettings} />

      <S.Content>
        <S.GroupInfo>
          <h2>함께 운영할 멤버를 초대해요</h2>
          <p>지금 초대하지 않아도 나중에 추가할 수 있어요</p>
        </S.GroupInfo>

        <M.InviteCard aria-label="운영진 초대 링크">
          <h3>운영진 초대 링크</h3>

          <M.LinkInput
            ref={inputRef}
            aria-label="초대 링크"
            readOnly
            value={url}
            onFocus={(event) => event.target.select()}
          />

          <M.CopyButton type="button" disabled={copying} onClick={copy}>
            링크 복사하기
          </M.CopyButton>

          {status && <M.Status role="status">{status}</M.Status>}
        </M.InviteCard>
      </S.Content>
    </S.Page>
  )
}
