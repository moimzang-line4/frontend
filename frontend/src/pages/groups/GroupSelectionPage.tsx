import { useNavigate, useParams } from 'react-router'
import Header from '../../layouts/Header'
import Button from '../../components/Button'
import useDemoGroup from '../../hooks/groups/useDemoGroup'
import * as S from '../../styles/settings/SettingsPage.styles'

export default function GroupSelectionPage() {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const { group, isMember, resetDemo } = useDemoGroup()
  const invitation = groupId === group.id
  return <S.Page>
    <Header title={invitation ? '그룹 초대' : '그룹 선택'} showBack={false} />
    <S.SelectionContent>
      {groupId && !invitation ? <><h2>초대 링크를 찾을 수 없어요</h2><Button type="button" onClick={() => navigate('/groups')}>그룹 선택으로 이동</Button></> : <>
        {isMember ? <S.GroupCard type="button" onClick={() => navigate('/')}><h2>{group.name}</h2><p>{group.description} · {group.generation}</p></S.GroupCard> : <><h2>{invitation ? group.name : '참여 중인 그룹이 없어요'}</h2><p>{invitation ? '데모 그룹에 참여해 화면을 확인할 수 있어요.' : '데모 그룹에서 나왔어요. 다시 참여해 화면을 확인할 수 있어요.'}</p><p>데모 그룹의 모임장: {group.members.find(member => member.id === group.ownerId)?.name}</p></>}
        <Button type="button" onClick={() => { resetDemo(); navigate('/', { replace: true }) }}>{isMember ? '데모 그룹 초기화' : '데모 그룹 다시 참여'}</Button>
      </>}
    </S.SelectionContent>
  </S.Page>
}
