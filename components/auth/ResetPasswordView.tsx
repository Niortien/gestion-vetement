"use client";

import { AuthCard } from "@/components/auth/AuthCard";
import { useState } from "react";
import { Button, Input } from "@heroui/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { apiPost } from "@/lib/api";
import { resetPasswordSchema, type ResetPasswordInput } from "@/lib/validators/auth.schema";
import type { AppError } from "@/types";

export function ResetPasswordView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const email = searchParams.get("email") ?? "";
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const motDePasse = watch("password") ?? "";
  const regles = [
    { ok: motDePasse.length >= 8, texte: "8 caractères au moins" },
    { ok: /\d/.test(motDePasse), texte: "Un chiffre" },
    { ok: /[A-ZÀ-Ý]/.test(motDePasse), texte: "Une majuscule, pour la quatrième étoile" },
    { ok: /[^A-Za-z0-9]/.test(motDePasse) || motDePasse.length >= 12, texte: "Un symbole ou 12 caractères" },
  ];
  const solidite = regles.filter((r) => r.ok).length;
  const libelleSolidite = ["Trop court", "Faible", "Correcte", "Bonne", "Excellente"][solidite];

  const onSubmit = handleSubmit(async (values) => {
    if (!token || !email) {
      toast.error("Lien de réinitialisation invalide");
      return;
    }
    setIsSubmitting(true);
    try {
      await apiPost<{ message: string }>("/auth/reset-password", { email, token, password: values.password });
      toast.success("Mot de passe réinitialisé, connecte-toi");
      router.push("/login");
    } catch (error) {
      const message = (error as AppError)?.message ?? "Lien invalide ou expiré";
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  });

  if (!token || !email) {
    return (
      <AuthCard title="Lien invalide">
        <p className="text-sm text-text-muted">
          Ce lien de réinitialisation est incomplet ou a expiré.
        </p>
        <Link href="/forgot-password" className="mt-4 block text-center text-sm text-accent hover:underline">
          Demander un nouveau lien
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard title="Nouveau mot de passe">
      <div className="space-y-3">
        <Input
          type="password"
          label="Nouveau mot de passe"
          variant="bordered"
          isInvalid={Boolean(errors.password)}
          errorMessage={errors.password?.message}
          {...register("password")}
        />
        <div className="flex items-center justify-between" aria-live="polite">
          <span className="text-[13px] font-bold">Solidité : {libelleSolidite.toLowerCase()}</span>
          <span aria-hidden className="flex items-end gap-1.5">
            {[12, 15, 18, 22].map((h, i) => (
              <i
                key={h}
                className="block"
                style={{
                  width: h,
                  height: h,
                  backgroundColor: i < solidite ? "#F0B429" : "var(--color-border)",
                  clipPath: "polygon(50% 0,62% 38%,100% 50%,62% 62%,50% 100%,38% 62%,0 50%,38% 38%)",
                }}
              />
            ))}
          </span>
        </div>
        <ul className="space-y-1 pb-1">
          {regles.map((r) => (
            <li key={r.texte} className="flex items-center gap-2.5 text-sm">
              <span
                aria-hidden
                className={`flex h-[18px] w-[18px] items-center justify-center rounded-full text-xs font-extrabold ${r.ok ? "bg-in-dim text-in-text" : "bg-surface-high text-text-muted"}`}
              >
                {r.ok ? "✓" : "·"}
              </span>
              <span className="sr-only">{r.ok ? "Respectée : " : "À respecter : "}</span>
              {r.texte}
            </li>
          ))}
        </ul>
        <Button className="w-full bg-accent font-semibold text-on-accent" size="lg" onPress={() => void onSubmit()} isLoading={isSubmitting}>
          Enregistrer et se connecter
        </Button>
      </div>
    </AuthCard>
  );
}
