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
        flex h-button w-full shrink-0
        items-center justify-center
        rounded-button px-4
        font-sans text-button font-bold
        ${
          disabled
            ? `
              cursor-not-allowed
              bg-button-disabled text-button-disabled-text
            `
            : `
              cursor-pointer bg-button-gradient
              text-white active:brightness-95
            `
        }
        ${className}
      `}
    >
      {children}
    </button>
  )
}