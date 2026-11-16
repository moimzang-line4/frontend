import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import Button from '../../components/Button'
import ConfirmDialog from '../../components/common/ConfirmDialog'
import ReceiptForm from '../../components/payments/ReceiptForm'
import { clearReceiptDraft, loadReceiptDraft } from '../../hooks/payments/useReceiptDraft'
import { useReceiptActions, useReceiptDetail, useSettlementRounds } from '../../hooks/payments/useSettlementApi'
import type { SettlementRound } from '../../hooks/payments/useSettlementApi'
import { showAlert } from '../../hooks/useAlert'
import { getApiErrorMessage } from '../../utils/members/mapper'
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
  const { scheduleId = '', receiptId = '' } = useParams<{ scheduleId: string; receiptId: string }>()
  const scheduleNumber = Number(scheduleId)
  const rounds = useSettlementRounds(scheduleNumber)
  const detail = useReceiptDetail(scheduleNumber, mode === 'edit' ? Number(receiptId) : 0)

  const backToList = () => {
    clearReceiptDraft(scheduleId)
    navigate(paymentsPath(scheduleId), { replace: true })
  }

  const loading = rounds.loading || detail.loading
  const message = loading
    ? '영수증 정보를 불러오는 중이에요.'
    : rounds.error || detail.error || (mode === 'edit' && !detail.receipt ? '삭제되었거나 없는 영수증이에요.' : '')

  if (message) {
    return (
      <MainLayout title="영수증" showFooter={false}>
        <S.Missing>
          <p>{message}</p>
          {!loading && <Button onClick={backToList}>영수증 목록으로</Button>}
        </S.Missing>
      </MainLayout>
    )
  }

  return (
    <ReceiptResultContent
      mode={mode}
      scheduleId={scheduleId}
      rounds={rounds.rounds}
      receipt={detail.receipt}
      onDone={backToList}
    />
  )
}

type ContentProps = Props & {
  scheduleId: string
  rounds: SettlementRound[]
  receipt?: Receipt
  onDone: () => void
}

