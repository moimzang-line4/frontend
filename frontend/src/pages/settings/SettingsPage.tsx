import { Navigate, useNavigate } from 'react-router'

import Header from '../../layouts/Header'
import { showAlert } from '../../hooks/useAlert'
import useSettingsBack from '../../hooks/settings/useSettingsBack'
import useDemoGroup from '../../hooks/groups/useDemoGroup'

import * as S from '../../styles/settings/SettingsPage.styles'

const menuArrow = (
  <S.MenuArrow width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden="true" focusable="false">
    <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
  </S.MenuArrow>
)

export default function SettingsPage() {
  const navigate = useNavigate()
  const backToHome = useSettingsBack('/')

  const { group, isMember } = useDemoGroup()

  const comingSoon = () =>
    showAlert('추후 제공될 기능이에요.', {
      description: '조금만 기다려주세요.',
    })

  if (!isMember) {
    return <Navigate to="/groups" replace />
  }

  return (
    <S.Page $hasActionBar={false}>
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
              {menuArrow}
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
              {menuArrow}
            </S.MenuButton>

            <S.MenuButton
              type="button"
              onClick={comingSoon}
            >
              초대 링크 관리
              {menuArrow}
            </S.MenuButton>
          </S.Menu>
        </S.Section>

        <S.AccountSection aria-label="그룹 참여">
          <S.Menu>
            <S.MenuButton
              type="button"
              $danger
              onClick={comingSoon}
            >
              그룹 나가기
            </S.MenuButton>
          </S.Menu>
        </S.AccountSection>
      </S.Content>

    </S.Page>
  )
}
