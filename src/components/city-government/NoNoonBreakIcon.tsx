// src/components/city-government/NoNoonBreakIcon.tsx

const NoNoonBreakIcon = ({ className = "w-5 h-5" }: { className?: string }) => (
  <svg
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    {/* Clock circle */}
    <circle
      cx="24"
      cy="24"
      r="19"
      stroke="currentColor"
      strokeWidth="2"
    />

    {/* Tick marks at 12, 3, 6, 9 */}
    <line x1="24" y1="5" x2="24" y2="8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="43" y1="24" x2="40" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="24" y1="43" x2="24" y2="40" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="5" y1="24" x2="8" y2="24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />

    {/* Arrow hand pointing to 12 (noon) */}
    <line
      x1="24"
      y1="30"
      x2="24"
      y2="13"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M19 18 L24 11 L29 18"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="none"
    />

    {/* Center dot */}
    <circle cx="24" cy="30" r="2" fill="currentColor" />
  </svg>
);

export default NoNoonBreakIcon;