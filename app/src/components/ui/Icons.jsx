const base = {
  fill: "none",
  stroke: "currentColor",
  strokeLinecap: "round",
  strokeLinejoin: "round",
  viewBox: "0 0 24 24",
  "aria-hidden": true,
};

const createIcon = (children, { strokeWidth = 2, defaultSize = 16 } = {}) =>
  function Icon({ size = defaultSize, className = "" }) {
    return (
      <svg width={size} height={size} strokeWidth={strokeWidth} className={className} {...base}>
        {children}
      </svg>
    );
  };

export const PlusIcon = createIcon(<path d="M12 5v14M5 12h14" />, { strokeWidth: 2.5 });

export const TrashIcon = createIcon(
  <path d="M3 6h18M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2m3 0v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
);

export const PencilIcon = createIcon(
  <>
    <path d="M12 20h9" />
    <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
  </>
);

export const ChevronLeftIcon = createIcon(<path d="M15 18l-6-6 6-6" />);

export const ChevronRightIcon = createIcon(<path d="M9 18l6-6-6-6" />);

export const ArrowLeftIcon = createIcon(<path d="M19 12H5M12 19l-7-7 7-7" />);

export const CalendarIcon = createIcon(
  <>
    <rect x="3" y="4" width="18" height="18" rx="2" />
    <path d="M16 2v4M8 2v4M3 10h18" />
  </>,
  { defaultSize: 14 }
);

export const ChecklistIcon = createIcon(
  <>
    <path d="M9 11l3 3L22 4" />
    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
  </>,
  { defaultSize: 14 }
);

export const CloseIcon = createIcon(<path d="M18 6L6 18M6 6l12 12" />, { defaultSize: 14 });

export const MailIcon = createIcon(
  <>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="M22 7l-10 6L2 7" />
  </>,
  { defaultSize: 18 }
);

export const GithubIcon = createIcon(
  <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22" />,
  { defaultSize: 18 }
);

export const LinkedinIcon = createIcon(
  <>
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6z" />
    <rect x="2" y="9" width="4" height="12" />
    <circle cx="4" cy="4" r="2" />
  </>,
  { defaultSize: 18 }
);

export const GlobeIcon = createIcon(
  <>
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </>,
  { defaultSize: 18 }
);

export function PlayIcon({ size = 18, className = "" }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M6 4.5v15a1 1 0 0 0 1.53.85l12-7.5a1 1 0 0 0 0-1.7l-12-7.5A1 1 0 0 0 6 4.5Z" />
    </svg>
  );
}

export const SOCIAL_ICONS = {
  github: GithubIcon,
  linkedin: LinkedinIcon,
  globe: GlobeIcon,
};
