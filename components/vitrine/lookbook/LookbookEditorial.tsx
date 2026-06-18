"use client";

import { motion } from "framer-motion";

export function LookbookEditorial() {
  return (
    <section className="mx-auto max-w-7xl px-5 py-24 md:px-16">
      <div className="grid grid-cols-1 items-center gap-16 md:grid-cols-2">
        {/* Texte gauche */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <p
            className="mb-6 text-[10px] font-bold uppercase tracking-[0.4em]"
            style={{ color: "var(--v-lime)" }}
          >
            L&apos;histoire derrière la collection
          </p>
          <h2
            className="mb-8 font-black uppercase leading-tight tracking-tight"
            style={{ fontSize: "clamp(28px,5vw,52px)", color: "var(--v-text)" }}
          >
            Inspiré par
            <br />
            les nuits de Dakar
          </h2>
          <p className="mb-5 text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
            Quand la chaleur du jour laisse place à l&apos;électricité de la nuit, Dakar révèle
            une autre dimension. Les Almadies, Ngor, la Corniche — des spots où la mode se vit
            sans codes imposés, où chaque look est une déclaration d&apos;identité.
          </p>
          <p className="text-sm leading-relaxed" style={{ color: "var(--v-muted)" }}>
            Riviere a shooté cette collection là où la ville respire : dans les ruelles,
            sous les néons, au bord de l&apos;eau. Des pièces pensées pour habiter ces moments.
          </p>

          {/* Stats éditoriales */}
          <div className="mt-12 grid grid-cols-3 gap-6 border-t pt-8" style={{ borderColor: "var(--v-border)" }}>
            {[
              { value: "12", label: "Pièces" },
              { value: "3", label: "Looks" },
              { value: "100%", label: "Dakarois" },
            ].map((stat) => (
              <div key={stat.label}>
                <p
                  className="font-[var(--font-mono)] text-2xl font-black"
                  style={{ color: "var(--v-lime)" }}
                >
                  {stat.value}
                </p>
                <p className="mt-1 text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--v-dim)" }}>
                  {stat.label}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Photo droite */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="relative"
        >
          <div
            className="aspect-[3/4] w-full overflow-hidden rounded-2xl"
            style={{ backgroundColor: "var(--v-s2)" }}
          >
            <img
              src="/lookbook-editorial.jpg"
              alt="Editorial Dakar Nights"
              className="h-full w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            {/* Placeholder gradient */}
            <div
              className="flex h-full w-full items-end p-6"
              style={{
                background: "linear-gradient(135deg, var(--v-s2) 0%, var(--v-s3) 100%)",
              }}
            >
              <p
                className="font-black text-5xl uppercase leading-none opacity-10"
                style={{ color: "var(--v-text)" }}
              >
                EDITORIAL
              </p>
            </div>
          </div>

          {/* Accent lime */}
          <div
            className="absolute -bottom-4 -right-4 h-24 w-24 rounded-2xl"
            style={{ backgroundColor: "var(--v-lime)", zIndex: -1 }}
          />
        </motion.div>
      </div>
    </section>
  );
}
