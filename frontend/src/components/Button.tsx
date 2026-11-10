import type { ButtonHTMLAttributes } from 'react'

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement>

export default function Button({
  children,
  type = 'button',
  disabled = false,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      {...props}
      type={type}
      disabled={disabled}
      className={`
        flex h-[48px] w-full shrink-0
        items-center justify-center
        rounded-[12px] px-[16px]
        font-sans text-button font-bold
        border border-solid border-white/20
        ${
          disabled
            ? `
              cursor-not-allowed
              bg-button-disabled text-button-disabled-text
            `
            : `
              cursor-pointer bg-button-gradient
              text-white
              shadow-[0_5px_14px_rgba(63,143,128,0.18)]
              active:brightness-95
            `
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}