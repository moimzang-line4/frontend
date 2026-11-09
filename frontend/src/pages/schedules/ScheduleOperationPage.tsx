import { Link, useParams } from 'react-router'
import MainLayout from '../../layouts/MainLayout'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import { operationMenus } from '../../constants/schedules/operationMenus'
import * as S from '../../styles/schedules/ScheduleDetailPage.styles'

export default function ScheduleOperationPage() {
  const { menuId } = useParams()
  const { schedule } = useScheduleDetail()
  const menu = operationMenus.find(item => item.id === menuId)
  const valid = schedule && menu && schedule.operationMenuCount !== undefined
  return <MainLayout title={valid ? menu.title : '메뉴를 찾을 수 없어요'}>
    <S.Notice>
      {valid ? <><h1>{schedule.title}</h1><p>{menu.empty}</p><Link to={`/schedules/${encodeURIComponent(schedule.id)}`}>일정 상세로 돌아가기</Link></> : <><p>연결된 일정 또는 운영 메뉴가 없어요.</p><Link to="/">홈으로 이동</Link></>}
    </S.Notice>
  </MainLayout>
}
