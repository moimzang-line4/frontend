import settingsIcon from '../../assets/home/settings.svg'
import * as S from '../../styles/home/HomePage.styles'

type Props = { onSettings: () => void }

export default function HomeHeader({ onSettings }: Props) {
  return (
    <S.Header>
      <S.HeaderRow>
        <S.Brand>moimzang</S.Brand>
        <S.SettingsButton type="button" aria-label="설정" onClick={onSettings}>
          <img src={settingsIcon} alt="" width={24} height={24} />
        </S.SettingsButton>
      </S.HeaderRow>
    </S.Header>
  )
}
