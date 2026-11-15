import { useState } from 'react'
import type { FormEvent } from 'react'
import { Navigate } from 'react-router'

import Header from '../../layouts/Header'
import Button from '../../components/Button'
import useSettingsBack from '../../hooks/settings/useSettingsBack'
import useDemoGroup from '../../hooks/groups/useDemoGroup'

import * as S from '../../styles/settings/SettingsPage.styles'
import * as M from '../../styles/settings/ManagementPage.styles'

export default function GroupEditPage() {
  const backToSettings = useSettingsBack('/settings')
  const { group, isMember, updateGroup } = useDemoGroup()

  const [name, setName] = useState(group.name)
  const [generation, setGeneration] = useState(group.generation)

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (!name.trim() || !generation.trim()) return

    updateGroup({
      name: name.trim(),
      shortName: name.trim(),
      generation: generation.trim(),
      description: group.description,
    })

    backToSettings()
  }

  if (!isMember) {
    return <Navigate to="/groups" replace />
  }

  return (
    <S.Page>
      <Header title="그룹 정보 수정" onBack={backToSettings} />

      <S.Content>
        <M.EditForm id="group-edit" onSubmit={submit} style={{ marginTop: 0 }}>
          <label>
            <div>
              그룹명 <span aria-hidden="true">*</span>
            </div>

            <input
              aria-label="그룹명"
              required
              maxLength={40}
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="예) 음샘 중앙밴드"
            />
          </label>

          <label>
            <div>
              기수 <span aria-hidden="true">*</span>
            </div>

            <input
              aria-label="기수"
              required
              maxLength={40}
              value={generation}
              onChange={(event) => setGeneration(event.target.value)}
              placeholder="예) 12기 (기수 구분이 없는 경우 연도를 입력해 주세요.)"
            />
          </label>
        </M.EditForm>
      </S.Content>

      <S.ActionBar>
        <Button
          type="submit"
          form="group-edit"
          disabled={!name.trim() || !generation.trim()}
        >
          수정하기
        </Button>
      </S.ActionBar>
    </S.Page>
  )
}
