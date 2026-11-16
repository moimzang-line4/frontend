import { isAxiosError } from 'axios'
import type { MemberListDetailResponse } from '../../api/models/memberListDetailResponse'
import type { MemberListFieldsResponse } from '../../api/models/memberListFieldsResponse'
import type { MemberListSummaryResponse } from '../../api/models/memberListSummaryResponse'
import type { MemberResponse } from '../../api/models/memberResponse'
import { DEFAULT_MEMBER_FIELDS } from '../../constants/members/memberFields'
import type { CreateMemberGroup, MemberField, MemberGroup } from '../../types/members/member'
import type { MemberFormValues, MemberInfo } from '../../types/members/memberInfo'

// 서버 수집 항목 키 ↔ 화면 항목 id
const FIELD_KEYS = ['school', 'studentId', 'part', 'grade', 'phone'] as const
type FieldKey = typeof FIELD_KEYS[number]

// 운영진 추가·수정 API는 이 항목을 저장하지 않음 (공유 링크 등록에서만 저장)
const OPERATOR_UNSUPPORTED = new Set<string>(['studentId', 'part', 'grade'])

// 화면에서는 날짜만 고르므로 그날 23:59:59까지 등록을 받는다
export const toDeadlineRequest = (date: string) => (date.length === 10 ? `${date}T23:59:59` : date)
export const toDeadlineDate = (value?: string) => (value ? value.slice(0, 10) : undefined)

export function toCollectRequest(fields: MemberField[]) {
  const enabled = (key: FieldKey) => fields.find(field => field.id === key)?.enabled ?? false
  return {
    collectSchool: enabled('school'),
    collectStudentId: enabled('studentId'),
    collectPart: enabled('part'),
    collectGrade: enabled('grade'),
    collectPhone: enabled('phone'),
  }
}

export function toCreateRequest(data: CreateMemberGroup) {
  return {
    name: data.name,
    registerDeadline: toDeadlineRequest(data.deadline),
    ...toCollectRequest(data.fields),
  }
}

export function fromFieldsResponse(fields?: MemberListFieldsResponse): MemberField[] {
  return DEFAULT_MEMBER_FIELDS.map(field => ({
    ...field,
    enabled: Boolean(fields?.[field.id as FieldKey]),
  }))
}

// 운영진 폼에서는 저장되지 않는 항목을 끈 상태로
export const toOperatorFields = (fields?: MemberField[]) =>
  (fields ?? DEFAULT_MEMBER_FIELDS).map(field =>
    OPERATOR_UNSUPPORTED.has(field.id) ? { ...field, enabled: false } : field)

// 등록 링크(joinUrl) 끝부분이 joinToken
export function joinTokenFromUrl(url?: string) {
  if (!url) return undefined
  const token = url.split(/[?#]/)[0].replace(/\/+$/, '').split('/').pop()
  return token || undefined
}

export function toMemberGroup(item: MemberListSummaryResponse | MemberListDetailResponse): MemberGroup {
  if (typeof item.memberListId !== 'number' || !item.name) {
    throw new Error('명단방 정보를 확인할 수 없어요.')
  }
  const detail = item as MemberListDetailResponse
  const linkClosed = detail.isLinkClosed === true
  return {
    id: item.memberListId,
    name: item.name,
    memberCount: item.memberCount ?? 0,
    status: item.status === 'RECRUITING' && !linkClosed ? 'open' : 'closed',
    deadline: toDeadlineDate(item.registerDeadline),
    fields: 'fields' in item ? fromFieldsResponse(detail.fields) : undefined,
    joinToken: joinTokenFromUrl(detail.joinUrl),
  }
}

export function toMemberInfo(item: MemberResponse, groupId: number): MemberInfo {
  if (typeof item.memberId !== 'number') throw new Error('부원 정보를 확인할 수 없어요.')
  return {
    id: item.memberId,
    groupId,
    name: item.name ?? '',
    department: item.department ?? '',
    school: item.school ?? '',
    phone: item.phone ?? '',
    studentId: item.studentId ?? '',
    part: item.part ?? '',
    grade: item.grade ?? '',
  }
}

// 운영진 추가·수정 요청 (빈 선택 항목은 보내지 않음)
export function toMemberRequest(data: MemberFormValues) {
  const optional = (value: string) => (value.trim() ? value.trim() : undefined)
  return {
    name: data.name.trim(),
    department: data.department.trim(),
    school: optional(data.school),
    phone: optional(data.phone),
  }
}

export function getApiErrorMessage(caught: unknown, fallback: string) {
  if (isAxiosError<{ message?: unknown }>(caught)) {
    const message = caught.response?.data?.message
    if (typeof message === 'string' && message.trim()) return message
    return caught.response ? fallback : '서버에 연결하지 못했어요. 네트워크 상태를 확인해주세요.'
  }
  return caught instanceof Error && caught.message ? caught.message : fallback
}

// 응답 본문 success 확인
export function unwrap<T>(body: { success?: boolean; message?: string; data?: T }, fallback: string): T {
  if (body.success !== true || body.data === undefined || body.data === null) {
    throw new Error(body.message || fallback)
  }
  return body.data
}
