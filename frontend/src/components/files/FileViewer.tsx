import { useState } from 'react'
import FilePreview from './FilePreview'
import FileActionsSheet from './FileActionsSheet'
import type { ScheduleFile } from '../../types/files/file'
import { downloadBlob } from '../../utils/files/download'
import { fileSizeLabel } from '../../utils/files/format'
import backIcon from '../../assets/navigation/back.svg'
import downloadIcon from '../../assets/files/preview-download.svg'
import * as S from '../../styles/files/FilePreviewPage.styles'

type Props = {
  file?: ScheduleFile
  loading: boolean
  error: string
  onReload: () => void | Promise<void>
  onBack: () => void
  onDelete: () => void
}

export default function FileViewer({
  file,
  loading,
  error,
  onReload,
  onBack,
  onDelete,
}: Props) {
  const [menu, setMenu] = useState(false)

  return (
    <S.Page>
      <S.Header>
        <S.IconButton type="button" aria-label="자료 목록으로" onClick={onBack}>
          <img src={backIcon} alt="" width={24} height={24} />
        </S.IconButton>
        <h1 title={file?.name}>{file?.name ?? '자료 미리보기'}</h1>
        {file && (
          <>
            <S.IconButton
              type="button"
              aria-label="파일 다운로드"
              onClick={() => downloadBlob(file.blob, file.name)}
            >
              <img src={downloadIcon} alt="" width={22} height={22} />
            </S.IconButton>
            <S.IconButton
              type="button"
              aria-label="파일 더보기"
              onClick={() => setMenu(true)}
            >
              ⋮
            </S.IconButton>
          </>
        )}
      </S.Header>
      <S.Main>
        {loading ? (
          <S.Notice role="status">자료를 불러오는 중이에요.</S.Notice>
        ) : error ? (
          <>
            <S.Notice role="alert">{error}</S.Notice>
            <button type="button" onClick={() => void onReload()}>
              다시 불러오기
            </button>
          </>
        ) : !file ? (
          <S.Notice>삭제되었거나 이 자료실에 없는 자료예요.</S.Notice>
        ) : (
          <>
            <S.Info>
              {file.name.includes('.')
                ? file.name.split('.').pop()?.toUpperCase()
                : '파일'}{' '}
              · {fileSizeLabel(file.blob.size)}
            </S.Info>
            <FilePreview key={file.id} file={file} />
          </>
        )}
      </S.Main>
      {menu && file && (
        <FileActionsSheet
          file={file}
          onClose={() => setMenu(false)}
          onDelete={onDelete}
        />
      )}
    </S.Page>
  )
}
