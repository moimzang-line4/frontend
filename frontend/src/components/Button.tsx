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
        flex h-[55px] w-full shrink-0 items-center justify-center
        rounded-[14px] px-4
        font-sans text-[18px] leading-[27px] font-bold
        ${
          disabled
            ? 'cursor-not-allowed bg-[#d4d4d4] text-[#78918c]'
            : 'cursor-pointer bg-[linear-gradient(169.64deg,#5aa997_10.714%,#438b7e_82.143%)] text-white active:brightness-95'
        }
        focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-primary-strong
        ${className}
      `}
    >
      {children}
    </button>
  )
}