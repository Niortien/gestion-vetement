"use client";

import { motion } from "framer-motion";

const HORAIRES = [
  { jour: "Lundi – Vendredi", heure: "09:00 – 20:00" },
  { jour: "Samedi", heure: "09:00 – 22:00" },
  { jour: "Dimanche", heure: "11:00 – 18:00" },
];

export function MarqueContact() {
  return (
    <section className="mx-auto max-w-5xl px-5 py-24 md:px-16">
      <motion.p
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mb-2 text-[10px] font-bold uppercase tracking-[0.4em]"
        style={{ color: "var(--v-lime)" }}
      >
        Venir nous voir
      </motion.p>
      <motion.h2
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="mb-12 font-black uppercase leading-none tracking-tight"
        style={{ fontSize: "clamp(32px,6vw,64px)", color: "var(--v-text)" }}
      >
        Contact
      </motion.h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {/* Adresse */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--v-s2)" }}
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--v-lime)" }}>
            Adresse
          </p>
          <p className="text-sm font-semibold leading-relaxed" style={{ color: "var(--v-text)" }}>
            Rue des Almadies
            <br />
            Dakar, Sénégal
          </p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 inline-block text-[11px] font-bold uppercase tracking-widest transition-colors hover:text-[var(--v-text)]"
            style={{ color: "var(--v-muted)" }}
          >
            Voir sur Google Maps →
          </a>
        </motion.div>

        {/* Horaires */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.08 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--v-s2)" }}
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--v-lime)" }}>
            Horaires
          </p>
          <div className="space-y-2">
            {HORAIRES.map((h) => (
              <div key={h.jour} className="flex items-center justify-between">
                <span className="text-xs" style={{ color: "var(--v-muted)" }}>{h.jour}</span>
                <span className="font-[var(--font-mono)] text-xs font-black" style={{ color: "var(--v-text)" }}>
                  {h.heure}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Contact direct */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.16 }}
          className="rounded-2xl p-6"
          style={{ backgroundColor: "var(--v-s2)" }}
        >
          <p className="mb-3 text-[10px] font-bold uppercase tracking-widest" style={{ color: "var(--v-lime)" }}>
            Contact direct
          </p>
          <div className="space-y-3">
            <a
              href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "221700000000"}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--v-text)]"
              style={{ color: "var(--v-muted)" }}
            >
              <span style={{ color: "#25D366" }}>●</span>
              WhatsApp Business
            </a>
            <a
              href="mailto:contact@riviere.sn"
              className="flex items-center gap-2 text-sm font-semibold transition-colors hover:text-[var(--v-text)]"
              style={{ color: "var(--v-muted)" }}
            >
              <span style={{ color: "var(--v-purple)" }}>●</span>
              contact@riviere.sn
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
