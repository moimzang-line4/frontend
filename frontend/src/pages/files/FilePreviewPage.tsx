import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import FilePreview from '../../components/files/FilePreview'
import FileActionsSheet from '../../components/files/FileActionsSheet'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import useScheduleFiles from '../../hooks/files/useScheduleFiles'
import { downloadBlob } from '../../utils/files/download'
import { fileSizeLabel } from '../../utils/files/format'
import backIcon from '../../assets/navigation/back.svg'
import downloadIcon from '../../assets/files/preview-download.svg'
import * as S from '../../styles/files/FilePreviewPage.styles'

export default function FilePreviewPage() {
  const { schedule } = useScheduleDetail()
  if (!schedule || schedule.operationMenuCount === undefined) return <S.Page><S.Main><S.Notice>자료를 확인할 일정을 찾을 수 없어요.</S.Notice></S.Main></S.Page>
  return <Preview key={schedule.id} scheduleId={schedule.id} />
}

function Preview({ scheduleId }: { scheduleId: string }) {
  const { fileId } = useParams()
  const navigate = useNavigate()
  const { files, loading, error, reload, remove } = useScheduleFiles(scheduleId)
  const file = files.find(item => item.id === fileId)
  const [menu, setMenu] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const listPath = `/schedules/${encodeURIComponent(scheduleId)}/operations/files`
  return <S.Page>
    <S.Header>
      <S.IconButton type="button" aria-label="자료 목록으로" onClick={() => navigate(listPath)}><img src={backIcon} alt="" width={24} height={24} /></S.IconButton>
      <h1 title={file?.name}>{file?.name ?? '자료 미리보기'}</h1>
      {file && <>
        <S.IconButton type="button" aria-label="파일 다운로드" onClick={() => downloadBlob(file.blob, file.name)}><img src={downloadIcon} alt="" width={22} height={22} /></S.IconButton>
        <S.IconButton type="button" aria-label="파일 더보기" onClick={() => setMenu(true)}>⋮</S.IconButton>
      </>}
    </S.Header>
    <S.Main>
      {loading ? <S.Notice role="status">자료를 불러오는 중이에요.</S.Notice> : error ? <><S.Notice role="alert">{error}</S.Notice><button type="button" onClick={() => void reload()}>다시 불러오기</button></> : !file ? <S.Notice>삭제되었거나 이 일정에 없는 자료예요.</S.Notice> : <>
        <S.Info>{file.name.includes('.') ? file.name.split('.').pop()?.toUpperCase() : '파일'} · {fileSizeLabel(file.blob.size)}</S.Info>
        <FilePreview key={file.id} file={file} />
      </>}
    </S.Main>
    {menu && file && <FileActionsSheet file={file} onClose={() => setMenu(false)} onDelete={() => setDeleting(true)} />}
    <ConfirmDialog open={deleting && !!file} title="자료를 삭제할까요?" description={file ? `${file.name} 파일을 삭제하면 복구할 수 없어요.` : undefined} confirmText="삭제" onCancel={() => setDeleting(false)} onConfirm={async () => { if (file) { await remove(file); navigate(listPath, { replace: true }) } }} />
  </S.Page>
}
