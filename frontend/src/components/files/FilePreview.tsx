import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import type { ScheduleFile } from '../../types/files/file'
import { previewKind } from '../../utils/files/preview'

import * as S from '../../styles/files/FilePreviewPage.styles'

const PdfPreview = lazy(() => import('./PdfPreview'))
const OfficePreview = lazy(() => import('./OfficePreview'))

export default function FilePreview({
  file,
}: {
  file: ScheduleFile
}) {
  const kind = previewKind(file)

  if (kind === 'pdf') {
    return (
      <Suspense
        fallback={
          <S.Notice role="status">
            PDF를 불러오는 중이에요.
          </S.Notice>
        }
      >
        <PdfPreview blob={file.blob} />
      </Suspense>
    )
  }

  if (kind === 'office') {
    return (
      <Suspense
        fallback={
          <S.Notice role="status">
            문서를 불러오는 중이에요.
          </S.Notice>
        }
      >
        <OfficePreview file={file} />
      </Suspense>
    )
  }

  if (kind === 'text') {
    return <TextPreview file={file} />
  }

  if (
    kind === 'image' ||
    kind === 'audio' ||
    kind === 'video'
  ) {
    return <MediaPreview file={file} kind={kind} />
  }

  return (
    <S.Notice>
      이 형식은 미리보기를 지원하지 않아요. 상단 다운로드 버튼으로
      파일을 받아 확인해주세요.
    </S.Notice>
  )
}

function TextPreview({ file }: { file: ScheduleFile }) {
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    if (file.blob.size <= 2 * 1024 * 1024) {
      void file.blob
        .text()
        .then(value => {
          if (file.name.toLowerCase().endsWith('.json')) {
            try {
              value = JSON.stringify(JSON.parse(value), null, 2)
            } catch {
              /* Display malformed JSON as plain text. */
            }
          }

          if (active) {
            setText(value)
          }
        })
        .catch(() => {
          if (active) {
            setError(
              '파일을 읽지 못했어요. 다운로드해서 확인해주세요.',
            )
          }
        })
    }

    return () => {
      active = false
    }
  }, [file])

  if (file.blob.size > 2 * 1024 * 1024) {
    return (
      <S.Notice>
        2MB가 넘는 텍스트 파일은 다운로드해서 확인해주세요.
      </S.Notice>
    )
  }

  if (error) {
    return <S.Notice role="alert">{error}</S.Notice>
  }

  if (text === null) {
    return (
      <S.Notice role="status">
        자료를 불러오는 중이에요.
      </S.Notice>
    )
  }

  return (
    <>
      <S.Paper>
        <pre>{text || '(내용이 없는 파일)'}</pre>
      </S.Paper>

      <S.Pager>1 / 1</S.Pager>
    </>
  )
}

function MediaPreview({
  file,
  kind,
}: {
  file: ScheduleFile
  kind: 'image' | 'audio' | 'video'
}) {
  const imageRef = useRef<HTMLImageElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [error, setError] = useState('')

  useEffect(() => {
    const url = URL.createObjectURL(file.blob)
    const media =
      kind === 'audio' ? audioRef.current : videoRef.current

    if (imageRef.current) {
      imageRef.current.src = url
    }

    if (media) {
      media.src = url
    }

    return () => {
      media?.pause()
      media?.removeAttribute('src')
      media?.load()

      URL.revokeObjectURL(url)
    }
  }, [file, kind])

  const failed = () => {
    setError(
      '브라우저에서 이 파일을 재생하거나 표시하지 못했어요. 다운로드해서 확인해주세요.',
    )
  }

  return (
    <>
      <S.Media>
        {kind === 'image' ? (
          <img
            ref={imageRef}
            alt={file.name}
            onError={failed}
          />
        ) : kind === 'audio' ? (
          <audio
            ref={audioRef}
            controls
            preload="metadata"
            aria-label={file.name}
            onError={failed}
          />
        ) : (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            aria-label={file.name}
            onError={failed}
          />
        )}
      </S.Media>

      {error && (
        <S.Notice role="alert">
          {error}
        </S.Notice>
      )}

      {kind === 'image' && (
        <S.Pager>1 / 1</S.Pager>
      )}
    </>
  )
}