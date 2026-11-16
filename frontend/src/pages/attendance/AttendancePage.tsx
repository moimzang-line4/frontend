import { useCallback, useState } from 'react'
import { Link } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import AttendanceHero from '../../components/attendance/AttendanceHero'
import AttendanceCard from '../../components/attendance/AttendanceCard'
import AttendanceAddSheet from '../../components/attendance/AttendanceAddSheet'
import AttendanceToast from '../../components/attendance/AttendanceToast'
import MemberSearchBar from '../../components/members/MemberSearchBar'
import MemberDeleteModal from '../../components/members/MemberDeleteModal'
import SegmentTabs from '../../components/SegmentTabs'
import useAttendanceApi, { useAttendanceRounds } from '../../hooks/attendance/useAttendanceApi'
import type { Schedule } from '../../types/schedules/schedule'
import type { AttendanceExtraField, AttendanceFilter, Participant } from '../../types/attendance/attendance'
import { AddButton, EmptyText, MemberCount, TopRow } from '../../styles/members/MemberDetailPage.styles'
import * as S from '../../styles/attendance/AttendancePage.styles'
import { showAlert } from '../../hooks/useAlert'
import { getApiErrorMessage } from '../../utils/members/mapper'

type Props = { schedule: Schedule }

// 서버 현장 추가 API는 전화번호 뒤 4자리를 필수로 받음
const PHONE_FIELD: AttendanceExtraField = { key: 'phone', label: '전화번호 뒤 4자리', placeholder: '예: 4827' }

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
  const { schedule, loading } = useScheduleDetail()

  if (loading) {
    return (
      <MainLayout title="참석·출석">
        <S.Notice><p>일정 정보를 불러오는 중이에요.</p></S.Notice>
      </MainLayout>
    )
  }

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

// 출석은 차수 단위: 기본은 1차, 차수가 2개 이상이면 위에 차수 탭 표시
function AttendanceScreen({ schedule }: Props) {
  const { rounds, loading, error, reload } = useAttendanceRounds(Number(schedule.id))
  const [selected, setSelected] = useState<string>('')
  const round = rounds.find(item => String(item.id) === selected) ?? rounds[0]

  return (
    <MainLayout title="참석·출석" showFooter={false}>
      <S.Container>
        {loading ? (
          <S.Notice><p>차수 정보를 불러오는 중이에요.</p></S.Notice>
        ) : error ? (
          <S.Notice>
            <p>{error}</p>
            <button type="button" onClick={() => void reload()}>다시 불러오기</button>
          </S.Notice>
        ) : !round ? (
          <S.Notice><p>이 일정에 출석을 받을 차수가 없어요.</p></S.Notice>
        ) : (
          <>
            {rounds.length > 1 && (
              <SegmentTabs
                label="차수"
                tabs={rounds.map(item => ({ id: String(item.id), label: item.label }))}
                value={String(round.id)}
                onChange={setSelected}
              />
            )}
            <AttendanceRoster key={round.id} schedule={schedule} roundId={round.id} />
          </>
        )}
      </S.Container>
    </MainLayout>
  )
}

function AttendanceRoster({ schedule, roundId }: Props & { roundId: number }) {
  const { participants, attendedCount, loading, error, reload, setAttended, removeParticipant, addParticipant } = useAttendanceApi(roundId)

  const [filter, setFilter] = useState<AttendanceFilter>('absent')
  const [search, setSearch] = useState('')
  const [limit, setLimit] = useState(PAGE_SIZE)
  const [openId, setOpenId] = useState<string | null>(null)
  const [deleteTarget, setDeleteTarget] = useState<Participant | null>(null)
  const [showAddSheet, setShowAddSheet] = useState(false)
  const [toast, setToast] = useState<{ title: string; description: string } | null>(null)

  const closeToast = useCallback(() => setToast(null), [])

  const changeAttended = (id: string, attended: boolean) => {
    setAttended(id, attended).catch(caught => {
      showAlert(getApiErrorMessage(caught, '출석 상태를 바꾸지 못했어요.'))
    })
  }

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

  const countLabel = filter === 'absent' ? '미출석' : filter === 'attended' ? '출석 완료' : '전체'

  if (loading) return <S.Notice><p>출석 명단을 불러오는 중이에요.</p></S.Notice>
  if (error) {
    return (
      <S.Notice>
        <p>{error}</p>
        <button type="button" onClick={() => void reload()}>다시 불러오기</button>
      </S.Notice>
    )
  }

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
                onAttend={() => { changeAttended(item.id, true); setOpenId(null) }}
                onSwipeAction={() => {
                  setOpenId(null)
                  if (item.attendedAt !== null) changeAttended(item.id, false)
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
                  : '출석 명단이 비어 있어요. + 인원 추가로 참가자를 넣어 주세요.'}
          </EmptyText>
        )}
      </S.ListSection>

      {rest > 0 && (
        <S.MoreButton type="button" onClick={() => setLimit(prev => prev + PAGE_SIZE)}>
          나머지 {rest}명 더 보기
        </S.MoreButton>
      )}

      {showAddSheet && (
        <AttendanceAddSheet
          participants={participants}
          extraField={PHONE_FIELD}
          onClose={() => setShowAddSheet(false)}
          onAdd={async (input, allowSameName) => {
            let result: 'added' | 'duplicate'
            try {
              result = await addParticipant(input, allowSameName)
            } catch (caught) {
              showAlert(getApiErrorMessage(caught, '인원을 추가하지 못했어요.'))
              return 'failed'
            }
            if (result === 'duplicate') return 'duplicate'
            setShowAddSheet(false)
            changeFilter('all')
            setSearch('')
            setToast({
              title: `${input.name}님을 추가했어요`,
              description: [input.department, input.extra, '미출석'].filter(Boolean).join(' · '),
            })
            return 'added'
          }}
        />
      )}

      {deleteTarget && (
        <MemberDeleteModal
          title="참가자를 삭제할까요?"
          description={`${deleteTarget.name} 님이 이번 일정의 출석 명단에서 빠져요.\n부원 명단에서는 삭제되지 않아요.`}
          confirmText="삭제"
          onCancel={() => setDeleteTarget(null)}
          onConfirm={async () => {
            const target = deleteTarget
            setDeleteTarget(null)
            try {
              await removeParticipant(target.id)
            } catch (caught) {
              showAlert(getApiErrorMessage(caught, '참가자를 제외하지 못했어요.'))
            }
          }}
        />
      )}

      {toast && <AttendanceToast title={toast.title} description={toast.description} onClose={closeToast} />}
    </>
  )
}
