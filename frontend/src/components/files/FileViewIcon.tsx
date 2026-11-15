export default function FileViewIcon({ view }: { view: 'list' | 'grid' }) {
  return (
    <svg
      width={24}
      height={24}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      {view === 'list' ? (
        <path
          d="M6 7h12M6 12h12M6 17h12"
          stroke="currentColor"
          strokeLinecap="round"
        />
      ) : (
        <g stroke="currentColor">
          <rect x="6" y="6" width="4.5" height="4.5" rx="0.5" />
          <rect x="13.5" y="6" width="4.5" height="4.5" rx="0.5" />
          <rect x="6" y="13.5" width="4.5" height="4.5" rx="0.5" />
          <rect x="13.5" y="13.5" width="4.5" height="4.5" rx="0.5" />
        </g>
      )}
    </svg>
  )
}
