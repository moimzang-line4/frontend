import { useEffect, useRef, useState } from 'react'
import BottomSheet from '../BottomSheet'
import Button from '../Button'
import type { ScheduleFile } from '../../types/files/file'
import { downloadBlob } from '../../utils/files/download'
import * as S from '../../styles/files/FilesPage.styles'

export default function FilePreview({ file, onClose }: { file: ScheduleFile; onClose: () => void }) {
  const imageRef = useRef<HTMLImageElement>(null)
  const frameRef = useRef<HTMLIFrameElement>(null)
  const [text, setText] = useState('불러오는 중이에요.')
  const image = /^image\/(png|jpeg|gif|webp|avif|bmp)$/.test(file.blob.type)
  const pdf = file.blob.type === 'application/pdf'
  const plain = /^(text\/plain|text\/csv|application\/json)$/.test(file.blob.type) && file.blob.size <= 1024 * 1024
  useEffect(() => {
    const objectUrl = URL.createObjectURL(file.blob)
    if (imageRef.current) imageRef.current.src = objectUrl
    if (frameRef.current) frameRef.current.src = objectUrl
    let active = true
    if (plain) void file.blob.text().then(value => { if (active) setText(value) }).catch(() => { if (active) setText('미리보기를 불러오지 못했어요.') })
    return () => { active = false; URL.revokeObjectURL(objectUrl) }
  }, [file, plain])
  return <BottomSheet title={file.name} onClose={onClose}><S.Preview>
    {image ? <img ref={imageRef} alt={file.name} /> : pdf ? <iframe ref={frameRef} title={`${file.name} 미리보기`} sandbox="allow-same-origin" /> : plain ? <pre>{text}</pre> : <p>이 파일 형식은 미리보기를 지원하지 않아요. 다운로드해서 확인해주세요.</p>}
    <Button onClick={() => downloadBlob(file.blob, file.name)}>다운로드</Button>
  </S.Preview></BottomSheet>
}
