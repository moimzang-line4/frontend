import { lazy, Suspense, useEffect, useRef, useState } from 'react'

import type { ScheduleFile } from '../../types/files/file'
import { previewKind } from '../../utils/files/preview'
import useFileBlob from '../../hooks/files/useFileBlob'

import * as S from '../../styles/files/FilePreviewPage.styles'

const PdfPreview = lazy(() => import('./PdfPreview'))
const OfficePreview = lazy(() => import('./OfficePreview'))

export default function FilePreview({
  file,
}: {
  file: ScheduleFile
}) {
  const kind = previewKind(file)
  const supported = kind !== 'unsupported' && !(kind === 'text' && file.size > TEXT_LIMIT)
  // 미리보기 가능한 형식만 서버에서 내용을 받아옴
  const { blob, error } = useFileBlob(file, supported)

  if (kind === 'text' && file.size > TEXT_LIMIT) {
    return (
      <S.Notice>
        2MB가 넘는 텍스트 파일은 다운로드해서 확인해주세요.
      </S.Notice>
    )
  }

  if (supported && error) {
    return <S.Notice role="alert">{error}</S.Notice>
  }

  if (supported && !blob) {
    return (
      <S.Notice role="status">
        자료를 불러오는 중이에요.
      </S.Notice>
    )
  }

  if (kind === 'pdf' && blob) {
    return (
      <Suspense
        fallback={
          <S.Notice role="status">
            PDF를 불러오는 중이에요.
          </S.Notice>
        }
      >
        <PdfPreview blob={blob} />
      </Suspense>
    )
  }

  if (kind === 'office' && blob) {
    return (
      <Suspense
        fallback={
          <S.Notice role="status">
            문서를 불러오는 중이에요.
          </S.Notice>
        }
      >
        <OfficePreview name={file.name} blob={blob} />
      </Suspense>
    )
  }

  if (kind === 'text' && blob) {
    return <TextPreview name={file.name} blob={blob} />
  }

  if (
    (kind === 'image' ||
      kind === 'audio' ||
      kind === 'video') &&
    blob
  ) {
    return <MediaPreview name={file.name} blob={blob} kind={kind} />
  }

  return (
    <S.Notice>
      이 형식은 미리보기를 지원하지 않아요. 상단 다운로드 버튼으로
      파일을 받아 확인해주세요.
    </S.Notice>
  )
}

const TEXT_LIMIT = 2 * 1024 * 1024

function TextPreview({ name, blob }: { name: string; blob: Blob }) {
  const [text, setText] = useState<string | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true

    if (blob.size <= TEXT_LIMIT) {
      void blob
        .text()
        .then(value => {
          if (name.toLowerCase().endsWith('.json')) {
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
  }, [blob, name])

  if (blob.size > TEXT_LIMIT) {
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
  name,
  blob,
  kind,
}: {
  name: string
  blob: Blob
  kind: 'image' | 'audio' | 'video'
}) {
  const imageRef = useRef<HTMLImageElement>(null)
  const audioRef = useRef<HTMLAudioElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)

  const [error, setError] = useState('')

  useEffect(() => {
    const url = URL.createObjectURL(blob)
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
  }, [blob, kind])

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
            alt={name}
            onError={failed}
          />
        ) : kind === 'audio' ? (
          <audio
            ref={audioRef}
            controls
            preload="metadata"
            aria-label={name}
            onError={failed}
          />
        ) : (
          <video
            ref={videoRef}
            controls
            playsInline
            preload="metadata"
            aria-label={name}
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