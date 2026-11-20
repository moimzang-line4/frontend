import { useRef } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import useReceiptCamera, { fileToReceiptImage } from '../../hooks/payments/useReceiptCamera'
import { saveReceiptDraft } from '../../hooks/payments/useReceiptDraft'
import { showAlert } from '../../hooks/useAlert'
import { RECEIPT_TEXT, paymentsPath } from '../../constants/payments/receipt'
import * as S from '../../styles/payments/ReceiptCameraPage.styles'

// 피그마: 영수증 · 촬영
export default function ReceiptCameraPage() {
  const navigate = useNavigate()
  const { scheduleId = '' } = useParams<{ scheduleId: string }>()
  const { videoRef, status, capture } = useReceiptCamera()
  const fileRef = useRef<HTMLInputElement>(null)
  // 노트북처럼 촬영이 불편할 때 저장된 사진을 바로 고르는 용도 (capture 없이 열어 갤러리/파일 선택)
  const galleryRef = useRef<HTMLInputElement>(null)
  const basePath = paymentsPath(scheduleId)
  // 영수증 수정 중 '다시 촬영하기'로 들어온 경우 그 영수증으로 돌아감
  const [searchParams] = useSearchParams()
  const editingId = searchParams.get('receipt')
  const editPath = editingId ? `${basePath}/receipts/${encodeURIComponent(editingId)}` : undefined

  const goToResult = (image: string) => {
    saveReceiptDraft(scheduleId, image)
    navigate(editPath ? `${editPath}?retake=1` : `${basePath}/receipts/new`, { replace: true })
  }

  const handleShutter = () => {
    // 카메라를 쓸 수 없으면 기기 카메라 앱 / 갤러리로
    if (status !== 'ready') {
      fileRef.current?.click()
      return
    }
    const image = capture()
    if (image) goToResult(image)
  }

  const handleFile = async (file?: File) => {
    if (!file) return
    try {
      goToResult(await fileToReceiptImage(file))
    } catch {
      showAlert('사진을 불러오지 못했어요.', { description: '다른 사진으로 다시 시도해주세요.' })
    }
  }

  return (
    <S.Screen>
      <S.Header>
        <S.CloseButton type="button" aria-label="닫기" onClick={() => navigate(editPath ?? basePath, { replace: true })}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </S.CloseButton>
        <S.Title>영수증 촬영</S.Title>
      </S.Header>

      <S.Viewfinder>
        <S.Video ref={videoRef} playsInline muted autoPlay aria-label="카메라 미리보기" />

        {status !== 'ready' && (
          <S.CameraNotice>
            {status === 'loading'
              ? '카메라를 준비하고 있어요'
              : '카메라를 사용할 수 없어요.\n아래 버튼을 눌러 사진을 선택해주세요.'}
          </S.CameraNotice>
        )}

        <S.Guide aria-hidden="true">
          <S.Corner $position="top-left" />
          <S.Corner $position="top-right" />
          <S.Corner $position="bottom-left" />
          <S.Corner $position="bottom-right" />
        </S.Guide>

        <S.Hint>{RECEIPT_TEXT.cameraHint}</S.Hint>
      </S.Viewfinder>

      <S.BottomBar>
        <S.GalleryButton type="button" aria-label="갤러리에서 사진 선택" onClick={() => galleryRef.current?.click()}>
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" aria-hidden="true">
            <rect x="3.5" y="4.5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.6" />
            <circle cx="9" cy="10" r="1.6" stroke="currentColor" strokeWidth="1.4" />
            <path d="M4 17l4.6-4.4a1.5 1.5 0 0 1 2 0L15 17M13.5 15.5l2-1.9a1.5 1.5 0 0 1 2 0L20 16" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <span>갤러리</span>
        </S.GalleryButton>
        <S.Shutter
          type="button"
          aria-label={status === 'ready' ? '영수증 촬영' : '사진 선택'}
          disabled={status === 'loading'}
          onClick={handleShutter}
        />
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          capture="environment"
          hidden
          onChange={event => {
            void handleFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />
        <input
          ref={galleryRef}
          type="file"
          accept="image/*"
          hidden
          onChange={event => {
            void handleFile(event.target.files?.[0])
            event.target.value = ''
          }}
        />
      </S.BottomBar>
    </S.Screen>
  )
}
