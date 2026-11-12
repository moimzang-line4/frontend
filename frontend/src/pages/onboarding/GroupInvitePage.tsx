import { useRef, useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import Button from '../../components/Button'
import useOnboarding from '../../hooks/onboarding/useOnboarding'
import useDemoGroup from '../../hooks/groups/useDemoGroup'
import * as S from '../../styles/settings/SettingsPage.styles'
import * as M from '../../styles/settings/ManagementPage.styles'

export default function GroupInvitePage() {
  const navigate = useNavigate()
  const { draft, group } = useOnboarding()
  const { createGroup } = useDemoGroup()
  const [status, setStatus] = useState('')
  const [error, setError] = useState('')
  const [copying, setCopying] = useState(false)
  const input = useRef<HTMLInputElement>(null)
  if (!draft) return <Navigate to={group ? "/" : "/groups/new"} replace />
  const url = `${window.location.origin}/groups/join/${draft.id}`
  async function copy() {
    setCopying(true)
    try { await navigator.clipboard.writeText(url); setStatus('초대 링크를 복사했어요.') }
    catch { input.current?.focus(); input.current?.select(); setStatus('링크를 직접 복사해주세요. 브라우저에서 클립보드 접근을 허용하면 자동 복사할 수 있어요.') }
    finally { setCopying(false) }
  }
  return <S.Page>
    <Header title="그룹 만들기" onBack={() => navigate('/groups/new')} />
    <S.Content>
      <S.GroupInfo><h2>함께 운영할 멤버를 초대해요</h2><p>지금 초대하지 않아도 나중에 추가할 수 있어요</p></S.GroupInfo>
      <M.InviteCard aria-label="운영진 초대 링크"><h3>운영진 초대 링크</h3><M.LinkInput ref={input} aria-label="초대 링크" readOnly value={url} onFocus={event => event.target.select()} /><M.CopyButton type="button" disabled={copying} onClick={copy}>링크 복사하기</M.CopyButton>{status && <M.Status role="status">{status}</M.Status>}</M.InviteCard>
      {error && <p role="alert">{error}</p>}
    </S.Content>
    <S.ActionBar><Button onClick={() => {
      try { createGroup(draft); navigate('/', { replace: true }) }
      catch (caught) { setError(caught instanceof Error ? caught.message : '그룹을 생성하지 못했어요.') }
    }}>그룹 생성하기</Button></S.ActionBar>
  </S.Page>
}
