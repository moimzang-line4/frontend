import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import AttendanceHero from '../../components/attendance/AttendanceHero'
import AttendanceCard from '../../components/attendance/AttendanceCard'
import AttendanceAddSheet from '../../components/attendance/AttendanceAddSheet'
import AttendanceToast from '../../components/attendance/AttendanceToast'
import MemberSearchBar from '../../components/members/MemberSearchBar'
import MemberDeleteModal from '../../components/members/MemberDeleteModal'
import useAttendance, { getExtraField, getRosterGroup } from '../../hooks/attendance/useAttendance'
import type { MemberGroup } from '../../types/members/member'
import type { Schedule } from '../../types/schedules/schedule'
import type { AttendanceFilter, Participant } from '../../types/attendance/attendance'
import { AddButton, EmptyText, MemberCount, TopRow } from '../../styles/members/MemberDetailPage.styles'
import {
  CardDescription,
  CardTitle,
  CopyButton,
  LinkBox,
  LinkCard,
  LinkText,
} from '../../styles/members/MemberLinkPage.styles'
import * as S from '../../styles/attendance/AttendancePage.styles'
import { showAlert } from '../../hooks/useAlert'

type Props = { schedule: Schedule }

const PAGE_SIZE = 10

const filters: { id: AttendanceFilter; label: string }[] = [
  { id: 'absent', label: '미출석' },
  { id: 'attended', label: '출석 완료' },
  { id: 'all', label: '전체' },
]

function attendedText(time: number) {
  const minutes = Math.floor((Date.now() - time) / 60000)
  if (minutes < 1) return '방금 출석 처리'
  if (minutes < 60) return `${minutes}분 전 출석 처리`
  const date = new Date(time)
  return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')} 출석 처리`
}

function subtitleOf(item: Participant, filter: AttendanceFilter) {
  if (filter === 'attended' && item.attendedAt !== null) return attendedText(item.attendedAt)
  return item.extra ? `${item.department} · ${item.extra}` : item.department
}

// 일정 운영 메뉴 > 참석·출석 (/schedules/:scheduleId/operations/attendance)
export default function AttendancePage() {
  const { schedule } = useScheduleDetail()

  if (!schedule || schedule.operationMenuCount === undefined) {
    return (
      <MainLayout title="참석·출석">
        <S.Notice>
          <p>연결된 일정 또는 운영 공간이 없어요.</p>
          <Link to="/">홈으로 이동</Link>
        </S.Notice>
      </MainLayout>
    )
  }

  return <AttendanceScreen key={schedule.id} schedule={schedule} />
}

// 홈에서 모임(방)을 고르고 들어오므로, 출석 명단은 그 모임의 명단방을 그대로 사용
function AttendanceScreen({ schedule }: Props) {
  const [rosterGroup] = useState(() => getRosterGroup(schedule.id))

  return (
    <MainLayout title="참석·출석" showFooter={false}>
      <S.Container>
        {rosterGroup ? (
          <AttendanceRoster key={rosterGroup.id} schedule={schedule} rosterGroup={rosterGroup} />
        ) : (
          <S.Notice>
            <p>아직 부원 명단이 없어요.</p>
            <Link to="/members">부원 명단 만들러 가기</Link>
          </S.Notice>
        )}
      </S.Container>
    </MainLayout>
  )
}

