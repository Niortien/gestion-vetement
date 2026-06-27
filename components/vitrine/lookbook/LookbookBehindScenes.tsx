"use client";

import { useRef } from "react";
import { motion } from "framer-motion";

const BTS_PHOTOS = [
  { id: 1, src: "/bts-1.jpg", alt: "BTS shooting 1", caption: "Setup — Almadies" },
  { id: 2, src: "/bts-2.jpg", alt: "BTS shooting 2", caption: "Entre deux shots" },
  { id: 3, src: "/bts-3.jpg", alt: "BTS shooting 3", caption: "Lumière de fin de journée" },
  { id: 4, src: "/bts-4.jpg", alt: "BTS shooting 4", caption: "Détail — Jordan Air 1" },
  { id: 5, src: "/bts-5.jpg", alt: "BTS shooting 5", caption: "Préparation lookbook" },
  { id: 6, src: "/bts-6.jpg", alt: "BTS shooting 6", caption: "Équipe Yop City" },
];

export function LookbookBehindScenes() {
  const scrollRef = useRef<HTMLDivElement>(null);

  return (
    <section
      className="overflow-hidden py-20"
      style={{ backgroundColor: "var(--v-s1)" }}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10"
        >
          <p
            className="mb-2 text-[10px] font-black uppercase tracking-[0.4em]"
            style={{ color: "var(--v-gold)" }}
          >
            Dans les coulisses
          </p>
          <h2
            className="font-[var(--font-display)] font-black uppercase leading-none tracking-tight"
            style={{ fontSize: "clamp(28px,5vw,56px)", color: "var(--v-text)" }}
          >
            Behind the
            <br />
            <span style={{ color: "var(--v-hot)" }}>Scenes</span>
          </h2>
        </motion.div>
      </div>

      {/* Carousel horizontal */}
      <div
        ref={scrollRef}
        className="flex gap-4 overflow-x-auto pb-4"
        style={{ paddingLeft: "clamp(20px,5vw,80px)", scrollbarWidth: "none" }}
      >
        {BTS_PHOTOS.map((photo, i) => (
          <motion.div
            key={photo.id}
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07, duration: 0.4 }}
            className="group relative flex-shrink-0 overflow-hidden rounded-xl"
            style={{ width: "280px", aspectRatio: "3/4", backgroundColor: "var(--v-s2)" }}
          >
            <img
              src={photo.src}
              alt={photo.alt}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
            <div
              className="absolute inset-0"
              style={{ background: "linear-gradient(135deg, var(--v-s2), var(--v-s3))" }}
            />
            <div
              className="absolute bottom-0 left-0 right-0 translate-y-full p-4 transition-transform duration-300 group-hover:translate-y-0"
              style={{ backgroundColor: "rgba(6,6,7,0.92)" }}
            >
              <p className="text-xs font-bold" style={{ color: "var(--v-gold)" }}>
                {photo.caption}
              </p>
            </div>
          </motion.div>
        ))}
        <div className="flex-shrink-0 w-5" />
      </div>
    </section>
  );
}
