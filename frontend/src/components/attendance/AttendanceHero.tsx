import ProgressHeroCard from '../ProgressHeroCard'

type Props = {
  title: string
  attended: number
  total: number
}

export default function AttendanceHero({ title, attended, total }: Props) {
  return (
    <ProgressHeroCard
      title={title}
      status="출석 확인 중"
      doneStatus="출석 확인 완료"
      done={attended}
      total={total}
      ariaLabel={`${title} 출석 현황`}
    />
  )
}
