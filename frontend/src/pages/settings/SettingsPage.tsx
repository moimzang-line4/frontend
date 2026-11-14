import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'

import Header from '../../layouts/Header'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useSettingsBack from '../../hooks/settings/useSettingsBack'
import useDemoGroup from '../../hooks/groups/useDemoGroup'

import * as S from '../../styles/settings/SettingsPage.styles'

type Modal = 'leave' | null

export default function SettingsPage() {
  const navigate = useNavigate()
  const backToHome = useSettingsBack('/')

  const { group, isMember, isOwner, leaveGroup } = useDemoGroup()

  const [modal, setModal] = useState<Modal>(null)

  if (!isMember) {
    return <Navigate to="/groups" replace />
  }

  return (
    <S.Page>
      <Header title="설정" onBack={backToHome} />

      <S.Content>
        <S.GroupInfo>
          <h2>{group.name}</h2>

          <p>{group.generation}</p>
        </S.GroupInfo>

        <S.Section aria-label="그룹 관리">
          <h3>그룹 관리</h3>

          <S.Menu>
            <S.MenuButton
              type="button"
              onClick={() =>
                navigate('/settings/group', {
                  state: { settingsParent: '/settings' },
                })
              }
            >
              그룹 정보 수정
            </S.MenuButton>

            <S.MenuButton
              type="button"
              onClick={() =>
                navigate('/settings/operators', {
                  state: { settingsParent: '/settings' },
                })
              }
            >
              운영진 관리
            </S.MenuButton>

            <S.MenuButton
              type="button"
              onClick={() =>
                navigate('/settings/invite', {
                  state: { settingsParent: '/settings' },
                })
              }
            >
              초대 링크 관리
            </S.MenuButton>
          </S.Menu>
        </S.Section>

        <S.AccountSection aria-label="그룹 참여">
          <S.Menu>
            <S.MenuButton
              type="button"
              $danger
              onClick={() => setModal('leave')}
            >
              그룹 나가기
            </S.MenuButton>
          </S.Menu>
        </S.AccountSection>
      </S.Content>

      <S.ActionBar>
        <Button type="button" onClick={backToHome}>
          다음
        </Button>
      </S.ActionBar>

      <ConfirmDialog
        open={modal === 'leave'}
        title="그룹에서 나가시겠어요?"
        description={
          isOwner
            ? '모임장이 그룹에서 나가면\n다른 운영진 1명에게 모임장 권한이 자동으로 이전됩니다.'
            : '그룹에서 나가면 그룹의 운영 정보에 더 이상 접근할 수 없어요.'
        }
        confirmText="그룹 나가기"
        onCancel={() => setModal(null)}
        onConfirm={() => {
          leaveGroup()
          setModal(null)
          navigate('/groups', { replace: true })
        }}
      />
    </S.Page>
  )
}
