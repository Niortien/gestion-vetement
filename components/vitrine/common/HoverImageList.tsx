"use client";

/*
 * Liste de lignes avec aperçu photo qui suit le curseur — adapté du composant « Hover Image List » (21st.dev,
 * @educalvolpz). Adaptations : framer-motion v11 à la place de `motion/react`, icônes et tokens `--v-*` de la
 * vitrine, lignes rendues avec `next/link`. Sur écran tactile ou sous `prefers-reduced-motion`, l'aperçu est fixe
 * à droite de la ligne active (aucun suivi du pointeur).
 */
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useReducedMotion, useSpring } from "framer-motion";
import type { FocusEvent, PointerEvent } from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import { IconArrowUpRight } from "@/components/vitrine/common/VitrineIcons";

export interface HoverImageListItem {
  id: string;
  title: string;
  meta?: string;
  href: string;
  /** Peut être absent : la ligne reste cliquable, sans aperçu. */
  image?: string | null;
  alt: string;
}

interface HoverImageListProps {
  items: HoverImageListItem[];
  className?: string;
  imageSize?: number;
}

const SPRING = { damping: 26, stiffness: 260 };
const SKEW_SPRING = { damping: 18, stiffness: 220 };
const MAX_SKEW = 8;
const SKEW_FACTOR = 0.12;
const MAX_FRAME_DELTA_MS = 50;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

type Source = "focus" | "pointer" | null;

export function HoverImageList({ items, className, imageSize = 220 }: HoverImageListProps) {
  const reduced = useReducedMotion();
  const [isHoverDevice, setIsHoverDevice] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [source, setSource] = useState<Source>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPointer = useRef<{ t: number; x: number } | null>(null);
  const pending = useRef<{ x: number; y: number } | null>(null);
  const frame = useRef<number | null>(null);

  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const skew = useMotionValue(0);
  const springX = useSpring(x, SPRING);
  const springY = useSpring(y, SPRING);
  const springSkew = useSpring(skew, SKEW_SPRING);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    setIsHoverDevice(mq.matches);
    const onChange = (e: MediaQueryListEvent) => setIsHoverDevice(e.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(
    () => () => {
      if (frame.current !== null) cancelAnimationFrame(frame.current);
    },
    []
  );

  const fixed = Boolean(reduced) || !isHoverDevice || source === "focus";

  const onMove = useCallback(
    (e: PointerEvent<HTMLDivElement>) => {
      if (fixed) return;
      pending.current = { x: e.clientX, y: e.clientY };
      if (frame.current !== null) return;
      frame.current = requestAnimationFrame((now) => {
        frame.current = null;
        const p = pending.current;
        const box = containerRef.current;
        if (!p || !box) return;
        const rect = box.getBoundingClientRect();
        const lx = p.x - rect.left;
        const ly = p.y - rect.top;
        let vx = 0;
        if (lastPointer.current) {
          const dt = Math.min(now - lastPointer.current.t, MAX_FRAME_DELTA_MS);
          if (dt > 0) vx = (lx - lastPointer.current.x) / dt;
        }
        lastPointer.current = { t: now, x: lx };
        skew.set(clamp(vx * SKEW_FACTOR, -MAX_SKEW, MAX_SKEW));
        x.set(lx - imageSize / 2);
        y.set(ly - imageSize / 2);
      });
    },
    [fixed, imageSize, skew, x, y]
  );

  const leave = () => {
    setActiveIndex(null);
    setSource(null);
    lastPointer.current = null;
  };

  const onBlur = (e: FocusEvent<HTMLDivElement>) => {
    if (source === "focus" && !e.currentTarget.contains(e.relatedTarget)) leave();
  };

  const active = activeIndex === null ? null : items[activeIndex];
  const preview = active?.image ? active : null;

  return (
    <div ref={containerRef} className={cn("relative", className)} onPointerMove={onMove} onPointerLeave={leave} onBlur={onBlur}>
      <ul>
        {items.map((item, i) => (
          <li key={item.id} style={{ borderBottom: "1px solid var(--v-border)" }}>
            <Link
              href={item.href}
              className="group flex min-h-16 w-full items-center justify-between gap-4 py-4"
              onFocus={() => {
                setActiveIndex(i);
                setSource("focus");
              }}
              onMouseEnter={() => {
                if (isHoverDevice) {
                  setActiveIndex(i);
                  setSource("pointer");
                }
              }}
            >
              <span className="flex min-w-0 items-baseline gap-3">
                <span
                  className="tag-title truncate text-[clamp(26px,5vw,48px)] transition-colors duration-200 group-hover:text-[var(--v-gold-text)]"
                  style={{ color: "var(--v-text)" }}
                >
                  {item.title}
                </span>
                {item.meta && (
                  <span className="shrink-0 text-xs" style={{ color: "var(--v-dim)" }}>
                    {item.meta}
                  </span>
                )}
              </span>
              <IconArrowUpRight
                size={20}
                className="shrink-0 opacity-60 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                style={{ color: "var(--v-gold-text)" }}
              />
            </Link>
          </li>
        ))}
      </ul>

      <div aria-hidden className="pointer-events-none absolute inset-0 hidden overflow-hidden md:block">
        <motion.div
          className={cn("absolute overflow-hidden rounded-2xl", fixed && "right-24 top-1/2 -translate-y-1/2")}
          initial={{ opacity: 0, scale: reduced ? 1 : 0.94 }}
          animate={{ opacity: preview ? 1 : 0, scale: preview || reduced ? 1 : 0.94 }}
          transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.1, duration: 0.25 }}
          style={
            fixed
              ? { width: imageSize, height: imageSize, backgroundColor: "var(--v-s2)" }
              : {
                  width: imageSize,
                  height: imageSize,
                  left: 0,
                  top: 0,
                  x: springX,
                  y: springY,
                  skewX: reduced ? 0 : springSkew,
                  backgroundColor: "var(--v-s2)",
                  boxShadow: "var(--v-shadow-card)",
                }
          }
        >
          <AnimatePresence initial={false}>
            {preview?.image && (
              // eslint-disable-next-line @next/next/no-img-element
              <motion.img
                key={preview.id}
                src={preview.image}
                alt={preview.alt}
                className="absolute inset-0 h-full w-full object-cover"
                initial={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: reduced ? 1 : 0.96 }}
                transition={reduced ? { duration: 0 } : { type: "spring", bounce: 0.1, duration: 0.25 }}
              />
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}
