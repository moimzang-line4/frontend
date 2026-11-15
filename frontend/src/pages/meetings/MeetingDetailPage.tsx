import { isAxiosError } from 'axios'
import { Link, useNavigate, useParams } from 'react-router'

import Header from '../../layouts/Header'
import { useGetMeetingDetail } from '../../api/generated'
import useMeetingCategoriesApi from '../../hooks/meetings/useMeetingCategoriesApi'

import * as S from '../../styles/meetings/MeetingPage.styles'

function getErrorMessage(caught: unknown) {
  if (isAxiosError(caught)) {
    if (caught.response?.status === 404) {
      return '삭제되었거나 존재하지 않는 회의록이에요.'
    }

    return caught.response
      ? '회의록을 불러오지 못했어요.'
      : '서버에 연결하지 못했어요.'
  }

  return caught instanceof Error
    ? caught.message
    : '회의록을 불러오지 못했어요.'
}

export default function MeetingDetailPage() {
  const { meetingId } = useParams()
  const navigate = useNavigate()

  const categoriesApi = useMeetingCategoriesApi()

  const numericId = Number(meetingId)

  const validId =
    !!meetingId &&
    /^\d+$/.test(meetingId) &&
    Number.isSafeInteger(numericId) &&
    numericId > 0

  const query = useGetMeetingDetail(validId ? numericId : 0, {
    query: {
      enabled: validId,
      staleTime: 30_000,
      retry: false,

      select: response => {
        const body = response.data

        if (body.success !== true || !body.data) {
          throw new Error(
            body.message || '회의록을 불러오지 못했어요.',
          )
        }

        const data = body.data

        if (
          data.meetingId !== numericId ||
          typeof data.title !== 'string' ||
          typeof data.meetingDate !== 'string' ||
          !Array.isArray(data.agendas) ||
          (
            data.status !== 'IN_PROGRESS' &&
            data.status !== 'COMPLETED'
          )
        ) {
          throw new Error('서버의 회의 정보를 확인할 수 없어요.')
        }

        for (const agenda of data.agendas) {
          if (
            typeof agenda.agendaId !== 'number' ||
            !Number.isSafeInteger(agenda.agendaId) ||
            agenda.agendaId <= 0 ||
            typeof agenda.content !== 'string' ||
            (
              agenda.status !== 'PENDING' &&
              agenda.status !== 'IN_PROGRESS' &&
              agenda.status !== 'COMPLETED'
            )
          ) {
            throw new Error('서버의 안건 정보를 확인할 수 없어요.')
          }
        }

        return {
          ...data,
          title: data.title,
          meetingDate: data.meetingDate,
          agendas: data.agendas,
        }
      },
    },

    axios: {
      timeout: 15000,
    },
  })

  const meeting = query.data
  const caught: unknown = query.error

  const errorMessage = !validId
    ? '올바른 회의 ID가 아니에요.'
    : caught
      ? getErrorMessage(caught)
      : ''

  const category = categoriesApi.categories.find(
    item => item.id === String(meeting?.categoryId),
  )

  const categoryName = categoriesApi.loading
    ? '불러오는 중…'
    : category?.label ?? '카테고리 정보를 확인할 수 없어요'

  function back() {
    navigate(
      meeting?.status === 'COMPLETED'
        ? '/operations?type=minute&period=past'
        : '/operations?type=minute',
    )
  }

  if (query.isLoading) {
    return (
      <S.Page>
        <Header title="회의록" onBack={back} />

        <S.Notice>
          <p role="status">회의록을 불러오는 중이에요.</p>
        </S.Notice>
      </S.Page>
    )
  }

  if (errorMessage || !meeting) {
    return (
      <S.Page>
        <Header title="회의록" onBack={back} />

        <S.Notice>
          <h1>회의록을 불러오지 못했어요</h1>

          <p role="alert">
            {errorMessage || '회의록을 찾을 수 없어요.'}
          </p>

          {validId && (
            <S.OutlineButton
              type="button"
              disabled={query.isFetching}
              onClick={() => void query.refetch()}
            >
              {query.isFetching
                ? '불러오는 중…'
                : '다시 불러오기'}
            </S.OutlineButton>
          )}

          <Link to="/operations?type=minute">
            회의록 목록으로 이동
          </Link>
        </S.Notice>
      </S.Page>
    )
  }

  return (
    <S.Page>
      <Header title="회의록" onBack={back} />

      <S.Content>
        <S.Heading>
          <h2>{meeting.title}</h2>

          <p>
            {meeting.meetingDate.replaceAll('-', '.')} ·{' '}
            {meeting.status === 'COMPLETED'
              ? '완료'
              : '진행 중'}
          </p>
        </S.Heading>

        <S.Card>
          <S.Row>
            <label htmlFor="detail-meeting-title">
              회의 제목
            </label>

            <input
              id="detail-meeting-title"
              value={meeting.title}
              readOnly
            />
          </S.Row>

          <S.Row>
            <label htmlFor="detail-meeting-date">
              회의 날짜
            </label>

            <input
              id="detail-meeting-date"
              value={meeting.meetingDate}
              readOnly
            />
          </S.Row>

          <S.Row>
            <label htmlFor="detail-meeting-category">
              카테고리
            </label>

            <input
              id="detail-meeting-category"
              value={categoryName}
              readOnly
            />
          </S.Row>

          <S.Row>
            <label htmlFor="detail-meeting-attendees">
              참석자
            </label>

            <input
              id="detail-meeting-attendees"
              value={meeting.attendees ?? ''}
              readOnly
            />
          </S.Row>
        </S.Card>

        {categoriesApi.errorMessage && (
          <div>
            <S.Error role="alert">
              {categoriesApi.errorMessage}
            </S.Error>

            {categoriesApi.canRetry && (
              <S.OutlineButton
                type="button"
                disabled={categoriesApi.refreshing}
                onClick={() => void categoriesApi.reload()}
              >
                카테고리 다시 불러오기
              </S.OutlineButton>
            )}
          </div>
        )}

        {meeting.agendas.map((agenda, index) => (
          <S.RunCard key={agenda.agendaId}>
            <S.RunHeading>
              <h3>안건 {index + 1}</h3>

              <S.Status
                $done={agenda.status === 'COMPLETED'}
              >
                {agenda.status === 'COMPLETED'
                  ? '완료'
                  : agenda.status === 'IN_PROGRESS'
                    ? '진행 중'
                    : '대기'}
              </S.Status>
            </S.RunHeading>

            <S.Preparation>
              {agenda.content}
            </S.Preparation>

            <S.RunField>
              논의 내용

              <S.Textarea
                aria-label={`안건 ${index + 1} 논의 내용`}
                value={agenda.discussionNote ?? ''}
                readOnly
              />
            </S.RunField>

            <S.RunField>
              결정 사항

              <S.Textarea
                aria-label={`안건 ${index + 1} 결정 사항`}
                value={agenda.decision ?? ''}
                readOnly
              />
            </S.RunField>
          </S.RunCard>
        ))}
      </S.Content>
    </S.Page>
  )
}