import Link from "next/link";
import { Button } from "@heroui/react";
import { BrandMark } from "@/components/common/BrandMark";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-[70vh] max-w-xl flex-col items-center justify-center gap-4 px-4 text-center">
      <BrandMark />
      <p className="mt-4 font-mono text-sm text-text-muted">Erreur 404</p>
      <h1 className="font-display text-4xl font-extrabold tracking-tight text-text">Page introuvable</h1>
      <p className="text-sm text-text-muted">Cette page n&apos;existe pas ou a été déplacée.</p>
      <div className="mt-2 flex flex-wrap justify-center gap-3">
        <Button as={Link} href="/" className="bg-accent font-semibold text-on-accent">
          Retour à la vitrine
        </Button>
        <Button as={Link} href="/dashboard" variant="bordered" className="font-semibold">
          Espace boutique
        </Button>
      </div>
    </main>
  );
}
