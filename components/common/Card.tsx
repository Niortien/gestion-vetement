import type { ElementType, ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
  as?: "div" | "section" | "article";
  elevated?: boolean;
}

export function Card({ children, className = "", as, elevated = false }: CardProps) {
  const Tag = (as ?? "div") as ElementType;

  return (
    <Tag
      className={[
        "rounded-lg border border-border/60 bg-surface",
        elevated ? "shadow-md" : "shadow-card",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {children}
    </Tag>
  );
}
