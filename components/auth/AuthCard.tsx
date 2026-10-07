import type { ReactNode } from "react";

interface AuthCardProps {
  title: string;
  description?: string;
  children: ReactNode;
}

/** Carte de formulaire d'authentification (titre, texte d'aide, contenu). */
export function AuthCard({ title, description, children }: AuthCardProps) {
  return (
    <section className="rounded-[28px] border border-border bg-surface p-6 shadow-card md:p-9">
      <h1 className="font-display text-[34px] font-bold leading-tight tracking-tight text-text">{title}</h1>
      {description && <p className="mt-1.5 text-sm text-text-muted">{description}</p>}
      <div className="mt-6">{children}</div>
    </section>
  );
}
