import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import ReceiptForm from '../../components/payments/ReceiptForm'
import MemberDeleteModal from '../../components/members/MemberDeleteModal'
import useReceipts from '../../hooks/payments/useReceipts'
import { clearReceiptDraft, loadReceiptDraft } from '../../hooks/payments/useReceiptDraft'
import { showAlert } from '../../hooks/useAlert'
import { recognizeReceipt } from '../../api/receipts'
import { EMPTY_RECEIPT_FORM, RECEIPT_FIELDS, RECEIPT_TEXT, paymentsPath } from '../../constants/payments/receipt'
import type { ReceiptFieldKey, ReceiptForm as ReceiptFormValues } from '../../types/payments/receipt'
import { OutlineButton } from '../../styles/OutlineButton.styles'
import * as S from '../../styles/payments/ReceiptResultPage.styles'

type Props = {
  // scan: 촬영 후 인식 결과 / manual: 직접 등록
  mode: 'scan' | 'manual'
}

// 피그마: 영수증 · 인식 결과 등록 (+ 직접 등록)
export default function ReceiptResultPage({ mode }: Props) {
  const navigate = useNavigate()
  const { scheduleId = '' } = useParams<{ scheduleId: string }>()
  const basePath = paymentsPath(scheduleId)
  const { addReceipt } = useReceipts(scheduleId)

  const [image] = useState(() => (mode === 'scan' ? loadReceiptDraft(scheduleId) : undefined))
  const [form, setForm] = useState<ReceiptFormValues>(EMPTY_RECEIPT_FORM)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  const fields = RECEIPT_FIELDS.filter(field => mode === 'scan' || !field.scanOnly)
  const canSubmit = fields.every(field => !field.required || form[field.key].trim() !== '')

  // 인식 결과로 빈 칸 채우기 (사용자가 이미 입력한 값은 유지)
  useEffect(() => {
    if (!image) return
    let cancelled = false
    recognizeReceipt(image).then(result => {
      if (cancelled) return
      setForm(prev => {
        const next = { ...prev }
        for (const key of Object.keys(result) as ReceiptFieldKey[]) {
          if (!next[key] && result[key]) next[key] = result[key] ?? ''
        }
        return next
      })
    }).catch(() => undefined)
    return () => { cancelled = true }
  }, [image])

  // 촬영 화면에서 넘어온 사진이 없으면 다시 촬영하도록
  if (mode === 'scan' && !image) {
    return (
      <MainLayout title="영수증 인식 결과" showFooter={false}>
        <S.Missing>
          <p>촬영한 영수증을 찾을 수 없어요.</p>
          <Button onClick={() => navigate(`${basePath}/receipts/camera`, { replace: true })}>다시 촬영하기</Button>
        </S.Missing>
      </MainLayout>
    )
  }

  const handleChange = (key: ReceiptFieldKey, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  const handleSubmit = () => {
    if (!canSubmit) {
      const missing = fields.find(field => field.required && !form[field.key].trim())
      showAlert(`${missing?.label ?? '필수 항목'}을(를) 입력해주세요.`)
      return
    }
    addReceipt(form, image)
    clearReceiptDraft(scheduleId)
    navigate(basePath, { replace: true })
  }

  const leave = () => {
    clearReceiptDraft(scheduleId)
    navigate(basePath, { replace: true })
  }

  return (
    <MainLayout title={mode === 'scan' ? '영수증 인식 결과' : '직접 등록하기'} showFooter={false}>
      <S.Container $manual={mode === 'manual'}>
        {mode === 'scan' && image && (
          <S.Summary>
            <S.Thumbnail src={image} alt="촬영한 영수증" />
            <S.Heading>
              <S.Title>{RECEIPT_TEXT.resultTitle}</S.Title>
              <S.Description>{RECEIPT_TEXT.resultDescription}</S.Description>
            </S.Heading>
          </S.Summary>
        )}

        <ReceiptForm fields={fields} values={form} onChange={handleChange} />

        <S.Actions>
          <Button onClick={handleSubmit}>등록하기</Button>
          {mode === 'scan' && (
            <>
              <OutlineButton type="button" onClick={() => navigate(`${basePath}/receipts/camera`, { replace: true })}>
                다시 촬영하기
              </OutlineButton>
              <OutlineButton type="button" $tone="danger" onClick={() => setShowDeleteModal(true)}>
                삭제하기
              </OutlineButton>
            </>
          )}
        </S.Actions>
      </S.Container>

      {showDeleteModal && (
        <MemberDeleteModal
          title="영수증을 삭제할까요?"
          description="촬영한 영수증과 입력한 내용이 삭제돼요."
          confirmText="삭제하기"
          onCancel={() => setShowDeleteModal(false)}
          onConfirm={leave}
        />
      )}
    </MainLayout>
  )
}
