"use client";

import type { ReactNode } from "react";
import { CommandBar } from "@/components/common/CommandBar";
import { MobileNav } from "@/components/common/MobileNav";
import { Sidebar } from "@/components/common/Sidebar";

interface DashboardShellProps {
  children: ReactNode;
}

export function DashboardShell({ children }: DashboardShellProps) {
  return (
    <div className="relative flex h-screen flex-col overflow-hidden bg-base lg:flex-row">
      <MobileNav />
      <Sidebar />
      <main id="contenu" className="relative flex-1 overflow-x-hidden overflow-y-auto p-4 md:p-6">
        {children}
      </main>
      <CommandBar />
    </div>
  );
}
