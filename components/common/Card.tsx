import type { ElementType, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  elevated?: boolean;
  glow?: boolean;
}

export function Card({ children, className = "", as, elevated = false, glow = false }: CardProps) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      className={[
        "rounded-[22px] bg-surface shadow-[0_0_0_1px_var(--color-border)]",
        elevated && "shadow-md",
        glow && "shadow-glow-orange",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
