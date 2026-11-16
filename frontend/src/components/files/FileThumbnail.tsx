import { useEffect, useRef, useState } from 'react'
import type { ScheduleFile } from '../../types/files/file'
import { previewKind } from '../../utils/files/preview'
import useFileBlob from '../../hooks/files/useFileBlob'
import paperIcon from '../../assets/files/paper.svg'
import * as S from '../../styles/files/FilesPage.styles'

export default function FileThumbnail({ file }: { file: ScheduleFile }) {
  const imageRef = useRef<HTMLImageElement>(null)
  const [failed, setFailed] = useState(false)
  const isImage = previewKind(file) === 'image'
  // 사진만 서버에서 내용을 받아 썸네일로 표시
  const { blob, error } = useFileBlob(file, isImage)

  useEffect(() => {
    if (!blob) return
    const url = URL.createObjectURL(blob)
    if (imageRef.current) imageRef.current.src = url
    return () => URL.revokeObjectURL(url)
  }, [blob])

  return isImage && !failed && !error ? (
    <S.ThumbnailImage
      ref={imageRef}
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
