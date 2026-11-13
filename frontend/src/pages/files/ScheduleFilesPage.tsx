import { useState } from 'react'
import { useNavigate } from 'react-router'
import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import BottomSheet from '../../components/BottomSheet'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import FilePreview from '../../components/files/FilePreview'
import FileUploadSheet from '../../components/files/FileUploadSheet'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useScheduleFiles from '../../hooks/files/useScheduleFiles'
import { fileCategories } from '../../types/files/file'
import type { FileCategory, ScheduleFile } from '../../types/files/file'
import { downloadArchive, downloadBlob } from '../../utils/files/download'
import searchIcon from '../../assets/files/search.svg'
import paperIcon from '../../assets/files/paper.svg'
import moreIcon from '../../assets/files/more.svg'
import previewIcon from '../../assets/files/preview.svg'
import downloadIcon from '../../assets/files/download.svg'
import deleteIcon from '../../assets/files/delete.svg'
import * as S from '../../styles/files/FilesPage.styles'

function sizeLabel(bytes: number) {
  if (bytes < 1024) return `${bytes}B`
  if (bytes < 1024 * 1024) return `${Math.ceil(bytes / 1024)}KB`
  return `${(bytes / 1024 / 1024).toFixed(1)}MB`
}
function dateLabel(time: number) {
  const date = new Date(time)
  return `${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`
}

export default function ScheduleFilesPage() {
  const { schedule } = useScheduleDetail()
  if (!schedule || schedule.operationMenuCount === undefined) return <S.Page><Header title="자료" /><S.Content><S.Empty>자료를 확인할 일정을 찾을 수 없어요.</S.Empty></S.Content><Footer /></S.Page>
  return <FileList key={schedule.id} scheduleId={schedule.id} />
}

function FileList({ scheduleId }: { scheduleId: string }) {
  const navigate = useNavigate()
  const { files, loading, error, reload, upload, remove } = useScheduleFiles(scheduleId)
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState<FileCategory | '전체'>('전체')
  const [sort, setSort] = useState('newest')
  const [uploading, setUploading] = useState(false)
  const [menu, setMenu] = useState<ScheduleFile | null>(null)
  const [preview, setPreview] = useState<ScheduleFile | null>(null)
  const [deleting, setDeleting] = useState<ScheduleFile | null>(null)
  const [downloading, setDownloading] = useState(false)
  const [downloadError, setDownloadError] = useState('')
  const visible = files.filter(file => (category === '전체' || file.category === category) && file.name.toLocaleLowerCase().includes(search.trim().toLocaleLowerCase()))
    .sort((a, b) => sort === 'name' ? a.name.localeCompare(b.name, 'ko') : sort === 'oldest' ? a.createdAt - b.createdAt : b.createdAt - a.createdAt)
  return <S.Page>
    <Header title="자료" onBack={() => navigate(`/schedules/${encodeURIComponent(scheduleId)}`)} />
    <S.Content aria-label="일정 자료">
      <S.SearchRow><S.Search><img src={searchIcon} alt="" width={20} height={20} /><input aria-label="자료 검색" placeholder="자료 검색" type="search" value={search} onChange={event => setSearch(event.target.value)} /></S.Search><S.Attach type="button" disabled={loading || !!error} onClick={() => setUploading(true)}>＋ 파일 첨부</S.Attach></S.SearchRow>
      <S.Tabs role="group" aria-label="자료 분류">{(['전체', ...fileCategories] as const).map(value => <S.Tab type="button" key={value} $active={category === value} aria-pressed={category === value} onClick={() => setCategory(value)}>{value}</S.Tab>)}</S.Tabs>
      <S.Summary><strong aria-live="polite">총 {visible.length}개</strong><select aria-label="자료 정렬" value={sort} onChange={event => setSort(event.target.value)}><option value="newest">최신순</option><option value="oldest">오래된순</option><option value="name">이름순</option></select></S.Summary>
      <S.DownloadAll type="button" disabled={!visible.length || downloading} onClick={async () => {
        setDownloading(true); setDownloadError('')
        try { await downloadArchive(visible) } catch { setDownloadError('다운로드하지 못했어요. 다시 시도해주세요.') } finally { setDownloading(false) }
      }}><img src={downloadIcon} alt="" />{downloading ? '압축 중…' : `전체 다운로드(${visible.length})`}</S.DownloadAll>
      {error && <><S.ErrorText role="alert">{error}</S.ErrorText><S.Attach type="button" onClick={() => void reload()}>다시 불러오기</S.Attach></>}
      {downloadError && <S.ErrorText role="alert">{downloadError}</S.ErrorText>}
      {loading ? <S.Empty role="status">자료를 불러오는 중이에요.</S.Empty> : !error && !visible.length ? <S.Empty>{files.length ? '검색 조건에 맞는 자료가 없어요.' : '등록된 자료가 없어요. 파일을 첨부해보세요.'}</S.Empty> : <S.List>{visible.map(file => <S.Card key={file.id}>
        <S.FileButton type="button" onClick={() => setPreview(file)} aria-label={`${file.name} 미리보기`}><img src={paperIcon} alt="" width={20} height={20} /><span><strong>{file.name}</strong><small>{file.category} · {dateLabel(file.createdAt)} · {sizeLabel(file.blob.size)}</small></span></S.FileButton>
        <S.More type="button" aria-label={`${file.name} 더보기`} onClick={() => setMenu(file)}><img src={moreIcon} alt="" width={16} height={16} /></S.More>
      </S.Card>)}</S.List>}
    </S.Content>
    <Footer />
    {uploading && <FileUploadSheet initialCategory={category === '전체' ? '활동 문서' : category} onClose={() => setUploading(false)} onUpload={upload} />}
    {menu && <BottomSheet title={menu.name} onClose={() => setMenu(null)}>{close => <>
      <S.Action type="button" onClick={() => close(() => setPreview(menu))}><img src={previewIcon} alt="" />문서 미리보기</S.Action>
      <S.Action type="button" onClick={() => { downloadBlob(menu.blob, menu.name); close() }}><img src={downloadIcon} alt="" />다운로드</S.Action>
      <S.Action type="button" $danger onClick={() => close(() => setDeleting(menu))}><img src={deleteIcon} alt="" />삭제</S.Action>
    </>}</BottomSheet>}
    {preview && <FilePreview file={preview} onClose={() => setPreview(null)} />}
    <ConfirmDialog open={!!deleting} title="자료를 삭제할까요?" description={deleting ? `${deleting.name} 파일을 삭제하면 복구할 수 없어요.` : undefined} confirmText="삭제" onCancel={() => setDeleting(null)} onConfirm={async () => { if (deleting) { await remove(deleting); setDeleting(null) } }} />
  </S.Page>
}
