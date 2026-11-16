import { useRef, useState } from 'react'
import { Navigate } from 'react-router'

import Header from '../../layouts/Header'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import OperatorActionSheet from '../../components/settings/OperatorActionSheet'

import useSettingsBack from '../../hooks/settings/useSettingsBack'
import useDemoGroup from '../../hooks/groups/useDemoGroup'

import type { DemoGroup } from '../../types/groups/demoGroup'

import ownerCrown from '../../assets/settings/owner-crown.svg'
import personIcon from '../../assets/settings/person.svg'
import moreIcon from '../../assets/settings/more.svg'

import * as S from '../../styles/settings/SettingsPage.styles'
import * as M from '../../styles/settings/ManagementPage.styles'

type Operator = DemoGroup['members'][number]

type Selection = {
  id: string
  action: 'sheet' | 'remove' | 'transfer'
}

const mockOperators: Operator[] = [
  {
    id: 'mock-operator-1',
    name: '노윤서',
    profile: '컴퓨터공학과',
  },
  {
    id: 'mock-operator-2',
    name: '박영서',
    profile: '인공지능공학부',
  },
  {
    id: 'mock-operator-3',
    name: '이윤서',
    profile: '컴퓨터공학과',
  },
  {
    id: 'mock-operator-4',
    name: '이충환',
    profile: '컴퓨터공학과',
  },
  {
    id: 'mock-operator-5',
    name: '정서현',
    profile: '광고홍보학과',
  },
  {
    id: 'mock-operator-6',
    name: '최소윤',
    profile: '전자공학과',
  },
]

function initialOperators(group: DemoGroup): Operator[] {
  const self = group.members.find(
    member => member.id === 'me',
  )

  const members: Operator[] = [
    self
      ? { ...self, name: '나' }
      : {
          id: 'me',
          name: '나',
          profile: '운영진',
        },

    ...group.members
      .filter(member => member.id !== 'me')
      .map(member => ({ ...member })),
  ]

  for (const mock of mockOperators) {
    const exists = members.some(
      member =>
        member.id === mock.id ||
        member.name === mock.name,
    )

    if (!exists) {
      members.push({ ...mock })
    }
  }

  return members
}

function OperatorsDemo({
  group,
}: {
  group: DemoGroup
}) {
  const backToSettings = useSettingsBack('/settings')

  const [members, setMembers] = useState(
    () => initialOperators(group),
  )

  const [ownerId, setOwnerId] = useState(group.ownerId)
  const [selection, setSelection] =
    useState<Selection | null>(null)

  const [status, setStatus] = useState('')

  const returnFocus =
    useRef<HTMLButtonElement | null>(null)

  const isOwner = ownerId === 'me'

  const selected = members.find(
    member => member.id === selection?.id,
  )

  function dismiss() {
    setSelection(null)

    if (returnFocus.current?.isConnected) {
      returnFocus.current.focus()
    }
  }

  return (
    <S.Page $hasActionBar={false}>
      <Header
        title="운영진 관리"
        onBack={backToSettings}
      />

      <S.Content>
        <S.GroupInfo>
          <h2>함께 운영하는 사람들</h2>

          <p>
            운영진 {members.length}명 · 모임장 지정은
            모임장만 가능해요.
          </p>
        </S.GroupInfo>

        <S.Section aria-label="그룹 관리">
          <h3>그룹 관리</h3>

          <M.OperatorList>
            {members.map(member => (
              <M.Operator key={member.id}>
                <img
                  src={personIcon}
                  alt=""
                  width={24}
                  height={24}
                />

                <M.Person>
                  <M.PersonName>
                    <strong>
                      {member.name}
                    </strong>

                    {member.id === ownerId && (
                      <M.OwnerBadge>
                        <img
                          src={ownerCrown}
                          alt=""
                        />

                        <span>모임장</span>
                      </M.OwnerBadge>
                    )}
                  </M.PersonName>

                  <p>
                    {member.id === 'me' &&
                    member.profile === '모임장' &&
                    ownerId !== 'me'
                      ? '운영진'
                      : member.profile}
                  </p>
                </M.Person>

                {isOwner &&
                  member.id !== ownerId &&
                  member.id !== 'me' && (
                    <M.More
                      type="button"
                      aria-label={`${member.name} 관리`}
                      aria-haspopup="dialog"
                      onClick={event => {
                        returnFocus.current =
                          event.currentTarget

                        setSelection({
                          id: member.id,
                          action: 'sheet',
                        })
                      }}
                    >
                      <img
                        src={moreIcon}
                        alt=""
                        width={16}
                        height={16}
                      />
                    </M.More>
                  )}
              </M.Operator>
            ))}
          </M.OperatorList>
        </S.Section>

        <M.Status role="status">
          {status}
        </M.Status>
      </S.Content>

      {selected && selection?.action === 'sheet' && (
        <OperatorActionSheet
          name={selected.name}
          onClose={dismiss}
          onAction={action =>
            setSelection({
              id: selected.id,
              action,
            })
          }
        />
      )}

      <ConfirmDialog
        open={
          !!selected &&
          selection?.action === 'remove'
        }
        title="정말 운영진에서 내보낼까요?"
        description={
          `${selected?.name ?? ''} 님이 운영진 목록에서 제외되며,\n` +
          '더 이상 모임의 운영 정보를 관리할 수 없습니다.'
        }
        confirmText="내보내기"
        onCancel={dismiss}
        onConfirm={() => {
          if (!selected) return

          if (!isOwner) {
            throw new Error(
              '모임장만 운영진을 내보낼 수 있어요.',
            )
          }

          if (
            selected.id === 'me' ||
            selected.id === ownerId
          ) {
            throw new Error(
              '나와 모임장은 내보낼 수 없어요.',
            )
          }

          setMembers(current =>
            current.filter(
              member => member.id !== selected.id,
            ),
          )

          setStatus(
            `${selected.name} 님을 운영진에서 내보냈어요.`,
          )

          setSelection(null)
        }}
      />

      <ConfirmDialog
        open={
          !!selected &&
          selection?.action === 'transfer'
        }
        title={
          `${selected?.name ?? ''}을 모임장으로 변경할까요?`
        }
        description={
          '모임장을 변경하면 모임장 변경 권한도 함께 이전됩니다.\n' +
          '모임장은 한 명만 지정할 수 있습니다.'
        }
        confirmText="변경하기"
        tone="primary"
        onCancel={dismiss}
        onConfirm={() => {
          if (!selected) return

          if (!isOwner) {
            throw new Error(
              '모임장만 권한을 변경할 수 있어요.',
            )
          }

          setOwnerId(selected.id)

          setStatus(
            `${selected.name} 님이 모임장이 되었어요.`,
          )

          setSelection(null)
        }}
      />
    </S.Page>
  )
}

export default function OperatorsPage() {
  const { group, isMember } = useDemoGroup()

  if (!isMember) {
    return <Navigate to="/groups" replace />
  }

  return (
    <OperatorsDemo
      key={group.id}
      group={group}
    />
  )
}