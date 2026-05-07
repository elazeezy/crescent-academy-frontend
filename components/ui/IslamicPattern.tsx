interface Props {
  opacity?: number;
  variant?: "full" | "corner" | "strip";
  className?: string;
}

export default function IslamicPattern({
  opacity = 0.04,
  variant = "full",
  className = "",
}: Props) {
  const patternEl = (
    <defs>
      <pattern id={`ip-${variant}`} x="0" y="0" width="80" height="80" patternUnits="userSpaceOnUse">
        <polygon
          points="40,4 47,20 62,13 55,28 72,35 55,42 62,57 47,50 40,66 33,50 18,57 25,42 8,35 25,28 18,13 33,20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.7"
        />
        <circle cx="40" cy="35" r="7" fill="none" stroke="currentColor" strokeWidth="0.5" />
        <circle cx="40" cy="35" r="2" fill="currentColor" />
      </pattern>
    </defs>
  );

  if (variant === "corner") {
    return (
      <svg
        aria-hidden
        className={`absolute top-0 right-0 w-64 h-64 pointer-events-none select-none ${className}`}
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {patternEl}
        <rect width="100%" height="100%" fill={`url(#ip-${variant})`} />
      </svg>
    );
  }

  if (variant === "strip") {
    return (
      <svg
        aria-hidden
        className={`absolute inset-x-0 top-0 w-full h-20 pointer-events-none select-none ${className}`}
        style={{ opacity }}
        xmlns="http://www.w3.org/2000/svg"
      >
        {patternEl}
        <rect width="100%" height="100%" fill={`url(#ip-${variant})`} />
      </svg>
    );
  }

  return (
    <svg
      aria-hidden
      className={`absolute inset-0 w-full h-full pointer-events-none select-none ${className}`}
      style={{ opacity }}
      xmlns="http://www.w3.org/2000/svg"
    >
      {patternEl}
      <rect width="100%" height="100%" fill={`url(#ip-${variant})`} />
    </svg>
  );
}
