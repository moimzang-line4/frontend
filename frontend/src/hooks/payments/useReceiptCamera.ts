import { useEffect, useRef, useState } from 'react'
import { RECEIPT_IMAGE_MAX_WIDTH } from '../../constants/payments/receipt'

export type CameraStatus = 'loading' | 'ready' | 'denied' | 'unsupported'

// 이미지/영상 프레임을 최대 너비에 맞춰 JPEG data URL로 변환
function toDataUrl(source: CanvasImageSource, width: number, height: number) {
  const scale = Math.min(1, RECEIPT_IMAGE_MAX_WIDTH / width)
  const canvas = document.createElement('canvas')
  canvas.width = Math.round(width * scale)
  canvas.height = Math.round(height * scale)
  canvas.getContext('2d')?.drawImage(source, 0, 0, canvas.width, canvas.height)
  return canvas.toDataURL('image/jpeg', 0.8)
}

// 갤러리·기본 카메라 앱에서 고른 파일을 data URL로
export function fileToReceiptImage(file: File) {
  return new Promise<string>((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const image = new Image()
    image.onload = () => {
      resolve(toDataUrl(image, image.naturalWidth, image.naturalHeight))
      URL.revokeObjectURL(url)
    }
    image.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('이미지를 불러오지 못했어요.'))
    }
    image.src = url
  })
}

const canUseCamera = () =>
  typeof navigator !== 'undefined' && typeof navigator.mediaDevices?.getUserMedia === 'function'

// 후면 카메라 미리보기 + 촬영
export default function useReceiptCamera() {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [status, setStatus] = useState<CameraStatus>(() => (canUseCamera() ? 'loading' : 'unsupported'))

  useEffect(() => {
    if (!canUseCamera()) return
    let stream: MediaStream | undefined
    let cancelled = false

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: { ideal: 'environment' } }, audio: false })
      .then(media => {
        if (cancelled) {
          media.getTracks().forEach(track => track.stop())
          return
        }
        stream = media
        const video = videoRef.current
        if (video) {
          video.srcObject = media
          void video.play().catch(() => undefined)
        }
        setStatus('ready')
      })
      .catch(() => {
        if (!cancelled) setStatus('denied')
      })

    // 화면을 벗어나면 카메라 끄기
    return () => {
      cancelled = true
      stream?.getTracks().forEach(track => track.stop())
    }
  }, [])

  const capture = () => {
    const video = videoRef.current
    if (!video || status !== 'ready' || video.videoWidth === 0) return undefined
    return toDataUrl(video, video.videoWidth, video.videoHeight)
  }

  return { videoRef, status, capture }
}
