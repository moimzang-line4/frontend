import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FileActionsSheet from '../../components/files/FileActionsSheet'
import StatusToast from '../../components/common/StatusToast'
import {
  fileDateLabel as dateLabel,
  fileSizeLabel as sizeLabel,
} from '../../utils/files/format'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useScheduleFiles from '../../hooks/files/useScheduleFiles'
import { fileCategories } from '../../types/files/file'
import type { FileCategory, ScheduleFile } from '../../types/files/file'
import { downloadArchive } from '../../utils/files/download'
import searchIcon from '../../assets/files/search.svg'
import paperIcon from '../../assets/files/paper.svg'
import moreIcon from '../../assets/files/more.svg'
import downloadIcon from '../../assets/files/download.svg'
import * as S from '../../styles/files/FilesPage.styles'

export default function ScheduleFilesPage() {
  const { schedule } = useScheduleDetail()

  if (!schedule || schedule.operationMenuCount === undefined) {
    return (
      <S.Page>
        <Header title="자료" />
        <S.Content>
          <S.Empty>자료를 확인할 일정을 찾을 수 없어요.</S.Empty>
        </S.Content>
        <Footer />
      </S.Page>
    )
  }

  return (
    <FileList
      key={schedule.id}
      scheduleId={schedule.id}
      scheduleTitle={schedule.title}
    />
  )
}

type FileListProps = {
  scheduleId: string
  scheduleTitle: string
}

function FileList({ scheduleId, scheduleTitle }: FileListProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const uploadedFileName: unknown = location.state?.uploadedFileName
  const { files, loading, error, reload, remove } =
    useScheduleFiles(scheduleId)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<FileCategory | '전체'>('전체')
  const [sort, setSort] = useState('newest')
  const [menu, setMenu] = useState<ScheduleFile | null>(null)
  const [deleting, setDeleting] = useState<ScheduleFile | null>(null)
  const [downloadSelection, setDownloadSelection] = useState<{
    files: ScheduleFile[]
    label: string
  } | null>(null)

  const listPath =
    `/schedules/${encodeURIComponent(scheduleId)}/operations/files`

  function previewFile(file: ScheduleFile) {
    navigate(`${listPath}/${encodeURIComponent(file.id)}`)
  }

  const visible = files
    .filter(
      file =>
        (category === '전체' || file.category === category) &&
        file.name
          .toLocaleLowerCase()
          .includes(search.trim().toLocaleLowerCase()),
    )
    .sort((a, b) => {
      if (sort === 'name') return a.name.localeCompare(b.name, 'ko')
      if (sort === 'oldest') return a.createdAt - b.createdAt
      return b.createdAt - a.createdAt
    })

  return (
    <S.Page>
      <Header
        title="자료"
        onBack={() =>
          navigate(`/schedules/${encodeURIComponent(scheduleId)}`)
        }
      />

      <S.Content aria-label="일정 자료">
        <S.SearchRow>
          <S.Search>
            <img src={searchIcon} alt="" width={20} height={20} />
            <input
              aria-label="자료 검색"
              placeholder="자료 검색"
              type="search"
              value={search}
              onChange={event => setSearch(event.target.value)}
            />
          </S.Search>

          <S.Attach
            type="button"
            disabled={loading || !!error}
            onClick={() =>
              navigate(`${listPath}/new`, { state: { category } })
            }
          >
            ＋ 파일 첨부
          </S.Attach>
        </S.SearchRow>

        <S.Tabs role="group" aria-label="자료 분류">
          {(['전체', ...fileCategories] as const).map(value => (
            <S.Tab
              type="button"
              key={value}
              $active={category === value}
              aria-pressed={category === value}
              onClick={() => setCategory(value)}
            >
              {value}
            </S.Tab>
          ))}
        </S.Tabs>

        <S.Summary>
          <strong aria-live="polite">총 {visible.length}개</strong>
          <select
            aria-label="자료 정렬"
            value={sort}
            onChange={event => setSort(event.target.value)}
          >
            <option value="newest">최신순</option>
            <option value="oldest">오래된순</option>
            <option value="name">이름순</option>
          </select>
        </S.Summary>

        <S.DownloadAll
          type="button"
          disabled={!visible.length}
          onClick={() =>
            setDownloadSelection({
              files: visible,
              label: category === '전체' ? '전체 자료' : category,
            })
          }
        >
          <img src={downloadIcon} alt="" />
          전체 다운로드({visible.length})
        </S.DownloadAll>

        {error && (
          <>
            <S.ErrorText role="alert">{error}</S.ErrorText>
            <S.Attach type="button" onClick={() => void reload()}>
              다시 불러오기
            </S.Attach>
          </>
        )}

        {loading ? (
          <S.Empty role="status">자료를 불러오는 중이에요.</S.Empty>
        ) : !error && !visible.length ? (
          <S.Empty>
            {files.length
              ? '검색 조건에 맞는 자료가 없어요.'
              : '등록된 자료가 없어요. 파일을 첨부해보세요.'}
          </S.Empty>
        ) : (
          <S.List>
            {visible.map(file => (
              <S.Card key={file.id}>
                <S.FileButton
                  type="button"
                  onClick={() => previewFile(file)}
                  aria-label={`${file.name} 미리보기`}
                >
                  <img src={paperIcon} alt="" width={20} height={20} />
                  <span>
                    <strong>{file.name}</strong>
                    <small>
                      {file.category} · {dateLabel(file.createdAt)} ·{' '}
                      {sizeLabel(file.blob.size)}
                    </small>
                  </span>
                </S.FileButton>

                <S.More
                  type="button"
                  aria-label={`${file.name} 더보기`}
                  onClick={() => setMenu(file)}
                >
                  <img src={moreIcon} alt="" width={16} height={16} />
                </S.More>
              </S.Card>
            ))}
          </S.List>
        )}
      </S.Content>

      <Footer />

      {typeof uploadedFileName === 'string' && (
        <StatusToast
          title="자료가 업로드됐어요"
          description={uploadedFileName}
          aboveFooter
          autoCloseMs={5000}
          showProgress
          onClose={() =>
            navigate(location.pathname, { replace: true, state: null })
          }
        />
      )}

      {menu && (
        <FileActionsSheet
          file={menu}
          onClose={() => setMenu(null)}
          onPreview={() => previewFile(menu)}
          onDelete={() => setDeleting(menu)}
        />
      )}

      <ConfirmDialog
        open={!!downloadSelection}
        title={`자료 ${downloadSelection?.files.length ?? 0}개를 다운로드할까요?`}
        description={
          <>
            <p>{scheduleTitle} · {downloadSelection?.label}</p>
            <p>현재 목록의 파일을 ZIP으로 묶습니다.</p>
          </>
        }
        confirmText="다운로드"
        tone="primary"
        onCancel={() => setDownloadSelection(null)}
        onConfirm={async () => {
          if (!downloadSelection) return
          await downloadArchive(downloadSelection.files)
          setDownloadSelection(null)
        }}
      />

      <ConfirmDialog
        open={!!deleting}
        title="자료를 삭제할까요?"
        description={
          deleting
            ? `${deleting.name} 파일을 삭제하면 복구할 수 없어요.`
            : undefined
        }
        confirmText="삭제"
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return
          await remove(deleting)
          setDeleting(null)
        }}
      />
    </S.Page>
  )
}