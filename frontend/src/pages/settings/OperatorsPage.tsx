import { useRef, useState } from 'react'
import { Navigate } from 'react-router'

import Header from '../../layouts/Header'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import OperatorActionSheet from '../../components/settings/OperatorActionSheet'
import useSettingsBack from '../../hooks/settings/useSettingsBack'
import useDemoGroup from '../../hooks/groups/useDemoGroup'

import personIcon from '../../assets/settings/person.svg'
import moreIcon from '../../assets/settings/more.svg'

import * as S from '../../styles/settings/SettingsPage.styles'
import * as M from '../../styles/settings/ManagementPage.styles'

type Selection = {
  id: string
  action: 'sheet' | 'remove' | 'transfer'
}

export default function OperatorsPage() {
  const backToSettings = useSettingsBack('/settings')

  const { group, isMember, isOwner, removeOperator, transferOwner } =
    useDemoGroup()

  const [selection, setSelection] = useState<Selection | null>(null)
  const [status, setStatus] = useState('')

  const returnFocus = useRef<HTMLButtonElement | null>(null)

  const selected = group.members.find((member) => member.id === selection?.id)

  function dismiss() {
    setSelection(null)
    returnFocus.current?.focus()
  }

  if (!isMember) {
    return <Navigate to="/groups" replace />
  }

  return (
    <S.Page>
      <Header title="운영진 관리" onBack={backToSettings} />

      <S.Content>
        <S.GroupInfo>
          <h2>함께 운영하는 사람들</h2>
          <p>
            운영진 {group.members.length}명 · 모임장 지정은 모임장만 가능해요.
          </p>
        </S.GroupInfo>

        <S.Section aria-label="그룹 관리">
          <h3>그룹 관리</h3>

          <M.OperatorList>
            {group.members.map((member) => (
              <M.Operator key={member.id}>
                <img src={personIcon} alt="" width={24} height={24} />

                <M.Person>
                  <strong>
                    {member.name}
                    {member.id === group.ownerId ? ' · 모임장' : ''}
                  </strong>

                  <p>{member.profile}</p>
                </M.Person>

                {isOwner && member.id !== group.ownerId && (
                  <M.More
                    type="button"
                    aria-label={`${member.name} 관리`}
                    aria-haspopup="dialog"
                    onClick={(event) => {
                      returnFocus.current = event.currentTarget

                      setSelection({
                        id: member.id,
                        action: 'sheet',
                      })
                    }}
                  >
                    <img src={moreIcon} alt="" width={16} height={16} />
                  </M.More>
                )}
              </M.Operator>
            ))}
          </M.OperatorList>
        </S.Section>

        <M.Status role="status">{status}</M.Status>
      </S.Content>

      <S.ActionBar>
        <Button onClick={backToSettings}>다음</Button>
      </S.ActionBar>

      {selected && selection?.action === 'sheet' && (
        <OperatorActionSheet
          name={selected.name}
          onClose={dismiss}
          onAction={(action) =>
            setSelection({
              id: selected.id,
              action,
            })
          }
        />
      )}

      <ConfirmDialog
        open={!!selected && selection?.action === 'remove'}
        title="정말 운영진에서 내보낼까요?"
        description={`${selected?.name ?? ''} 님이 운영진 목록에서 제외되며,\n더 이상 모임의 운영 정보를 관리할 수 없습니다.`}
        confirmText="내보내기"
        onCancel={dismiss}
        onConfirm={() => {
          if (!selected) return

          removeOperator(selected.id)
          setStatus(`${selected.name} 님을 운영진에서 내보냈어요.`)
          setSelection(null)
        }}
      />

      <ConfirmDialog
        open={!!selected && selection?.action === 'transfer'}
        title={`${selected?.name ?? ''}을 모임장으로 변경할까요?`}
        description={
          '모임장을 변경하면 모임장 변경 권한도 함께 이전됩니다.\n모임장은 한 명만 지정할 수 있습니다.'
        }
        confirmText="변경하기"
        tone="primary"
        onCancel={dismiss}
        onConfirm={() => {
          if (!selected) return

          transferOwner(selected.id)
          setStatus(`${selected.name} 님이 모임장이 되었어요.`)
          setSelection(null)
        }}
      />
    </S.Page>
  )
}
