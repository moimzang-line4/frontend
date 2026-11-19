import type { ReactNode } from 'react'
import FileThumbnail from './FileThumbnail'
import { previewKind } from '../../utils/files/preview'
import FileViewIcon from './FileViewIcon'
import pictureIcon from '../../assets/files/picture.svg'
import pictureSmallIcon from '../../assets/files/picture-small.svg'
import DropdownSelect from '../common/DropdownSelect'
import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import GroupTermSelect from '../groups/GroupTermSelect'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FileActionsSheet from '../../components/files/FileActionsSheet'
import FileDeletionToast from './FileDeletionToast'
import StatusToast from '../../components/common/StatusToast'
import {
  fileDateLabel as dateLabel,
  fileSizeLabel as sizeLabel,
} from '../../utils/files/format'
import useScheduleFiles from '../../hooks/files/useScheduleFiles'
import { fileCategories } from '../../types/files/file'
import type { FileCategory, ScheduleFile } from '../../types/files/file'
import { downloadArchive } from '../../utils/files/download'
import searchIcon from '../../assets/files/search.svg'
import paperIcon from '../../assets/files/paper.svg'
import moreIcon from '../../assets/files/more.svg'
import downloadIcon from '../../assets/files/download.svg'
import * as S from '../../styles/files/FilesPage.styles'

type FileListProps = {
  scheduleId: string
  scheduleTitle: string
  listPath?: string
  documentView?: boolean
  generationLabel?: string
  ledgerContent?: ReactNode | ((search: string) => ReactNode)
}

