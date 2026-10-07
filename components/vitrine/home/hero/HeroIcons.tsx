interface HeroIconProps {
  size?: number;
}

function Stroke({ size = 18, d }: HeroIconProps & { d: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d={d} />
    </svg>
  );
}

export const IconArrowRight = (p: HeroIconProps) => <Stroke {...p} d="M5 12h14M13 6l6 6-6 6" />;
export const IconArrowUpRight = (p: HeroIconProps) => <Stroke {...p} d="M7 17L17 7M9 7h8v8" />;
export const IconArrowDown = (p: HeroIconProps) => <Stroke {...p} d="M12 5v14M6 13l6 6 6-6" />;
