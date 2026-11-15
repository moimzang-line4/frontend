import { useRef, useState } from 'react'
import type { PointerEvent } from 'react'

type Gesture = {
  pointerId: number
  startX: number
  startY: number
  width: number
  offset: number
  axis: 'pending' | 'horizontal' | 'vertical'
}

export default function useOnboardingSlider(count: number, initialStep = 0) {
  const [step, setStep] = useState(initialStep)
  const [dragX, setDragX] = useState(0)
  const [dragging, setDragging] = useState(false)
  const trackRef = useRef<HTMLDivElement>(null)
  const gesture = useRef<Gesture | null>(null)

  function goToStep(next: number) {
    gesture.current = null
    setDragging(false)
    setDragX(0)
    setStep(Math.max(0, Math.min(next, count - 1)))
  }

  function onPointerDown(event: PointerEvent<HTMLDivElement>) {
    if (
      !event.isPrimary ||
      (event.pointerType === 'mouse' && event.button !== 0)
    )
      return
    const width = event.currentTarget.clientWidth
    if (!width || !trackRef.current) return

    // 전환 중 다시 잡아도 현재 보이는 위치에서 드래그를 이어가요.
    const transform = getComputedStyle(trackRef.current).transform
    const translateX =
      transform === 'none' ? 0 : new DOMMatrixReadOnly(transform).m41
    const offset = translateX + step * width
    gesture.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      width,
      offset,
      axis: 'pending',
    }
    setDragX(offset)
    setDragging(true)
    event.currentTarget.setPointerCapture(event.pointerId)
  }

  function onPointerMove(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (!current || current.pointerId !== event.pointerId) return
    const x = event.clientX - current.startX
    const y = event.clientY - current.startY
    if (current.axis === 'pending') {
      if (Math.max(Math.abs(x), Math.abs(y)) < 8) return
      current.axis = Math.abs(x) > Math.abs(y) * 1.2 ? 'horizontal' : 'vertical'
    }
    if (current.axis !== 'horizontal') return
    const distance = current.offset + x
    const atEdge =
      (step === 0 && distance > 0) || (step === count - 1 && distance < 0)
    setDragX(
      Math.max(-current.width, Math.min(distance, current.width)) *
        (atEdge ? 0.18 : 1),
    )
  }

  function onPointerUp(event: PointerEvent<HTMLDivElement>) {
    const current = gesture.current
    if (!current || current.pointerId !== event.pointerId) return
    const distance = current.offset + event.clientX - current.startX
    const threshold = Math.min(90, current.width * 0.22)
    const direction =
      current.axis === 'horizontal' && Math.abs(distance) >= threshold
        ? distance < 0
          ? 1
          : -1
        : 0
    goToStep(step + direction)
    if (event.currentTarget.hasPointerCapture(event.pointerId))
      event.currentTarget.releasePointerCapture(event.pointerId)
  }

  function onPointerCancel(event: PointerEvent<HTMLDivElement>) {
    if (gesture.current?.pointerId === event.pointerId) goToStep(step)
  }

  return {
    step,
    dragX,
    dragging,
    trackRef,
    goToStep,
    pointerHandlers: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onPointerCancel,
      onLostPointerCapture: onPointerCancel,
    },
  }
}
