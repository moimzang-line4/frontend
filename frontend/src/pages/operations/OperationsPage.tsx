import { useState } from 'react'
import { useNavigate } from 'react-router'

import MainLayout from '../../layouts/MainLayout'
import CreateOperationSheet from '../../components/operations/CreateOperationSheet'
import SortOperationSheet from '../../components/operations/SortOperationSheet'
import MeetingCard from '../../components/meetings/MeetingCard'
import GroupTermSelect from '../../components/groups/GroupTermSelect'

import { sortLabels } from '../../constants/operations/sortOptions'
import useOperationRecords from '../../hooks/operations/useOperationRecords'
import type { OperationFilter } from '../../types/operations/operation'

import searchIcon from '../../assets/operations/search.svg'
import caretIcon from '../../assets/operations/caret.svg'
import chevronIcon from '../../assets/operations/record-chevron.svg'

import * as S from '../../styles/operations/OperationsPage.styles'

export default function OperationsPage() {
  const navigate = useNavigate()
  const data = useOperationRecords()

  const [modal, setModal] = useState<'create' | 'sort' | null>(null)

  return (
    <MainLayout title="운영 공간" showBack={false} headerAlign="left" home>
      <S.Content>
        <GroupTermSelect aria-label="조회할 운영 기수" />

        <S.Tabs aria-label="운영 기록 기간">
          {[
            { value: false, label: '진행 중' },
            { value: true, label: '지난 기록' },
          ].map((tab) => (
            <S.Tab
              key={tab.label}
              type="button"
              $active={data.past === tab.value}
              aria-pressed={data.past === tab.value}
              onClick={() => data.setPast(tab.value)}
            >
              {tab.label}
            </S.Tab>
          ))}
        </S.Tabs>

        <S.SearchRow>
          <S.Search>
            <img src={searchIcon} alt="" width={20} height={20} />

            <input
              type="search"
              aria-label="일정·회의록 검색"
              placeholder="일정·회의록 검색"
              value={data.query}
              onChange={(event) => data.setQuery(event.target.value)}
            />
          </S.Search>

          <S.Sort
            type="button"
            aria-label={`기록 정렬: ${sortLabels[data.sort]}`}
            aria-haspopup="dialog"
            aria-expanded={modal === 'sort'}
            onClick={() => setModal('sort')}
          >
            {sortLabels[data.sort]}

            <img src={caretIcon} alt="" width={12} height={12} />
          </S.Sort>
        </S.SearchRow>

        <S.Filters aria-label="운영 기록 유형">
          {(
            [
              ['all', '전체'],
              ['schedule', '일정 운영'],
              ['minute', '회의록'],
            ] as [OperationFilter, string][]
          ).map(([value, label]) => (
            <S.Filter
              key={value}
              type="button"
              $active={data.filter === value}
              aria-pressed={data.filter === value}
              onClick={() => data.setFilter(value)}
            >
              {label}
            </S.Filter>
          ))}
        </S.Filters>

        <S.Heading>
          <h2>
            {data.filter === 'minute'
              ? '회의록'
              : data.filter === 'schedule'
                ? '일정 운영'
                : '전체'}{' '}
            {data.totalCount}
          </h2>

          <button
            type="button"
            aria-haspopup={data.filter === 'minute' ? undefined : 'dialog'}
            onClick={() =>
              data.filter === 'minute'
                ? navigate('/meetings/new')
                : setModal('create')
            }
          >
            {data.filter === 'minute' ? '＋ 새 메모' : '＋ 만들기'}
          </button>
        </S.Heading>

        {data.errorMessage && (
  <div>
    <p role="alert">{data.errorMessage}</p>

    {data.canRetry && (
      <button
        type="button"
        disabled={data.refreshing}
        onClick={() => void data.reload()}
      >
        {data.refreshing ? '불러오는 중…' : '다시 불러오기'}
      </button>
    )}
  </div>
)}

{data.loading ? (
  <S.Empty role="status">
    운영 기록을 불러오는 중이에요.
  </S.Empty>
) : data.records.length > 0 ? (
  <S.Records aria-label="운영 기록 목록">
    {data.records.map(record => (
      <li key={`${record.kind}-${record.id}`}>
        <S.Record
          type="button"
          onClick={() =>
            navigate(
              record.kind === 'schedule'
                ? `/schedules/${encodeURIComponent(record.id)}`
                : `/meetings/${encodeURIComponent(record.id)}`,
            )
          }
        >
          <div>
            <S.Badge $minute={record.kind === 'minute'}>
              {record.kind === 'minute'
                ? '회의록'
                : '일정 운영'}
            </S.Badge>

            <div>
              <h3>{record.title}</h3>

              <p>
                {record.date.replaceAll('-', '.')} ·{' '}
                {record.past ? '지난 기록' : '진행 중'}
              </p>
            </div>
          </div>

          <img
            src={chevronIcon}
            alt=""
            width={24}
            height={24}
          />
        </S.Record>
      </li>
    ))}
  </S.Records>
) : !data.errorMessage ? (
  <S.Empty>
    {data.query.trim()
      ? '검색 결과가 없어요.'
      : '아직 운영 기록이 없어요.'}
  </S.Empty>
) : null}

{data.hasMore && (
  <S.Sort
    type="button"
    disabled={data.refreshing}
    onClick={() => void data.loadMore()}
  >
    {data.loadingMore ? '불러오는 중…' : '더 보기'}
  </S.Sort>
)}
      </S.Content>

      {modal === 'sort' && (
        <SortOperationSheet
          selected={data.sort}
          onSelect={data.setSort}
          onClose={() => setModal(null)}
        />
      )}

      {modal === 'create' && (
        <CreateOperationSheet
          onClose={() => setModal(null)}
          onSchedule={() => navigate('/schedules/new?from=operations')}
          onMinute={() => navigate('/meetings/new')}
        />
      )}
    </MainLayout>
  )
}
