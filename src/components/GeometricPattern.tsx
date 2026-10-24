import { useId } from "react";

export function GeometricPattern({ className = "" }: { className?: string }) {
  const id = useId();
  return (
    <svg className={className} aria-hidden="true">
      <defs>
        <pattern id={id} width="80" height="80" patternUnits="userSpaceOnUse">
          <g fill="none" stroke="currentColor" strokeWidth="1.2">
            <rect x="20" y="20" width="40" height="40" />
            <rect x="20" y="20" width="40" height="40" transform="rotate(45 40 40)" />
            <circle cx="40" cy="40" r="8" />
            <path d="M0 0l20 20M80 0L60 20M0 80l20-20M80 80L60 60" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
