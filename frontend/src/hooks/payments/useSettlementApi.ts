import { useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createRound,
  deleteReceipt,
  generateSettlementNotice,
  getPaymentSummaries,
  getReceipt,
  getRoundAttendees,
  getSettlementHome,
  getSettlementTargets,
  importSettlementTargets,
  listRounds,
  recognizeReceipt,
  registerReceipt,
  saveSettlementTargets,
  setAccount,
  updatePaymentStatus,
} from '../../api/generated'
import { unwrap } from '../../utils/members/mapper'
import { parseAmount } from '../../utils/payments'
import type { Receipt, ReceiptForm } from '../../types/payments/receipt'

const REQUEST = { timeout: 15000 }
const OCR_REQUEST = { timeout: 60000 }

const isValidId = (id: number) => Number.isSafeInteger(id) && id > 0

// 일정 하나의 정산 데이터는 모두 이 키 아래에 둠 (바뀌면 한 번에 새로고침)
export const settlementKey = (scheduleId: number) => ['settlement', scheduleId] as const

export type SettlementRound = { id: number; label: string; hasReceipt: boolean }

// 서버 거래일시 '2026-11-16T12:30:00' ↔ 화면 '2026-11-16 12:30'
export const fromServerDateTime = (value?: string) => (value ? value.slice(0, 16).replace('T', ' ') : '')

export function toServerDateTime(value: string) {
  const text = value.trim()
  if (!text) return undefined
  const match = /^(\d{4}-\d{2}-\d{2})(?: (\d{2}:\d{2}))?$/.exec(text)
  if (!match) throw new Error('거래일시는 0000-00-00 00:00 형식으로 입력해주세요.')
  return `${match[1]}T${match[2] ?? '00:00'}:00`
}

const amountText = (value?: number) => (typeof value === 'number' ? value.toLocaleString('ko-KR') : '')

const parseTime = (value?: string) => {
  const time = value ? Date.parse(value) : NaN
  return Number.isNaN(time) ? 0 : time
}

// 정산 홈: 진행률 + 영수증(차수) 목록 + 대표 계좌
export function useSettlementHome(scheduleId: number) {
  const query = useQuery({
    queryKey: [...settlementKey(scheduleId), 'home'],
    enabled: isValidId(scheduleId),
    staleTime: 5_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const response = await getSettlementHome(scheduleId, { ...REQUEST, signal })
      const data = unwrap(response.data, '정산 정보를 불러오지 못했어요.')
      const receipts: Receipt[] = (data.receipts ?? [])
        .filter(item => typeof item.roundId === 'number')
        .map(item => ({
          id: String(item.roundId),
          roundId: item.roundId as number,
          round: item.label ?? '',
          storeName: item.storeName ?? '',
          paidAt: '',
          amount: amountText(item.totalAmount),
          support: '',
          status: item.settlementStatus === '정산 완료' ? 'done' : 'ongoing',
          createdAt: parseTime(item.registeredAt),
        }))
      return {
        title: data.scheduleTitle ?? '',
        receipts,
        paid: data.progress?.paidCount ?? 0,
        total: data.progress?.totalCount ?? 0,
        account: data.account ?? null,
      }
    },
  })

  return {
    home: query.data,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : '',
    reload: query.refetch,
  }
}

// 일정의 차수 목록 (영수증 등록 여부 포함)
export function useSettlementRounds(scheduleId: number) {
  const query = useQuery({
    queryKey: [...settlementKey(scheduleId), 'rounds'],
    enabled: isValidId(scheduleId),
    staleTime: 5_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const response = await listRounds(scheduleId, { ...REQUEST, signal })
      const data = unwrap(response.data, '차수 정보를 불러오지 못했어요.')
      return (data.rounds ?? [])
        .filter(round => typeof round.roundId === 'number')
        .map((round): SettlementRound => ({
          id: round.roundId as number,
          label: round.label || `${round.roundNo ?? ''}차`,
          hasReceipt: Boolean(round.hasReceipt),
        }))
    },
  })

  return {
    rounds: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : '',
    reload: query.refetch,
  }
}

