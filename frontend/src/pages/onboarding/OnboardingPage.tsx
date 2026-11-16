import { useEffect, useState } from 'react'
import { Navigate, useNavigate, useSearchParams } from 'react-router'

import useOnboardingSlider from '../../hooks/onboarding/useOnboardingSlider'
import useOnboarding from '../../hooks/onboarding/useOnboarding'
import OnboardingIllustration from '../../components/onboarding/OnboardingIllustration'
import hasServerGroup from '../../utils/groups/hasServerGroup'

import wave from '../../assets/onboarding/wave.svg'

import * as S from '../../styles/onboarding/OnboardingPage.styles'

const slides = [
  {
    title: '모임의 모든 일정을\n한눈에 관리해요',
    description: '공연, MT, 정기회의까지\n캘린더로 한눈에 확인하고 관리해요.',
  },
  {
    title: '출석과 명단도\n간편하게',
    description:
      '참가자 관리부터 출석 처리까지\n필요한 정보를 한곳에서 관리해요.',
  },
  {
    title: '정산도, 공지도\nAI로 더 빠르고 똑똑하게',
    description: '영수증 등록부터 회비 정산,\n공지 작성까지 AI가 도와줘요.',
  },
]

export default function OnboardingPage() {
  const navigate = useNavigate()
  const onboarding = useOnboarding()
  const [params] = useSearchParams()

  const replay = params.get('replay') === '1'
  const resumeLastStep = replay && params.get('step') === '3'

  const [phase, setPhase] = useState<'light' | 'mint' | 'slides'>(
    resumeLastStep ? 'slides' : 'light',
  )
  const { step, dragX, dragging, trackRef, goToStep, pointerHandlers } =
    useOnboardingSlider(slides.length, resumeLastStep ? 2 : 0)
  const [error, setError] = useState('')

  useEffect(() => {
    if (resumeLastStep) return

    // 1초부터 초록 배경으로 부드럽게 전환
    const mintTimer = window.setTimeout(() => {
      setPhase('mint')
    }, 1000)

    // 총 2초 후 온보딩으로 이동
    const slidesTimer = window.setTimeout(() => {
      setPhase('slides')
    }, 2000)

    return () => {
      window.clearTimeout(mintTimer)
      window.clearTimeout(slidesTimer)
    }
  }, [resumeLastStep])

  function finish() {
    try {
      onboarding.update({ completed: true })
      navigate('/groups/new', { replace: true })
    } catch (caught) {
      setError(
        caught instanceof Error
          ? caught.message
          : '진행 상태를 저장하지 못했어요.',
      )
    }
  }

  if (onboarding.completed && !replay) {
  return (
    <Navigate
      to={
        hasServerGroup(onboarding.group)
          ? '/'
          : '/groups/new'
      }
      replace
    />
  )
}
  if (phase !== 'slides') {
    return (
      <S.Splash
        $mint={phase === 'mint'}
        $leaving={false}
        aria-label="moimzang 시작 화면"
      >
        <h1>
          <span>moimzang</span>
        </h1>
      </S.Splash>
    )
  }

  return (
    <S.Root>
      <S.TopBar>
        <button type="button" onClick={finish}>
          건너뛰기
        </button>
      </S.TopBar>

      <S.Panel aria-label={`온보딩 ${step + 1}단계`}>
        <S.Wave src={wave} alt="" width={460} height={150} draggable={false} />

        <S.Viewport
          {...pointerHandlers}
          role="region"
          aria-roledescription="슬라이드"
          aria-label="온보딩 소개"
          tabIndex={0}
          onKeyDown={(event) => {
            if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
              event.preventDefault()
              goToStep(step + (event.key === 'ArrowRight' ? 1 : -1))
            }
          }}
          onDragStart={(event) => event.preventDefault()}
        >
          <S.Track
            ref={trackRef}
            $dragging={dragging}
            style={{
              transform: `translate3d(calc(${-step * 100}% + ${dragX}px), 0, 0)`,
            }}
          >
            {slides.map((slide, index) => (
              <S.Slide
                key={slide.title}
                aria-hidden={step !== index}
                inert={step !== index}
              >
                <S.Brand>moimzang</S.Brand>
                <S.Title>{slide.title}</S.Title>
                <S.Description>{slide.description}</S.Description>
                <OnboardingIllustration step={index} />
              </S.Slide>
            ))}
          </S.Track>
        </S.Viewport>

        <S.Controls>
          <S.Dots aria-label="온보딩 단계">
            {slides.map((slide, index) => (
              <S.Dot
                key={slide.title}
                type="button"
                aria-label={`온보딩 ${index + 1}단계로 이동`}
                aria-current={step === index ? 'step' : undefined}
                $active={step === index}
                onClick={() => goToStep(index)}
              />
            ))}
          </S.Dots>

          <S.Next
            type="button"
            $primary={step === 2}
            onClick={() => {
              if (step === 2) {
                finish()
                return
              }

              goToStep(step + 1)
            }}
          >
            {step === 2 ? '지금 시작하기' : '다음'}
          </S.Next>
        </S.Controls>

        {error && <S.Error role="alert">{error}</S.Error>}
      </S.Panel>
    </S.Root>
  )
}
