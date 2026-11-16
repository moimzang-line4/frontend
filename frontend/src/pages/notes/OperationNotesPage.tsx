import { useState } from 'react'
import {
  Link,
  useNavigate,
  useSearchParams,
} from 'react-router'

import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'

import OperationNoteCard from '../../components/notes/OperationNoteCard'
import NoteUnavailable from '../../components/notes/NoteUnavailable'

import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useServerOperationNotes from '../../hooks/notes/useServerOperationNotes'

import { noteTypes } from '../../constants/notes/noteTypes'
import searchIcon from '../../assets/notes/search.svg'

import * as S from '../../styles/notes/NotesPage.styles'

export default function OperationNotesPage() {
  const navigate = useNavigate()
  const detail = useScheduleDetail()
  const { schedule } = detail

  const [params, setParams] = useSearchParams()
  const [query, setQuery] = useState('')

  const selectedType =
    noteTypes.find(
      type => type.value === params.get('type'),
    )?.value ?? 'all'

  const data = useServerOperationNotes(
    schedule?.operationMenuCount !== undefined
      ? schedule.id
      : '',
    selectedType,
    query,
  )

  if (!schedule) {
    return (
      <S.Page $footer>
        <Header
          title="운영 메모"
          onBack={() => navigate('/operations')}
        />

        <S.Notice>
          {detail.loading ? (
            <p role="status">
              일정을 불러오는 중이에요.
            </p>
          ) : (
            <>
              <S.Error role="alert">
                {detail.errorMessage ||
                  '일정을 찾을 수 없어요.'}
              </S.Error>

              <S.Filter
                type="button"
                $active={false}
                disabled={detail.refreshing}
                onClick={() => void detail.reload()}
              >
                {detail.refreshing
                  ? '불러오는 중…'
                  : '다시 불러오기'}
              </S.Filter>
            </>
          )}
        </S.Notice>

        <Footer />
      </S.Page>
    )
  }

  if (schedule.operationMenuCount === undefined) {
    return (
      <NoteUnavailable
        title="운영 메모"
        message="운영 메모를 사용할 일정을 찾을 수 없어요"
        backPath="/operations"
      />
    )
  }

  const basePath =
    `/schedules/${encodeURIComponent(schedule.id)}/operations/notes`

  function selectType(type: string) {
    setParams(
      current => {
        const next = new URLSearchParams(current)

        if (type === 'all') {
          next.delete('type')
        } else {
          next.set('type', type)
        }

        return next
      },
      { replace: true },
    )
  }

  return (
    <S.Page $footer>
      <Header
        title="운영 메모"
        onBack={() =>
          navigate(
            `/schedules/${encodeURIComponent(schedule.id)}`,
          )
        }
      />

      <S.ListContent>
        <S.Search>
          <img
            src={searchIcon}
            alt=""
            width={18}
            height={18}
          />

          <input
            type="search"
            aria-label="메모 검색"
            placeholder="메모 제목, 내용, 담당자 검색"
            value={query}
            onChange={event =>
              setQuery(event.target.value)
            }
          />
        </S.Search>

        <S.Filters aria-label="메모 유형 필터">
          {[
            { value: 'all', label: '전체' },
            ...noteTypes,
          ].map(type => (
            <S.Filter
              key={type.value}
              type="button"
              $active={selectedType === type.value}
              aria-pressed={selectedType === type.value}
              onClick={() => selectType(type.value)}
            >
              {type.label}
            </S.Filter>
          ))}
        </S.Filters>

        <S.Heading>
          <h2>메모 목록 {data.totalCount}</h2>

          <Link to={`${basePath}/new`}>
            + 새 메모
          </Link>
        </S.Heading>

        {data.errorMessage && (
          <div>
            <S.Error role="alert">
              {data.errorMessage}
            </S.Error>

            <S.Filter
              type="button"
              $active={false}
              disabled={data.refreshing}
              onClick={() => void data.reload()}
            >
              {data.refreshing
                ? '불러오는 중…'
                : '다시 불러오기'}
            </S.Filter>
          </div>
        )}

        {data.loading ? (
          <S.Empty role="status">
            운영 메모를 불러오는 중이에요.
          </S.Empty>
        ) : data.notes.length ? (
          <S.List aria-label="운영 메모 목록">
            {data.notes.map(note => (
              <li key={note.id}>
                <OperationNoteCard
                  note={note}
                  basePath={basePath}
                />
              </li>
            ))}
          </S.List>
        ) : !data.errorMessage ? (
          <S.Empty>
            {query.trim()
              ? '검색 결과가 없어요.'
              : selectedType === 'all'
                ? '아직 등록된 운영 메모가 없어요.'
                : '이 유형의 운영 메모가 없어요.'}
          </S.Empty>
        ) : null}
      </S.ListContent>

      <Footer />
    </S.Page>
  )
}