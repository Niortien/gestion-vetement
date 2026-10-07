"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { uploadLookbookPhoto } from "@/lib/vitrine-api";
import { readFileAsDataUrl } from "@/lib/files";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const schema = z.object({
  nom: z.string().optional(),
  telephone: z.string().optional(),
  message: z.string().optional(),
  consentement: z.literal(true, { errorMap: () => ({ message: "Ton accord est nécessaire pour publier la photo." }) }),
});
type FormData = z.infer<typeof schema>;

export function LookbookPhotoUpload() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [fileError, setFileError] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "submitting" | "done" | "error">("idle");

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selected = e.target.files?.[0] ?? null;
    setFileError(null);
    if (!selected) {
      setFile(null);
      setPreview(null);
      return;
    }
    if (!selected.type.startsWith("image/")) {
      setFileError("Le fichier doit être une image.");
      return;
    }
    if (selected.size > MAX_SIZE_BYTES) {
      setFileError("La photo est trop lourde (max 5 Mo).");
      return;
    }
    setFile(selected);
    setPreview(URL.createObjectURL(selected));
  }

  const onSubmit = handleSubmit(async (values) => {
    if (!file) {
      setFileError("Ajoute d'abord une photo.");
      return;
    }
    setStatus("submitting");
    try {
      const dataUrl = await readFileAsDataUrl(file);
      await uploadLookbookPhoto({
        photo: dataUrl,
        nom: values.nom || undefined,
        telephone: values.telephone || undefined,
        message: values.message || undefined,
      });
      setStatus("done");
      setFile(null);
      setPreview(null);
      reset();
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch {
      setStatus("error");
    }
  });

  const input = "input-field";
  return (
    <section id="envoyer" className="mx-auto max-w-[1280px] scroll-mt-24 px-3.5 pb-16 pt-12 md:px-8 md:pb-24 md:pt-16" aria-labelledby="envoyer-titre">
      <div className="v-card mx-auto max-w-xl p-5 md:p-8">
        <h2 id="envoyer-titre" className="v-t2">Envoie ta photo</h2>
        <p className="mt-2 text-[15px]" style={{ color: "var(--v-muted)" }}>
          Une photo de toi avec une pièce Dri Valé. On la vérifie avant de la publier ici.
        </p>

        {status === "done" ? (
          <p role="status" className="mt-6 rounded-2xl p-5 text-[15px] font-bold" style={{ backgroundColor: "var(--v-gold-dim)", color: "var(--v-text)" }}>
            Photo bien reçue ! On te recontacte très vite.
          </p>
        ) : (
          <form onSubmit={onSubmit} className="mt-6 space-y-4" noValidate>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileChange} className="sr-only" id="lookbook-photo-input" />
            <label
              htmlFor="lookbook-photo-input"
              className="flex min-h-[150px] cursor-pointer flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed p-5 text-center text-sm focus-within:outline focus-within:outline-2"
              style={{ borderColor: "var(--v-dim)", color: "var(--v-muted)" }}
            >
              {preview ? (
                <Image src={preview} alt="Aperçu de la photo" width={160} height={160} unoptimized className="h-40 w-40 rounded-xl object-cover" />
              ) : (
                <>
                  <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden style={{ color: "var(--v-text)" }}>
                    <path d="M12 16V4M7 9l5-5 5 5" />
                    <path d="M4 16v3a1 1 0 0 0 1 1h14a1 1 0 0 0 1-1v-3" />
                  </svg>
                  <strong style={{ color: "var(--v-text)" }}>Choisir une photo</strong>
                  JPEG ou PNG, 5 Mo au plus
                </>
              )}
            </label>
            {fileError && <p role="alert" className="text-[13px]" style={{ color: "var(--v-red)" }}>{fileError}</p>}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="lb-nom" className="text-[13px] font-bold">Ton prénom</label>
              <input id="lb-nom" {...register("nom")} placeholder="Affiché sous la photo" className={input} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lb-tel" className="text-[13px] font-bold">Ton numéro WhatsApp (facultatif)</label>
              <input id="lb-tel" {...register("telephone")} type="tel" placeholder="Pour te prévenir quand elle est en ligne" className={input} />
            </div>
            <div className="flex flex-col gap-1.5">
              <label htmlFor="lb-msg" className="text-[13px] font-bold">Un mot (facultatif)</label>
              <textarea id="lb-msg" {...register("message")} rows={3} placeholder="La pièce que tu portes, la boutique…" className={`${input} resize-none py-3.5`} />
            </div>

            <label htmlFor="lb-ok" className="flex items-start gap-3 text-sm leading-snug">
              <input id="lb-ok" type="checkbox" {...register("consentement")} className="mt-0.5 h-[22px] w-[22px] shrink-0" style={{ accentColor: "#0C0C0E" }} />
              J&rsquo;accepte que Dri Valé publie cette photo sur le site et ses réseaux.
            </label>
            {errors.consentement && <p role="alert" className="text-[13px]" style={{ color: "var(--v-red)" }}>{errors.consentement.message}</p>}

            {status === "error" && <p role="alert" className="text-[13px]" style={{ color: "var(--v-red)" }}>Envoi impossible pour le moment. Réessaie dans un instant.</p>}

            <button type="submit" disabled={status === "submitting"} className="v-btn v-btn-ink w-full disabled:cursor-not-allowed disabled:opacity-50">
              {status === "submitting" ? "Envoi en cours…" : "Envoyer pour validation"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