// 차수 하나의 영수증 상세 (수정 화면)
export function useReceiptDetail(scheduleId: number, roundId: number) {
  const query = useQuery({
    queryKey: [...settlementKey(scheduleId), 'receipt', roundId],
    enabled: isValidId(roundId),
    staleTime: 0,
    retry: 1,
    queryFn: async ({ signal }) => {
      const response = await getReceipt(roundId, { ...REQUEST, signal })
      const data = unwrap(response.data, '영수증을 불러오지 못했어요.')
      const receipt: Receipt = {
        id: String(roundId),
        roundId,
        round: data.label ?? '',
        storeName: data.storeName ?? '',
        paidAt: fromServerDateTime(data.transactedAt),
        amount: amountText(data.totalAmount),
        support: amountText(data.clubSubsidyAmount),
        image: data.imageUrl || undefined,
        locked: Boolean(data.isLocked),
        createdAt: parseTime(data.registeredAt),
      }
      return receipt
    },
  })

  return {
    receipt: query.data,
    loading: isValidId(roundId) && query.isLoading,
    error: query.error ? (query.error as Error).message : '',
  }
}

// 촬영 사진(data URL) → 업로드용 파일
async function toImageFile(image: string) {
  const blob = await (await fetch(image)).blob()
  return new File([blob], 'receipt.jpg', { type: blob.type || 'image/jpeg' })
}

// 영수증 인식·등록·삭제
export function useReceiptActions(scheduleId: number) {
  const queryClient = useQueryClient()
  const refresh = () => queryClient.invalidateQueries({ queryKey: settlementKey(scheduleId) })

  // 사진을 서버에 올려 가게명·거래일시·금액을 읽고, 등록 때 쓸 사진 키를 받음
  const recognize = async (roundId: number, image: string) => {
    const response = await recognizeReceipt(roundId, { image: await toImageFile(image) }, OCR_REQUEST)
    const data = unwrap(response.data, '영수증을 인식하지 못했어요.')
    const form: Partial<ReceiptForm> = {
      storeName: data.storeName ?? '',
      paidAt: fromServerDateTime(data.transactedAt),
      amount: amountText(data.totalAmount),
    }
    return { form, imageKey: data.imageKey || undefined }
  }

  // roundId가 없으면 새 차수를 만든 뒤 등록
  const save = async ({ roundId, form, imageKey }: { roundId?: number; form: ReceiptForm; imageKey?: string }) => {
    const totalAmount = parseAmount(form.amount)
    const clubSubsidyAmount = parseAmount(form.support)
    if (totalAmount <= 0) throw new Error('금액(합계)을 입력해주세요.')
    if (clubSubsidyAmount > totalAmount) throw new Error('회비 지원금은 금액(합계)보다 클 수 없어요.')
    const transactedAt = toServerDateTime(form.paidAt)

    let target = roundId
    if (!target) {
      const created = await createRound(scheduleId, REQUEST)
      target = unwrap(created.data, '새 차수를 만들지 못했어요.').roundId
      if (typeof target !== 'number') throw new Error('새 차수를 만들지 못했어요.')
    }

    try {
      const response = await registerReceipt(target, {
        storeName: form.storeName.trim() || undefined,
        transactedAt,
        totalAmount,
        clubSubsidyAmount,
        imageKey,
      }, REQUEST)
      unwrap(response.data, '영수증을 등록하지 못했어요.')
    } finally {
      await refresh()
    }
  }

  const remove = async (roundId: number) => {
    try {
      const response = await deleteReceipt(roundId, REQUEST)
      if (response.data.success !== true) throw new Error(response.data.message || '영수증을 삭제하지 못했어요.')
    } finally {
      await refresh()
    }
  }

  return { recognize, save, remove }
}

// ───────── 명단·금액 ─────────

export type SettlementTarget = {
  id: string
  name: string
  department: string
  // 전화번호 뒤 4자리
  phone: string
  billed: number
  paid: boolean
}