function ReceiptResultContent({ mode, scheduleId, rounds, receipt, onDone }: ContentProps) {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const basePath = paymentsPath(scheduleId)
  const { recognize, save, remove } = useReceiptActions(Number(scheduleId))

  // 새 영수증은 아직 영수증이 없는 차수 + 새 차수 중에서 고름
  const openRounds = rounds.filter(round => !round.hasReceipt)
  // 서버가 새 차수 번호를 '마지막 차수 + 1'로 붙이므로 미리 같은 번호로 표시
  const lastNo = Math.max(0, ...rounds.map(round => Number.parseInt(round.label, 10) || 0))
  const newRoundOption = `${lastNo + 1}차 (새 차수)`
  const roundOptions = receipt ? [receipt.round] : [...openRounds.map(round => round.label), newRoundOption]

  // 수정 중 '다시 촬영하기'로 돌아오면 새 사진(retake)을 우선 사용
  const [newImage] = useState(() =>
    mode === 'scan' || (mode === 'edit' && searchParams.has('retake')) ? loadReceiptDraft(scheduleId) : undefined)
  const image = newImage ?? receipt?.image
  const [form, setForm] = useState<ReceiptFormValues>(() =>
    receipt ? pickForm(receipt) : { ...EMPTY_RECEIPT_FORM, round: openRounds[0]?.label ?? newRoundOption })
  // 인식 API가 돌려준 사진 키 (등록할 때 같이 보내야 사진이 저장됨)
  const [imageKey, setImageKey] = useState<string>()
  const [recognizing, setRecognizing] = useState(Boolean(newImage))
  const [recognizeFailed, setRecognizeFailed] = useState(false)
  const [pending, setPending] = useState(false)
  const pendingRef = useRef(false)
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // 사진이 있는 영수증만 '회비 지원금' 항목 표시 (피그마: 직접 등록에는 없음)
  const fields = RECEIPT_FIELDS.filter(field => image || !field.scanOnly)
  const selectedRound = receipt?.roundId ?? rounds.find(round => round.label === form.round)?.id

  // 인식은 차수 단위 API라서, 새 차수를 고를 경우에도 기존 차수로 인식만 해 둠
  const ocrRoundId = receipt?.roundId ?? openRounds[0]?.id ?? rounds[0]?.id

  // 같은 사진은 한 번만 서버에 올림 (개발 모드에서 effect가 두 번 실행돼도)
  const ocrRequest = useRef<ReturnType<typeof recognize> | null>(null)

  // 새로 찍은 사진은 서버에서 인식해 빈 칸 채우기 (이미 입력한 값은 유지)
  useEffect(() => {
    if (!newImage || !ocrRoundId) {
      setRecognizing(false)
      return
    }
    let cancelled = false
    ocrRequest.current ??= recognize(ocrRoundId, newImage)
    ocrRequest.current
      .then(result => {
        if (cancelled) return
        // 가게명·거래일시·금액 중 아무것도 못 읽었으면 실패로 처리
        if (!Object.values(result.form).some(Boolean)) setRecognizeFailed(true)
        setImageKey(result.imageKey)
        setForm(prev => {
          const next = { ...prev }
          for (const key of Object.keys(result.form) as ReceiptFieldKey[]) {
            if (!next[key] && result.form[key]) next[key] = result.form[key] ?? ''
          }
          return next
        })
      })
      .catch(() => { if (!cancelled) setRecognizeFailed(true) })
      .finally(() => { if (!cancelled) setRecognizing(false) })
    return () => { cancelled = true }
    // 화면에 들어올 때 한 번만 인식
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [newImage, ocrRoundId])

  if (mode === 'scan' && !image) {
    return (
      <MainLayout title="영수증" showFooter={false}>
        <S.Missing>
          <p>촬영한 영수증을 찾을 수 없어요.</p>
          <Button onClick={onDone}>영수증 목록으로</Button>
        </S.Missing>
      </MainLayout>
    )
  }

  const handleChange = (key: ReceiptFieldKey, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  // 입금 완료한 사람이 있는 차수는 서버가 수정·삭제를 막음
  const blockedByLock = () => {
    if (!receipt?.locked) return false
    showAlert(RECEIPT_TEXT.locked)
    return true
  }

  const run = async (task: () => Promise<void>, fallback: string) => {
    if (pendingRef.current) return
    pendingRef.current = true
    setPending(true)
    try {
      await task()
      onDone()
    } catch (caught) {
      showAlert(getApiErrorMessage(caught, fallback))
    } finally {
      pendingRef.current = false
      setPending(false)
    }
  }

  const handleSubmit = () => {
    if (blockedByLock()) return
    const missing = fields.find(field => field.required && !form[field.key].trim())
    if (missing) {
      showAlert(`${missing.label}을(를) 입력해주세요.`)
      return
    }
    void run(
      () => save({ roundId: selectedRound, form, imageKey }),
      mode === 'edit' ? '영수증을 수정하지 못했어요.' : '영수증을 등록하지 못했어요.',
    )
  }

  // 촬영 직후 화면의 삭제는 등록하지 않고 나가기
  const handleDelete = () => {
    setShowDeleteModal(false)
    if (mode !== 'edit' || !receipt?.roundId) {
      onDone()
      return
    }
    if (blockedByLock()) return
    const roundId = receipt.roundId
    void run(() => remove(roundId), '영수증을 삭제하지 못했어요.')
  }

  // 다시 촬영: 수정 중이면 이 영수증으로 돌아오도록 표시
  const retake = () => {
    if (blockedByLock()) return
    const query = mode === 'edit' && receipt ? `?receipt=${encodeURIComponent(receipt.id)}` : ''
    navigate(`${basePath}/receipts/camera${query}`, { replace: true })
  }

  const title = mode === 'manual' ? '직접 등록하기' : image ? '영수증 인식 결과' : '영수증 수정'
  const headingTitle = newImage && recognizing
    ? RECEIPT_TEXT.recognizingTitle
    : recognizeFailed ? RECEIPT_TEXT.recognizeFailedTitle : RECEIPT_TEXT.resultTitle
  const headingDescription = newImage && recognizing
    ? RECEIPT_TEXT.recognizingDescription
    : recognizeFailed ? RECEIPT_TEXT.recognizeFailed : RECEIPT_TEXT.resultDescription

  return (
    <MainLayout title={title} showFooter={false}>
      <S.Container $manual={!image}>
        {image && (
          <S.Summary>
            <S.Thumbnail src={image} alt="영수증 사진" />
            <S.Heading>
              <S.Title>{headingTitle}</S.Title>
              <S.Description>{headingDescription}</S.Description>
            </S.Heading>
          </S.Summary>
        )}

        <ReceiptForm
          fields={fields}
          values={form}
          onChange={handleChange}
          roundOptions={roundOptions}
          roundDisabled={mode === 'edit'}
        />

        <S.Actions>
          <Button onClick={handleSubmit} disabled={pending || recognizing}>
            {pending ? '저장 중…' : mode === 'edit' ? '변경사항 저장' : '등록하기'}
          </Button>
          {mode !== 'manual' && (
            <>
              <OutlineButton type="button" disabled={pending} onClick={retake}>다시 촬영하기</OutlineButton>
              <OutlineButton
                type="button"
                $tone="danger"
                disabled={pending}
                onClick={() => { if (!blockedByLock()) setShowDeleteModal(true) }}
              >
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
