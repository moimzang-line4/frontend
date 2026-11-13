import Header from '../../layouts/Header'
import Footer from '../../layouts/Footer'
import FileLibrary from '../../components/files/FileLibrary'
import useScheduleDetail from '../../hooks/schedules/useScheduleDetail'
import * as S from '../../styles/files/FilesPage.styles'

export default function ScheduleFilesPage() {
  const { schedule } = useScheduleDetail()

  if (!schedule || schedule.operationMenuCount === undefined) {
    return (
      <S.Page>
        <Header title="자료" />
        <S.Content>
          <S.Empty>자료를 확인할 일정을 찾을 수 없어요.</S.Empty>
        </S.Content>
        <Footer />
      </S.Page>
    )
  }

  return (
    <FileLibrary
      key={schedule.id}
      scheduleId={schedule.id}
      scheduleTitle={schedule.title}
    />
  )
}