const PAGE_SIZE = 100
const MAX_PAGES = 50

type Person = { attendeeId?: number; name?: string; affiliation?: string; phoneLast4?: string }

const toPerson = (item: Person) => ({
  id: String(item.attendeeId),
  name: item.name ?? '',
  department: item.affiliation ?? '',
  phone: item.phoneLast4 ?? '',
})

const hasId = <T extends { attendeeId?: number }>(item: T) => typeof item.attendeeId === 'number'

// 차수 정산 명단 전체 (100명씩 끝까지)
async function fetchTargets(roundId: number, signal?: AbortSignal) {
  const targets: SettlementTarget[] = []
  let label = ''
  let billed = 0
  let cursor: string | undefined
  for (let page = 0; page < MAX_PAGES; page += 1) {
    const response = await getSettlementTargets(roundId, { size: PAGE_SIZE, cursor }, { ...REQUEST, signal })
    const data = unwrap(response.data, '정산 명단을 불러오지 못했어요.')
    label = data.label ?? label
    billed = data.billedAmount ?? billed
    targets.push(...(data.targets ?? []).filter(hasId).map(item => ({
      ...toPerson(item),
      billed: item.billedAmount ?? 0,
      paid: item.paymentStatus === 'PAID',
    })))
    if (!data.nextCursor) break
    cursor = data.nextCursor
  }
  return { label, billed, targets }
}

// 차수별 정산 인원 수 (명단·금액 탭 카드)
export function useTargetCounts(scheduleId: number, roundIds: number[]) {
  const query = useQuery({
    queryKey: [...settlementKey(scheduleId), 'target-counts', roundIds.join(',')],
    enabled: isValidId(scheduleId) && roundIds.length > 0,
    staleTime: 5_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const counts = await Promise.all(roundIds.map(async roundId => {
        const response = await getSettlementTargets(roundId, { size: 1 }, { ...REQUEST, signal })
        const data = unwrap(response.data, '정산 명단을 불러오지 못했어요.')
        return [roundId, data.targetCount ?? 0] as const
      }))
      return Object.fromEntries(counts) as Record<number, number>
    },
  })

  return {
    counts: query.data ?? {},
    loading: roundIds.length > 0 && query.isLoading,
    error: query.error ? (query.error as Error).message : '',
  }
}

// 차수 하나의 정산 명단 + 사람별 총액(모든 차수 합)
export function useRoundTargets(scheduleId: number, roundId: number) {
  const targets = useQuery({
    queryKey: [...settlementKey(scheduleId), 'targets', roundId],
    enabled: isValidId(roundId),
    staleTime: 5_000,
    retry: 1,
    queryFn: ({ signal }) => fetchTargets(roundId, signal),
  })

  const totals = useQuery({
    queryKey: [...settlementKey(scheduleId), 'payment-totals'],
    enabled: isValidId(scheduleId),
    staleTime: 5_000,
    retry: 1,
    queryFn: async ({ signal }) => {
      const result: Record<string, number> = {}
      let cursor: string | undefined
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const response = await getPaymentSummaries(scheduleId, { status: 'ALL', size: PAGE_SIZE, cursor }, { ...REQUEST, signal })
        const data = unwrap(response.data, '입금 현황을 불러오지 못했어요.')
        for (const item of data.payments ?? []) {
          if (typeof item.attendeeId === 'number') result[String(item.attendeeId)] = item.totalBilledAmount ?? 0
        }
        if (!data.nextCursor) break
        cursor = data.nextCursor
      }
      return result
    },
  })

  return {
    label: targets.data?.label ?? '',
    targets: targets.data?.targets ?? [],
    // 총액을 못 불러오면 이 차수 금액으로 표시
    totalOf: (target: SettlementTarget) => totals.data?.[target.id] ?? target.billed,
    loading: targets.isLoading,
    error: targets.error ? (targets.error as Error).message : '',
    reload: targets.refetch,
  }
}

