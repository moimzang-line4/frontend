import { useNavigate } from 'react-router'
import styled from 'styled-components'
import DropdownSelect from '../common/DropdownSelect'
import useGroupSwitcher from '../../hooks/groups/useGroupSwitcher'
import useOnboarding from '../../hooks/onboarding/useOnboarding'

const Container = styled.div`
  min-width: 0;
  > div {
    max-width: 100%;
    justify-content: flex-start;
    font-size: inherit;
    font-weight: inherit;
  }
  p,
  button {
    font-size: 12px;
    font-weight: 400;
  }
  p {
    color: #a33b30;
  }
  button {
    color: #367d70;
    cursor: pointer;
  }
`

export default function GroupSwitcher() {
  const navigate = useNavigate()
  const onboarding = useOnboarding()
  const data = useGroupSwitcher()
  const active = onboarding.group
  const options = data.groups.map(group => {
    const saved = onboarding.groups?.find(
      item => item.groupId === group.groupId,
    )
    const generation =
      group.groupId === active?.groupId
        ? active.generation
        : (saved?.generation ?? group.currentTermName)
    return {
      value: String(group.groupId),
      label: `${group.name}${generation ? ` (${generation})` : ''}`,
    }
  })
  if (!options.some(item => item.value === String(active?.groupId))) {
    options.unshift({
      value: '',
      label: data.loading
        ? '동아리 불러오는 중…'
        : (active?.name ?? '동아리 선택'),
    })
  }
  const value = options.some(item => item.value === String(active?.groupId))
    ? String(active?.groupId)
    : ''
  return (
    <Container>
      <DropdownSelect
        variant="inline"
        aria-label="동아리 선택"
        value={value}
        options={[...options, { value: 'new', label: '＋ 새 동아리 만들기' }]}
        disabled={data.pending}
        onChange={event => {
          if (event.target.value === 'new') navigate('/groups/new')
          else
            void data.select(Number(event.target.value)).then(changed => {
              if (changed) navigate('/', { replace: true })
            })
        }}
      />
      {data.pending && <p role="status">동아리를 전환하는 중이에요.</p>}
      {data.error && (
        <>
          <p role="alert">{data.error}</p>
          <button
            type="button"
            disabled={data.refreshing || data.pending}
            onClick={() => void data.reload()}
          >
            동아리 다시 불러오기
          </button>
        </>
      )}
    </Container>
  )
}
