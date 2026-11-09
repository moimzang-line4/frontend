import notes from '../../assets/schedules/notes.png'
import attendance from '../../assets/schedules/attendance.png'
import payments from '../../assets/schedules/payments.png'
import files from '../../assets/schedules/files.png'

export const operationMenus = [
  { id: 'notes', title: '운영 메모장', description: '준비 사항 · 아이디어', image: notes, width: 73, height: 67, right: 10, bottom: 13, empty: '등록된 운영 메모가 없어요.' },
  { id: 'attendance', title: '참석·출석', description: '명단 · 출석 체크', image: attendance, width: 63, height: 61, right: 13, bottom: 19, empty: '등록된 출석 명단이 없어요.' },
  { id: 'payments', title: '정산·입금', description: '지출 · 입금 관리', image: payments, width: 59, height: 54, right: 17, bottom: 17, empty: '등록된 정산 내역이 없어요.' },
  { id: 'files', title: '자료', description: '파일 · 운영 기록', image: files, width: 61, height: 56, right: 13, bottom: 17, empty: '등록된 자료가 없어요.' },
] as const
