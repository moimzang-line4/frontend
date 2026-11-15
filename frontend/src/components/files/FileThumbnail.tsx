import { useEffect, useState } from 'react'
import type { ScheduleFile } from '../../types/files/file'
import { previewKind } from '../../utils/files/preview'
import paperIcon from '../../assets/files/paper.svg'
import * as S from '../../styles/files/FilesPage.styles'

export default function FileThumbnail({ file }: { file: ScheduleFile }) {
  const [source, setSource] = useState('')
  const [failed, setFailed] = useState(false)
  const isImage = previewKind(file) === 'image'

  useEffect(() => {
    if (!isImage) return
    const url = URL.createObjectURL(file.blob)
    setSource(url)
    setFailed(false)
    return () => URL.revokeObjectURL(url)
  }, [file.blob, isImage])

  return isImage && source && !failed ? (
    <S.ThumbnailImage
      src={source}
      alt=""
      loading="lazy"
      onError={() => setFailed(true)}
    />
  ) : (
    <S.ThumbnailFallback>
      <img src={paperIcon} alt="" width={20} height={20} />
    </S.ThumbnailFallback>
  )
}
