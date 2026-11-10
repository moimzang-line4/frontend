export type AttendanceFilter = 'absent' | 'attended' | 'all'

export type Participant = {
  id: string
  name: string
  department: string
  // 명단에 등록된 전화번호 (없으면 빈 문자열)
  phone: string
  // 현장 추가 시 입력한 구분용 값 (예: 전화번호 뒤 4자리)
  extra?: string
  // 출석 처리 시각 (미출석이면 null)
  attendedAt: number | null
  // 현장에서 직접 추가한 인원
  onsite: boolean
}

export type NewParticipant = {
  name: string
  department: string
  extra: string
}

// 현장 추가 시 이름·학과 외에 받는 구분 항목
export type AttendanceExtraField = {
  key: 'phone' | 'studentId'
  label: string
  placeholder: string
}