// 명단 편집: 현재 정산 명단 + 출석한 사람(기본값) + 차수 참가자 전체(추가 후보)
export function useRoundCandidates(roundId: number) {
  const query = useQuery({
    queryKey: ['settlement-candidates', roundId],
    enabled: isValidId(roundId),
    staleTime: 0,
    retry: 1,
    queryFn: async ({ signal }) => {
      const [current, imported] = await Promise.all([
        fetchTargets(roundId, signal),
        importSettlementTargets(roundId, { ...REQUEST, signal }).then(response =>
          unwrap(response.data, '행사 명단을 불러오지 못했어요.')),
      ])

      const attendees: ReturnType<typeof toPerson>[] = []
      let cursor: string | undefined
      for (let page = 0; page < MAX_PAGES; page += 1) {
        const response = await getRoundAttendees(roundId, { status: 'ALL', size: PAGE_SIZE, cursor }, { ...REQUEST, signal })
        const data = unwrap(response.data, '참가자 명단을 불러오지 못했어요.')
        attendees.push(...(data.attendees ?? []).filter(hasId).map(toPerson))
        if (!data.nextCursor) break
        cursor = data.nextCursor
      }

      const importedPeople = (imported.attendees ?? []).filter(hasId).map(toPerson)
      // 후보 = 참가자 전체 + 이미 명단에 있는 사람 (중복 제거)
      const people = new Map<string, ReturnType<typeof toPerson>>()
      for (const person of [...current.targets, ...importedPeople, ...attendees]) {
        if (!people.has(person.id)) people.set(person.id, { id: person.id, name: person.name, department: person.department, phone: person.phone })
      }

      return {
        people: [...people.values()],
        // 처음 불러오면(아직 명단이 없으면) 출석한 사람을 기본으로 넣음
        initial: current.targets.length > 0 ? current.targets.map(target => target.id) : importedPeople.map(person => person.id),
        saved: current.targets.map(target => target.id),
      }
    },
  })

  return {
    data: query.data,
    loading: query.isLoading,
    error: query.error ? (query.error as Error).message : '',
  }
}

// 정산 명단 저장 · 입금 확인
export function useSettlementTargetActions(scheduleId: number) {
  const queryClient = useQueryClient()
  const refresh = () => Promise.all([
    queryClient.invalidateQueries({ queryKey: settlementKey(scheduleId) }),
    queryClient.invalidateQueries({ queryKey: ['settlement-candidates'] }),
  ])

  const saveTargets = async (roundId: number, ids: string[]) => {
    try {
      const response = await saveSettlementTargets(roundId, { attendeeIds: ids.map(Number) }, REQUEST)
      unwrap(response.data, '정산 명단을 저장하지 못했어요.')
    } finally {
      await refresh()
    }
  }

  const setPaid = async (attendeeId: string, paid: boolean) => {
    try {
      const response = await updatePaymentStatus(scheduleId, Number(attendeeId), { paid }, REQUEST)
      unwrap(response.data, '입금 상태를 바꾸지 못했어요.')
    } finally {
      await refresh()
    }
  }

  return { saveTargets, setPaid }
}

// ───────── 공지 ─────────

export type SettlementAccount = { bankName: string; accountNumber: string; accountHolder: string }

// 선택한 차수에 계좌를 저장(입력했을 때만)하고, 서버가 만든 공지 문구를 받아옴
export function useNoticeActions(scheduleId: number) {
  const queryClient = useQueryClient()

  const generate = async (roundIds: number[], account?: SettlementAccount) => {
    if (account) {
      for (const roundId of roundIds) {
        const response = await setAccount(roundId, account, REQUEST)
        unwrap(response.data, '입금 계좌를 저장하지 못했어요.')
      }
      void queryClient.invalidateQueries({ queryKey: settlementKey(scheduleId) })
    }
    const response = await generateSettlementNotice(scheduleId, { roundIds }, REQUEST)
    const data = unwrap(response.data, '공지를 생성하지 못했어요.')
    if (!data.noticeText) throw new Error('공지를 생성하지 못했어요.')
    return data.noticeText
  }

  return { generate }
}
