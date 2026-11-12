import { useState } from 'react'
import type { FormEvent } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import Button from '../../components/Button'
import useOnboarding from '../../hooks/onboarding/useOnboarding'
import * as S from '../../styles/settings/SettingsPage.styles'
import * as M from '../../styles/settings/ManagementPage.styles'

export default function GroupCreatePage() {
  const navigate = useNavigate()
  const onboarding = useOnboarding()
  const [name, setName] = useState(onboarding.draft?.name ?? '')
  const [generation, setGeneration] = useState(onboarding.draft?.generation ?? '')
  const [error, setError] = useState('')
  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!name.trim() || !generation.trim()) return
    try {
      onboarding.update({ completed: true, draft: { id: onboarding.draft?.id ?? crypto.randomUUID(), name: name.trim(), generation: generation.trim() } })
      navigate('/groups/new/invite')
    } catch (caught) { setError(caught instanceof Error ? caught.message : '그룹 정보를 저장하지 못했어요.') }
  }
  return <S.Page>
    <Header title="그룹 만들기" onBack={() => navigate(onboarding.group ? '/groups' : '/onboarding?replay=1&step=3')} />
    <S.Content>
      <S.GroupInfo><h2>새로운 모임을 만들어보세요</h2><p>그룹 정보를 입력하면 운영 공간이 생성돼요</p></S.GroupInfo>
      <M.EditForm id="create-group" onSubmit={submit}>
        <label><div>그룹명 <span aria-hidden="true">*</span></div><input aria-label="그룹명" required maxLength={40} placeholder="예) 음샘 중앙밴드" value={name} onChange={event => setName(event.target.value)} /></label>
        <label><div>기수 <span aria-hidden="true">*</span></div><input aria-label="기수" required maxLength={40} placeholder="예) 12기 (기수 구분이 없는 경우 연도를 입력해 주세요.)" value={generation} onChange={event => setGeneration(event.target.value)} /></label>
      </M.EditForm>
      {error && <p role="alert">{error}</p>}
    </S.Content>
    <S.ActionBar><Button type="submit" form="create-group" disabled={!name.trim() || !generation.trim()}>다음</Button></S.ActionBar>
  </S.Page>
}
