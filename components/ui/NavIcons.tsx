import React from 'react';

// Common SVG props
const svgProps = (size: number | string = 26, viewBox: string = "0 0 26 26") => ({
  width: size,
  height: size,
  viewBox: viewBox,
  fill: "none",
  stroke: "currentColor",
  strokeWidth: "1.5",
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
});

export const MarketsIcon = ({ size = 26, className = "", ...props }) => (
  <svg {...svgProps(size, "0 0 26 26")} className={className} {...props}>
    {/* Candlestick: vertical line with a filled body */}
    <line x1="13" y1="10" x2="13" y2="23" />
    <rect x="9" y="13" width="8" height="6" fill="currentColor" fillOpacity="0.2" />
    {/* Growing leaf from the top */}
    <path d="M13 10 C 13 4, 19 3, 19 3 C 18 8, 13 10, 13 10 Z" fill="currentColor" fillOpacity="0.8" stroke="currentColor"/>
    <path d="M7 17 L 3 21" />
    <circle cx="3" cy="21" r="1.5" fill="currentColor" />
  </svg>
);

export const ShopsIcon = ({ size = 26, className = "", ...props }) => (
  <svg {...svgProps(size, "0 0 26 26")} className={className} {...props}>
    {/* Awning */}
    <path d="M4 10 L 8 4 L 18 4 L 22 10 Z" fill="currentColor" fillOpacity="0.2" />
    <path d="M4 10 C 6 10, 7 12, 8.5 12 C 10 12, 11 10, 13 10 C 15 10, 16 12, 17.5 12 C 19 12, 20 10, 22 10" />
    {/* Poles */}
    <line x1="6" y1="10" x2="6" y2="22" />
    <line x1="20" y1="10" x2="20" y2="22" />
    <line x1="4" y1="22" x2="22" y2="22" />
    {/* Circuit dots at top corners */}
    <circle cx="8" cy="4" r="1.5" fill="currentColor" />
    <circle cx="18" cy="4" r="1.5" fill="currentColor" />
  </svg>
);

export const BudgetIcon = ({ size = 26, className = "", ...props }) => (
  <svg {...svgProps(size, "0 0 26 26")} className={className} {...props}>
    {/* Base and stand */}
    <line x1="13" y1="4" x2="13" y2="22" />
    <path d="M9 22 L 17 22" />
    {/* Beam */}
    <path d="M4 9 L 22 9" />
    {/* Left side: Peso */}
    <line x1="4" y1="9" x2="4" y2="12" />
    <rect x="2" y="12" width="4" height="6" rx="1" fill="currentColor" fillOpacity="0.2" />
    <path d="M3 14 L 5 14" />
    <path d="M3 16 L 5 16" />
    <path d="M4 13 L 4 17" />
    {/* Right side: Leaf */}
    <line x1="22" y1="9" x2="22" y2="13" />
    <path d="M22 13 C 22 13, 26 13, 26 17 C 26 17, 22 18, 22 18 C 22 18, 18 17, 18 13 C 18 13, 22 13, 22 13 Z" fill="currentColor" fillOpacity="0.8" />
  </svg>
);

export const VendorIcon = ({ size = 26, className = "", ...props }) => (
  <svg {...svgProps(size, "0 0 26 26")} className={className} {...props}>
    <rect x="4" y="4" width="8" height="8" rx="2" />
    <rect x="14" y="4" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.1" />
    <rect x="4" y="14" width="8" height="8" rx="2" fill="currentColor" fillOpacity="0.1" />
    {/* Bottom right is a leaf sprout instead of a box */}
    <path d="M18 22 C 18 22, 14 20, 14 16 C 14 16, 18 14, 22 14 C 22 14, 22 18, 18 22 Z" fill="currentColor" fillOpacity="0.8" />
    <path d="M14 22 L 18 18" />
  </svg>
);

export const AdminIcon = ({ size = 26, className = "", ...props }) => (
  <svg {...svgProps(size, "0 0 26 26")} className={className} {...props}>
    {/* Shield */}
    <path d="M13 3 L 4 7 L 4 13 C 4 18, 13 23, 13 23 C 13 23, 22 18, 22 13 L 22 7 Z" fill="currentColor" fillOpacity="0.1" />
    {/* Circuit nodes inside */}
    <circle cx="13" cy="11" r="2" fill="currentColor" fillOpacity="0.8" />
    <circle cx="9" cy="15" r="1.5" fill="currentColor" />
    <circle cx="17" cy="15" r="1.5" fill="currentColor" />
    <path d="M13 13 L 9 15" />
    <path d="M13 13 L 17 15" />
    <path d="M13 7 L 13 9" />
  </svg>
);

export const ConsumerRoleIcon = ({ size = 24, className = "", ...props }) => (
  <svg {...svgProps(size, "0 0 24 24")} className={className} {...props}>
    <circle cx="9" cy="20" r="1" fill="currentColor" />
    <circle cx="18" cy="20" r="1" fill="currentColor" />
    <path d="M3 3 L 5 3 L 8 16 L 19 16 L 21 8 L 6 8" fill="currentColor" fillOpacity="0.1" />
    <path d="M13 8 L 15 4" strokeDasharray="1 1" />
    <circle cx="15" cy="4" r="1" fill="currentColor" />
  </svg>
);

export const VendorRoleIcon = ({ size = 24, className = "", ...props }) => (
  <svg {...svgProps(size, "0 0 24 24")} className={className} {...props}>
    <path d="M3 9 L 12 3 L 21 9 L 21 20 L 3 20 Z" fill="currentColor" fillOpacity="0.1" />
    <path d="M9 20 L 9 14 L 15 14 L 15 20" />
    <circle cx="12" cy="9" r="1.5" fill="currentColor" />
    <path d="M12 11 L 12 14" />
  </svg>
);

export const AdminRoleIcon = ({ size = 24, className = "", ...props }) => (
  <svg {...svgProps(size, "0 0 24 24")} className={className} {...props}>
    <path d="M12 22 C 12 22, 20 18, 20 12 L 20 5 L 12 2 L 4 5 L 4 12 C 4 18, 12 22, 12 22 Z" fill="currentColor" fillOpacity="0.1" />
    <circle cx="12" cy="10" r="1.5" fill="currentColor" />
    <path d="M12 11.5 L 12 16" />
    <circle cx="9" cy="14" r="1" fill="currentColor" />
    <circle cx="15" cy="14" r="1" fill="currentColor" />
    <path d="M12 13 L 9 14" />
    <path d="M12 13 L 15 14" />
  </svg>
);