export default function FileLibrary({
  scheduleId,
  scheduleTitle,
  listPath = `/schedules/${encodeURIComponent(scheduleId)}/operations/files`,
  documentView = false,
  ledgerContent,
}: FileListProps) {
  const navigate = useNavigate()
  const location = useLocation()
  const uploadedFileName: unknown = location.state?.uploadedFileName
  const { files, loading, error, reload, remove } = useScheduleFiles(scheduleId)

  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<FileCategory | '전체' | '장부'>(
    () => (location.state?.tab === '장부' ? '장부' : '전체'),
  )
  const [sort, setSort] = useState('newest')
  const [view, setView] = useState<'list' | 'grid'>('list')
  const [menu, setMenu] = useState<ScheduleFile | null>(null)
  const [deleting, setDeleting] = useState<ScheduleFile | null>(null)
  const [downloadSelection, setDownloadSelection] = useState<{
    files: ScheduleFile[]
    label: string
  } | null>(null)

  function previewFile(file: ScheduleFile) {
    navigate(`${listPath}/${encodeURIComponent(file.id)}`)
  }

  const visible = files
    .filter(
      (file) =>
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

  const attachControl = (
    <S.Attach
      type="button"
      disabled={loading || !!error}
      onClick={() => navigate(`${listPath}/new`, { state: { category } })}
    >
      ＋ 파일 첨부
    </S.Attach>
  )
  const sortControl = (
    <DropdownSelect
      variant="inline"
      aria-label="자료 정렬"
      value={sort}
      onChange={event => setSort(event.target.value)}
      options={[
        { value: 'newest', label: '최신순' },
        { value: 'oldest', label: '오래된순' },
        { value: 'name', label: '이름순' },
      ]}
    />
  )

  return (
    <S.Page>
      <Header
        title={documentView ? '문서함' : '자료'}
        showBack={!documentView}
        align={documentView ? 'left' : 'center'}
        onBack={() =>
          navigate(
            documentView ? '/' : `/schedules/${encodeURIComponent(scheduleId)}`,
          )
        }
      />

      <S.Content aria-label={documentView ? '문서함 자료' : '일정 자료'}>
        {documentView && (
  <GroupTermSelect aria-label="자료실 기수" />
)}
        {/* 장부 탭은 장부 안에 '항목 검색'이 따로 있음 */}
        {!(documentView && category === '장부') && (
        <S.SearchRow>
          <S.Search>
            <img src={searchIcon} alt="" width={20} height={20} />
            <input
              aria-label="자료 검색"
              placeholder="자료 검색"
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </S.Search>

          {documentView ? attachControl : sortControl}
        </S.SearchRow>
        )}

        <S.Tabs role="group" aria-label="자료 분류">
          {(documentView
            ? (['전체', '활동 문서', '예산·회계', '장부', '활동사진'] as const)
            : (['전체', ...fileCategories] as const)
          ).map((value) => (
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

        {category === '장부' ? (
          ((typeof ledgerContent === 'function'
            ? ledgerContent(search)
            : ledgerContent) ?? <S.Empty>연결된 장부가 없어요.</S.Empty>)
        ) : (
          <>
            <S.Summary>
              <strong aria-live="polite">총 {visible.length}개</strong>
              {documentView ? sortControl : attachControl}
            </S.Summary>

            <S.ViewToolbar>
  <S.ViewOptions role="group" aria-label="보기 형태">
    {(
      [
        ['list', '목록 보기'],
        ['grid', '격자 보기'],
      ] as const
    ).map(([value, label]) => (
      <S.ViewButton
        key={value}
        type="button"
        aria-label={label}
        aria-pressed={view === value}
        onClick={() => setView(value)}
      >
        <FileViewIcon view={value} />
      </S.ViewButton>
    ))}
  </S.ViewOptions>

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
</S.ViewToolbar>

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
            ) : view === 'grid' ? (
              <S.Grid>
                {visible.map((file) => (
                  <S.GridCard key={file.id}>
                    <S.GridFileButton
                      type="button"
                      onClick={() => previewFile(file)}
                      aria-label={`${file.name} 미리보기`}
                    >
                      <S.Thumbnail>
                        <FileThumbnail file={file} />
                        <S.ThumbnailLabel>
                          <img
                            src={pictureSmallIcon}
                            alt=""
                            width={12}
                            height={12}
                          />
                          {file.name.split('.').pop()?.toUpperCase()} ·{' '}
                          {sizeLabel(file.size)}
                        </S.ThumbnailLabel>
                      </S.Thumbnail>
                      <strong>{file.name}</strong>
                      <small>
                        {file.category} · {dateLabel(file.createdAt)}
                      </small>
                    </S.GridFileButton>
                    <S.GridMore
                      type="button"
                      aria-label={`${file.name} 더보기`}
                      onClick={() => setMenu(file)}
                    >
                      <img src={moreIcon} alt="" width={16} height={16} />
                    </S.GridMore>
                  </S.GridCard>
                ))}
              </S.Grid>
            ) : (
              <S.List>
                {visible.map((file) => (
                  <S.Card key={file.id}>
                    <S.FileButton
                      type="button"
                      onClick={() => previewFile(file)}
                      aria-label={`${file.name} 미리보기`}
                    >
                      <img
                        src={
                          previewKind(file) === 'image'
                            ? pictureIcon
                            : paperIcon
                        }
                        alt=""
                        width={20}
                        height={20}
                      />
                      <span>
                        <strong>{file.name}</strong>
                        <small>
                          {file.category} · {dateLabel(file.createdAt)} ·{' '}
                          {sizeLabel(file.size)}
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
          </>
        )}
      </S.Content>

      <Footer />
      <FileDeletionToast scopeId={scheduleId} />

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
            <p>
              {scheduleTitle} · {downloadSelection?.label}
            </p>
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
        description={deleting ? deleting.name : undefined}
        confirmText="삭제"
        onCancel={() => setDeleting(null)}
        onConfirm={async () => {
          if (!deleting) return
          await remove(deleting)
          if (location.state?.uploadedFileName)
            navigate(location.pathname, { replace: true, state: null })
          setDeleting(null)
        }}
      />
    </S.Page>
  )
}
