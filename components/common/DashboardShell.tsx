"use client";

import type { ReactNode } from "react";
import { AnimatePresence } from "framer-motion";
import { CommandBar } from "@/components/common/CommandBar";
import { Sidebar } from "@/components/common/Sidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative flex h-screen overflow-hidden bg-base">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(900px_500px_at_90%_-5%,rgba(143,126,245,0.16),transparent_62%)]" />
      <Sidebar />
      <main className="relative flex-1 overflow-y-auto p-4 md:p-6">
        <AnimatePresence mode="wait">{children}</AnimatePresence>
      </main>
      <CommandBar />
    </div>
  );
}
