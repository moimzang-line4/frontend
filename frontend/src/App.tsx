import styled from 'styled-components'
import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes, useParams, useSearchParams } from 'react-router'

import MainLayout from './layouts/MainLayout'

import HomePage from './pages/home/HomePage'
import OperationsPage from './pages/operations/OperationsPage'
import SettingsPage from './pages/settings/SettingsPage'
import OperatorsPage from './pages/settings/OperatorsPage'
import InviteLinkPage from './pages/settings/InviteLinkPage'
import GroupEditPage from './pages/settings/GroupEditPage'
import GroupSelectionPage from './pages/groups/GroupSelectionPage'
import useDemoGroup from './hooks/groups/useDemoGroup'
import useOnboarding from './hooks/onboarding/useOnboarding'
import ScheduleCreatePage from './pages/schedules/ScheduleCreatePage'
import ScheduleDetailPage from './pages/schedules/ScheduleDetailPage'
import ScheduleEditPage from './pages/schedules/ScheduleEditPage'
import ScheduleOperationPage from './pages/schedules/ScheduleOperationPage'
import AttendancePage from './pages/attendance/AttendancePage'
import AssistantPage from './pages/ai/AssistantPage'
import PaymentsPage from './pages/payments/PaymentsPage'
import ReceiptCameraPage from './pages/payments/ReceiptCameraPage'
import ReceiptResultPage from './pages/payments/ReceiptResultPage'
import RoundRosterPage from './pages/payments/RoundRosterPage'
import RoundEditPage from './pages/payments/RoundEditPage'

import MemberRegisterPage from './pages/members/MemberRegisterPage'
import {
  MemberAddRoute,
  MemberCreateRoute,
  MemberDetailRoute,
  MemberEditRoute,
  MemberLinkRoute,
  MemberListRoute,
  MemberSettingsRoute,
} from './pages/members/MemberRoutes'


import hasServerGroup from './utils/groups/hasServerGroup'

import AlertModal from './components/AlertModal'

const LedgerEntryPage = lazy(() => import('./pages/documents/LedgerEntryPage'))
const LedgerSourcePage = lazy(() => import('./pages/documents/LedgerSourcePage'))
const LedgerDeletePage = lazy(() => import('./pages/documents/LedgerDeletePage'))
const LedgerInitialBalancePage = lazy(() => import('./pages/documents/LedgerInitialBalancePage'))
const LedgerUploadPage = lazy(() => import('./pages/documents/LedgerUploadPage'))
const DocumentsPage = lazy(() => import('./pages/documents/DocumentsPage'))
const FilePreviewPage = lazy(() => import('./pages/files/FilePreviewPage'))
const FileUploadPage = lazy(() => import('./pages/files/FileUploadPage'))
const ScheduleFilesPage = lazy(() => import('./pages/files/ScheduleFilesPage'))

const MeetingFormPage = lazy(() => import('./pages/meetings/MeetingFormPage'))
const MeetingRunPage = lazy(() => import('./pages/meetings/MeetingRunPage'))
const MeetingLinkPage = lazy(() => import('./pages/meetings/MeetingLinkPage'))

const OperationNotesPage = lazy(() => import('./pages/notes/OperationNotesPage'))
const OperationNoteFormPage = lazy(() => import('./pages/notes/OperationNoteFormPage'))

const OnboardingPage = lazy(() => import('./pages/onboarding/OnboardingPage'))
const GroupCreatePage = lazy(() => import('./pages/onboarding/GroupCreatePage'))
const GroupInvitePage = lazy(() => import('./pages/onboarding/GroupInvitePage'))

function OperationsRoute() {
  const [params] = useSearchParams()
  const eventId = params.get('event')

  if (eventId) {
    return (
      <Navigate
        to={`/schedules/${encodeURIComponent(eventId)}`}
        replace
      />
    )
  }

  return <OperationsPage />
}

function GroupHomeRoute() {
  const { isMember } = useDemoGroup()
  const onboarding = useOnboarding()

  if (!onboarding.completed) {
    return <Navigate to="/onboarding" replace />
  }

  if (!hasServerGroup(onboarding.group)) {
    return <Navigate to="/groups/new" replace />
  }

  return isMember
    ? <HomePage />
    : <Navigate to="/groups" replace />
}

// 영수증 수정: 영수증·재촬영마다 화면 상태를 새로 시작
function ReceiptEditRoute() {
  const { receiptId } = useParams<{ receiptId: string }>()
  const [searchParams] = useSearchParams()
  return <ReceiptResultPage key={`${receiptId}-${searchParams.has('retake')}`} mode="edit" />
}