function AttendanceRoster({ schedule, rosterGroup }: Props & { rosterGroup: MemberGroup }) {
  const { participants, attendedCount, setAttended, removeParticipant, addParticipant } = useAttendance(schedule.id, rosterGroup.id)

  const [filter, setFilter] = useState<AttendanceFilter>('absent')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [openId, setOpenId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null)
  const [copied, setCopied] = useState(false)
  const copyTimer = useRef<number | undefined>(undefined)

  useEffect(() => () => window.clearTimeout(copyTimer.current), [])
  const closeToast = useCallback(() => setToast(null), [])

  const keyword = search.trim().toLowerCase()
  const filtered = participants.filter(item => {
    if (filter === 'absent' && item.attendedAt !== null) return false
    if (filter === 'attended' && item.attendedAt === null) return false
    if (!keyword) return true
    return item.name.toLowerCase().includes(keyword) || item.department.toLowerCase().includes(keyword)
  })
  // 출석 완료 목록은 최근 처리한 순서로
  const sorted = filter === 'attended'
    ? [...filtered].sort((a, b) => (b.attendedAt ?? 0) - (a.attendedAt ?? 0))
    : filtered
  const visible = sorted.slice(0, limit)
  const rest = sorted.length - visible.length

  const changeFilter = (next: AttendanceFilter) => {
    setFilter(next)
    setLimit(PAGE_SIZE)
    setOpenId(null)
  }

  const registerLink = rosterGroup ? `${window.location.origin}/members/register/${rosterGroup.id}` : ''

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(registerLink)
      setCopied(true)
      window.clearTimeout(copyTimer.current)
      copyTimer.current = window.setTimeout(() => setCopied(false), 2000)
    } catch {
      showAlert('링크 복사에 실패했어요.', { description: '잠시 후 다시 시도해주세요.' })
    }
  }

  const countLabel = filter === 'absent' ? '미출석' : filter === 'attended' ? '출석 완료' : '전체'

  return (
    <>
      <AttendanceHero title={schedule.title} attended={attendedCount} total={participants.length} />

      <MemberSearchBar value={search} onChange={value => { setSearch(value); setLimit(PAGE_SIZE) }} placeholder="이름 검색" />

      <S.Filters role="tablist" aria-label="출석 상태">
        {filters.map(item => (
          <S.FilterChip
            key={item.id}
            type="button"
            role="tab"
            aria-selected={filter === item.id}
            $active={filter === item.id}
            onClick={() => changeFilter(item.id)}
          >
            {item.label}
          </S.FilterChip>
        ))}
      </S.Filters>

      <S.ListSection>
        <TopRow>
          <MemberCount>{countLabel} {filtered.length}명</MemberCount>
          <AddButton type="button" onClick={() => setShowAddSheet(true)}>+ 인원 추가</AddButton>
        </TopRow>

        {visible.length > 0 ? (
          <S.List>
            {visible.map(item => (
              <AttendanceCard
                key={item.id}
                participant={item}
                subtitle={subtitleOf(item, filter)}
                open={openId === item.id}
                onOpenChange={open => setOpenId(open ? item.id : null)}
                onAttend={() => { setAttended(item.id, true); setOpenId(null) }}
                onSwipeAction={() => {
                  setOpenId(null)
                  if (item.attendedAt !== null) setAttended(item.id, false)
                  else setDeleteTarget(item)
                }}
              />
            ))}
          </S.List>
        ) : (
          <EmptyText>
            {keyword
              ? '검색 결과가 없어요.'
              : filter === 'absent' && participants.length > 0
                ? '모든 인원이 출석했어요.'
                : filter === 'attended'
                  ? '아직 출석한 인원이 없어요.'
                  : '출석 명단이 비어 있어요.'}
          </EmptyText>
        )}
      </S.ListSection>

      {rest > 0 && (
        <S.MoreButton type="button" onClick={() => setLimit(prev => prev + PAGE_SIZE)}>
          나머지 {rest}명 더 보기
        </S.MoreButton>
      )}

      {filter === 'absent' && rosterGroup && (
        <LinkCard>
          <CardTitle>부원 등록 링크</CardTitle>
          <LinkBox title={registerLink}>
            <LinkText>{registerLink.replace(/^https?:\/\//, '')}</LinkText>
          </LinkBox>
          <CopyButton type="button" onClick={handleCopy}>
            {copied ? '복사 완료!' : '링크 복사하기'}
          </CopyButton>
          <CardDescription>복사한 링크를 부원에게 보내 등록을 받아보세요.</CardDescription>
        </LinkCard>
      )}

      {showAddSheet && (
        <AttendanceAddSheet
          participants={participants}
          extraField={getExtraField(rosterGroup)}
          onClose={() => setShowAddSheet(false)}
          onAdd={input => {
            addParticipant(input)
            setShowAddSheet(false)
            changeFilter('all')
            setSearch('')
            setToast({
              title: `${input.name}님을 추가했어요`,
              description: [input.department, input.extra, '미출석'].filter(Boolean).join(' · '),
            })
          }}
        />
      )}

      {deleteTarget && (
        <MemberDeleteModal
          title="참가자를 삭제할까요?"
          description={`${deleteTarget.name} 님이 이번 일정의 출석 명단에서 빠져요.\n부원 명단에서는 삭제되지 않아요.`}
          confirmText="삭제"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={() => {
            removeParticipant(deleteTarget.id)
            setDeleteTarget(null)
          }}
        />
      )}

      {toast && <AttendanceToast title={toast.title} description={toast.description} onClose={closeToast} />}
    </>
  )
}
