import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import ReceiptForm from '../../components/payments/ReceiptForm'
import useReceipts from '../../hooks/payments/useReceipts'
import { clearReceiptDraft, loadReceiptDraft } from '../../hooks/payments/useReceiptDraft'
import { showAlert } from '../../hooks/useAlert'
import { recognizeReceipt } from '../../api/receipts'
import { EMPTY_RECEIPT_FORM, RECEIPT_FIELDS, RECEIPT_TEXT, paymentsPath } from '../../constants/payments/receipt'
import type { Receipt, ReceiptFieldKey, ReceiptForm as ReceiptFormValues } from '../../types/payments/receipt'
import { OutlineButton } from '../../styles/OutlineButton.styles'
import * as S from '../../styles/payments/ReceiptResultPage.styles'

type Props = {
  // scan: 촬영 후 인식 결과 / manual: 직접 등록 / edit: 등록한 영수증 수정
  mode: 'scan' | 'manual' | 'edit'
}

const pickForm = (receipt?: Receipt): ReceiptFormValues => (receipt
  ? { storeName: receipt.storeName, paidAt: receipt.paidAt, amount: receipt.amount, support: receipt.support, round: receipt.round }
  : EMPTY_RECEIPT_FORM)

// 피그마: 영수증 · 인식 결과 등록 / 인식 결과 수정 / 직접 등록 + 영수증 삭제 모달
export default function ReceiptResultPage({ mode }: Props) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { scheduleId = '', receiptId = '' } = useParams<{ scheduleId: string; receiptId: string }>()
  const basePath = paymentsPath(scheduleId)
  const { getReceipt, addReceipt, updateReceipt, removeReceipt } = useReceipts(scheduleId)

  const [receipt] = useState(() => (mode === 'edit' ? getReceipt(receiptId) : undefined))
  // 수정 중 '다시 촬영하기'로 돌아오면 새 사진(retake)을 우선 사용
  const [newImage] = useState(() =>
    mode === 'scan' || (mode === 'edit' && searchParams.has('retake')) ? loadReceiptDraft(scheduleId) : undefined)
  const image = newImage ?? receipt?.image
  const [form, setForm] = useState<ReceiptFormValues>(() => pickForm(receipt))
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // 사진이 있는 영수증만 '회비 지원금' 항목 표시 (피그마: 직접 등록에는 없음)
  const fields = RECEIPT_FIELDS.filter(field => image || !field.scanOnly)
  const canSubmit = fields.every(field => !field.required || form[field.key].trim() !== '')

  // 새로 찍은 사진은 인식 결과로 빈 칸 채우기 (이미 입력한 값은 유지)
  useEffect(() => {
    if (!newImage) return
    let cancelled = false
    recognizeReceipt(newImage).then(result => {
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
  }, [newImage])

  const backToList = () => {
    clearReceiptDraft(scheduleId)
    navigate(basePath, { replace: true })
  }

  if ((mode === 'scan' && !image) || (mode === 'edit' && !receipt)) {
    return (
      <MainLayout title="영수증" showFooter={false}>
        <S.Missing>
          <p>{mode === 'scan' ? '촬영한 영수증을 찾을 수 없어요.' : '삭제되었거나 없는 영수증이에요.'}</p>
          <Button onClick={backToList}>영수증 목록으로</Button>
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
    if (mode === 'edit' && receipt) updateReceipt(receipt.id, form, newImage)
    else addReceipt(form, image)
    backToList()
  }

  const handleDelete = () => {
    if (receipt) removeReceipt(receipt.id)
    backToList()
  }

  // 다시 촬영: 수정 중이면 이 영수증으로 돌아오도록 표시
  const retake = () => {
    const query = mode === 'edit' && receipt ? `?receipt=${encodeURIComponent(receipt.id)}` : ''
    navigate(`${basePath}/receipts/camera${query}`, { replace: true })
  }

  const title = mode === 'manual' ? '직접 등록하기' : image ? '영수증 인식 결과' : '영수증 수정'

  return (
    <MainLayout title={title} showFooter={false}>
      <S.Container $manual={!image}>
        {image && (
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
          <Button onClick={handleSubmit}>{mode === 'edit' ? '수정하기' : '등록하기'}</Button>
          {mode !== 'manual' && (
            <>
              <OutlineButton type="button" onClick={retake}>다시 촬영하기</OutlineButton>
              <OutlineButton type="button" $tone="danger" onClick={() => setShowDeleteModal(true)}>
                삭제하기
              </OutlineButton>
            </>
          )}
        </S.Actions>
      </S.Container>

      <ConfirmDialog
        open={showDeleteModal}
        title={RECEIPT_TEXT.deleteTitle}
        description={<S.ModalText>{RECEIPT_TEXT.deleteDescription}</S.ModalText>}
        confirmText="삭제하기"
        onCancel={() => setShowDeleteModal(false)}
        onConfirm={handleDelete}
      />
    </MainLayout>
  )
}