export default function App() {
  return (
    <>
    <Routes>
      <Route path="/onboarding" element={<Suspense fallback={<Placeholder>시작 화면을 불러오는 중이에요.</Placeholder>}><OnboardingPage /></Suspense>} />
      <Route path="/groups/new" element={<Suspense fallback={<Placeholder>그룹 정보를 불러오는 중이에요.</Placeholder>}><GroupCreatePage /></Suspense>} />
      <Route path="/groups/new/invite" element={<Suspense fallback={<Placeholder>초대 링크를 불러오는 중이에요.</Placeholder>}><GroupInvitePage /></Suspense>} />
      {/* 홈 */}
      <Route path="/" element={<GroupHomeRoute />} />
      <Route path="/settings" element={<SettingsPage />} />
      <Route path="/settings/operators" element={<OperatorsPage />} />
      <Route path="/settings/invite" element={<InviteLinkPage />} />
      <Route path="/settings/group" element={<GroupEditPage />} />
      <Route path="/groups" element={<GroupSelectionPage />} />
      <Route path="/groups/join/:groupId" element={<GroupSelectionPage />} />

      <Route path="/schedules/:scheduleId/meetings/link" element={<Suspense fallback={<Placeholder>회의록을 불러오는 중이에요.</Placeholder>}><MeetingLinkPage /></Suspense>} />
      <Route path="/meetings/new" element={<Suspense fallback={<Placeholder>회의록을 불러오는 중이에요.</Placeholder>}><MeetingFormPage /></Suspense>} />
      <Route path="/meetings/:meetingId" element={<Suspense fallback={<Placeholder>회의록을 불러오는 중이에요.</Placeholder>}><MeetingFormPage /></Suspense>} />
      <Route path="/meetings/:meetingId/run" element={<Suspense fallback={<Placeholder>회의록을 불러오는 중이에요.</Placeholder>}><MeetingRunPage /></Suspense>} />

      {/* 일정 관리 */}
      <Route
        path="/schedules/new"
        element={<ScheduleCreatePage />}
      />

      <Route
        path="/schedules/:scheduleId"
        element={<ScheduleDetailPage />}
      />

      <Route
        path="/schedules/:scheduleId/edit"
        element={<ScheduleEditPage />}
      />

      <Route path="/schedules/:scheduleId/operations/notes" element={<Suspense fallback={<Placeholder>메모를 불러오는 중이에요.</Placeholder>}><OperationNotesPage /></Suspense>} />
      <Route path="/schedules/:scheduleId/operations/notes/new" element={<Suspense fallback={<Placeholder>메모를 불러오는 중이에요.</Placeholder>}><OperationNoteFormPage /></Suspense>} />
      <Route path="/schedules/:scheduleId/operations/notes/:noteId" element={<Suspense fallback={<Placeholder>메모를 불러오는 중이에요.</Placeholder>}><OperationNoteFormPage /></Suspense>} />

      <Route
        path="/files/ledger/entries/:entryId/delete"
        element={
          <Suspense fallback={<Placeholder>내역을 불러오는 중이에요.</Placeholder>}>
            <LedgerEntryPage />
          </Suspense>
        }
      />
      <Route
        path="/files/ledger/entries/:entryId"
        element={
          <Suspense fallback={<Placeholder>내역을 불러오는 중이에요.</Placeholder>}>
            <LedgerEntryPage />
          </Suspense>
        }
      />
      <Route path="/files/ledger/initial" element={<Suspense fallback={<Placeholder>장부를 불러오는 중이에요.</Placeholder>}><LedgerInitialBalancePage /></Suspense>} />
      <Route
        path="/files/ledger/new"
        element={
          <Suspense fallback={<Placeholder>장부를 불러오는 중이에요.</Placeholder>}>
            <LedgerEntryPage />
          </Suspense>
        }
      />
      <Route
        path="/files/ledger/source"
        element={
          <Suspense fallback={<Placeholder>장부를 불러오는 중이에요.</Placeholder>}>
            <LedgerSourcePage />
          </Suspense>
        }
      />
      <Route
        path="/files/ledger/delete"
        element={
          <Suspense fallback={<Placeholder>장부를 불러오는 중이에요.</Placeholder>}>
            <LedgerDeletePage />
          </Suspense>
        }
      />
      <Route
        path="/files/ledger/upload"
        element={
          <Suspense fallback={<Placeholder>장부를 불러오는 중이에요.</Placeholder>}>
            <LedgerUploadPage />
          </Suspense>
        }
      />
      <Route
        path="/files"
        element={
          <Suspense fallback={<Placeholder>문서함을 불러오는 중이에요.</Placeholder>}>
            <DocumentsPage />
          </Suspense>
        }
      />
      <Route
        path="/files/new"
        element={
          <Suspense fallback={<Placeholder>첨부 화면을 불러오는 중이에요.</Placeholder>}>
            <FileUploadPage />
          </Suspense>
        }
      />
      <Route
        path="/files/:fileId"
        element={
          <Suspense fallback={<Placeholder>미리보기를 불러오는 중이에요.</Placeholder>}>
            <FilePreviewPage />
          </Suspense>
        }
      />

      <Route path="/schedules/:scheduleId/operations/files/:fileId" element={<Suspense fallback={<Placeholder>미리보기를 불러오는 중이에요.</Placeholder>}><FilePreviewPage /></Suspense>} />
      <Route path="/schedules/:scheduleId/operations/files/new" element={<Suspense fallback={<Placeholder>첨부 화면을 불러오는 중이에요.</Placeholder>}><FileUploadPage /></Suspense>} />
      <Route path="/schedules/:scheduleId/operations/files" element={<Suspense fallback={<Placeholder>자료를 불러오는 중이에요.</Placeholder>}><ScheduleFilesPage /></Suspense>} />

      {/* 운영 메뉴 > 참석·출석 (다른 메뉴보다 먼저 매칭됨) */}
      <Route
        path="/schedules/:scheduleId/operations/attendance"
        element={<AttendancePage />}
      />

      {/* 운영 메뉴 > 정산·입금 */}
      <Route path="/schedules/:scheduleId/operations/payments" element={<PaymentsPage tab="receipts" />} />
      <Route path="/schedules/:scheduleId/operations/payments/members" element={<PaymentsPage tab="members" />} />
      <Route path="/schedules/:scheduleId/operations/payments/notice" element={<PaymentsPage tab="notice" />} />
      <Route path="/schedules/:scheduleId/operations/payments/receipts/camera" element={<ReceiptCameraPage />} />
      <Route path="/schedules/:scheduleId/operations/payments/receipts/new" element={<ReceiptResultPage key="scan" mode="scan" />} />
      <Route path="/schedules/:scheduleId/operations/payments/receipts/manual" element={<ReceiptResultPage key="manual" mode="manual" />} />
      <Route path="/schedules/:scheduleId/operations/payments/receipts/:receiptId" element={<ReceiptEditRoute />} />
      <Route path="/schedules/:scheduleId/operations/payments/rounds/edit" element={<RoundEditPage />} />
      <Route path="/schedules/:scheduleId/operations/payments/rounds/:round" element={<RoundRosterPage />} />

      <Route
        path="/schedules/:scheduleId/operations/:menuId"
        element={<ScheduleOperationPage />}
      />

      <Route
        path="/operations"
        element={<OperationsRoute />}
      />

      {/* AI 운영 비서 */}
      <Route path="/ai" element={<AssistantPage />} />

      {/* 부원 명단 목록 */}
      <Route
        element={
          <MainLayout
            title="부원"
            showBack={false}
            headerAlign="left"
          />
        }
      >
        <Route
          path="/members"
          element={
            <MemberListRoute />
          }
        />
      </Route>

      {/* 새 명단방 생성 */}
      <Route
        element={
          <MainLayout
            title="새 명단방 만들기"
            showBack
            showFooter={false}
          />
        }
      >
        <Route
          path="/members/new"
          element={
            <MemberCreateRoute />
          }
        />
      </Route>

      {/* 부원 등록 폼 */}
      <Route
        path="/members/register/:token"
        element={<MemberRegisterPage />}
      />

      {/* 탭 1. 명단 조회 */}
      <Route
        path="/members/:id"
        element={<MemberDetailRoute />}
      />

      {/* 탭 2. 링크 관리 */}
      <Route
        path="/members/:id/link"
        element={<MemberLinkRoute />}
      />

      {/* 탭 3. 명단방 수정 */}
      <Route
        path="/members/:id/settings"
        element={<MemberSettingsRoute />}
      />

      {/* 부원 추가 */}
      <Route
        path="/members/:id/add"
        element={<MemberAddRoute />}
      />

      {/* 부원 정보 수정 */}
      <Route
        path="/members/:id/edit/:memberId"
        element={<MemberEditRoute />}
      />

      {/* 404 페이지 */}
      <Route
        element={
          <MainLayout title="페이지를 찾을 수 없어요" />
        }
      >
        <Route
          path="*"
          element={<p>주소를 확인해주세요.</p>}
        />
      </Route>
    </Routes>
    <AlertModal />
    </>
  )
}

const Placeholder = styled.p`
  font-size: 14px;
  line-height: 20px;
  color: var(--color-muted);
`
