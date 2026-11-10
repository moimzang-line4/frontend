import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useDemoGroup from '../../hooks/groups/useDemoGroup'
import * as S from '../../styles/settings/SettingsPage.styles'

type Modal = 'leave' | 'edit' | 'operators' | 'invite' | 'transfer' | null
export default function SettingsPage() {
  const navigate = useNavigate()
  const { group, isMember, isOwner, updateGroup, transferOwner, leaveGroup } = useDemoGroup()
  const [modal, setModal] = useState<Modal>(null)
  const [editor, setEditor] = useState({ name: group.name, shortName: group.shortName, description: group.description, generation: group.generation })
  const [nextOwner, setNextOwner] = useState('operator-1')
  const [copied, setCopied] = useState(false)
  const inviteUrl = `${window.location.origin}/groups/join/${group.id}`
  if (!isMember) return <Navigate to="/groups" replace />
  return (
    <S.Page>
      <Header title="설정" />
      <S.Content>
        <S.GroupInfo><h2>{group.name}</h2><p>{group.description} · {group.generation}</p></S.GroupInfo>
        <S.Section aria-label="그룹 관리">
          <h3>그룹 관리</h3>
          <S.Menu>
            <S.MenuButton type="button" onClick={() => { setEditor({ name: group.name, shortName: group.shortName, description: group.description, generation: group.generation }); setModal('edit') }}>그룹 정보 수정</S.MenuButton>
            <S.MenuButton type="button" onClick={() => setModal('operators')}>운영진 관리</S.MenuButton>
            <S.MenuButton type="button" onClick={() => { setCopied(false); setModal('invite') }}>초대 링크 관리</S.MenuButton>
          </S.Menu>
        </S.Section>
        <S.AccountSection aria-label="그룹 권한 및 참여">
          <S.Menu>
            <S.MenuButton type="button" onClick={() => setModal('transfer')}>모임장 권한 변경</S.MenuButton>
            <S.MenuButton type="button" $danger onClick={() => setModal('leave')}>그룹 나가기</S.MenuButton>
          </S.Menu>
        </S.AccountSection>
      </S.Content>
      <S.ActionBar><Button type="button" onClick={() => navigate('/')}>다음</Button></S.ActionBar>
      <ConfirmDialog open={modal === 'leave'} title="그룹에서 나가시겠어요?" description={isOwner ? '모임장이 그룹에서 나가면\n다른 운영진 1명에게 모임장 권한이 자동으로 이전됩니다.' : '그룹에서 나가면 그룹의 운영 정보에 더 이상 접근할 수 없어요.'} confirmText="그룹 나가기" onCancel={() => setModal(null)} onConfirm={() => {
        leaveGroup()
        setModal(null)
        navigate('/groups', { replace: true })
      }} />
      <ConfirmDialog open={modal === 'edit'} title="그룹 정보 수정" confirmText="저장" tone="primary" onCancel={() => setModal(null)} onConfirm={() => {
        const values = Object.fromEntries(Object.entries(editor).map(([key, value]) => [key, value.trim()])) as typeof editor
        if (!values.name || !values.shortName) throw new Error('그룹 이름과 캘린더 이름을 입력해주세요.')
        updateGroup(values)
        setModal(null)
      }}>
        <S.Fields>{([['name', '그룹 이름'], ['shortName', '캘린더 이름'], ['description', '그룹 소개'], ['generation', '기수']] as const).map(([key, label]) => <label key={key}>{label}<input maxLength={key === 'description' ? 100 : 40} value={editor[key]} onChange={event => setEditor(current => ({ ...current, [key]: event.target.value }))} /></label>)}</S.Fields>
      </ConfirmDialog>
      <ConfirmDialog open={modal === 'operators'} title="운영진 관리" hideCancel tone="primary" onCancel={() => setModal(null)} onConfirm={() => setModal(null)}>
        <S.MemberList>{group.members.map(member => <li key={member.id}>{member.name}<span>{member.id === group.ownerId ? '모임장' : '운영진'}</span></li>)}</S.MemberList>
      </ConfirmDialog>
      <ConfirmDialog open={modal === 'transfer'} title="모임장 권한 변경" description={isOwner ? '모임장 권한을 넘길 운영진을 선택해주세요.' : '모임장만 권한을 변경할 수 있어요.'} hideCancel={!isOwner} confirmText={isOwner ? '변경' : '확인'} tone="primary" onCancel={() => setModal(null)} onConfirm={() => {
        if (isOwner) transferOwner(nextOwner)
        setModal(null)
      }}>
        {isOwner && <S.Fields><label>다음 모임장<select value={nextOwner} onChange={event => setNextOwner(event.target.value)}>{group.members.filter(member => member.id !== 'me').map(member => <option key={member.id} value={member.id}>{member.name}</option>)}</select></label></S.Fields>}
      </ConfirmDialog>
      <ConfirmDialog open={modal === 'invite'} title="초대 링크 관리" description={copied ? '초대 링크를 복사했어요.' : '데모 그룹에 참여할 수 있는 링크예요.'} confirmText={copied ? '닫기' : '링크 복사'} tone="primary" onCancel={() => setModal(null)} onConfirm={async () => {
        if (copied) { setModal(null); return }
        if (!navigator.clipboard) throw new Error('초대 링크를 직접 선택해 복사해주세요.')
        await navigator.clipboard.writeText(inviteUrl)
        setCopied(true)
      }}><S.InviteUrl aria-label="초대 링크" readOnly value={inviteUrl} onFocus={event => event.target.select()} /></ConfirmDialog>
    </S.Page>
  )
}
