import { VitrineNav } from "@/components/vitrine/layout/VitrineNav";
import { VitrineFooter } from "@/components/vitrine/layout/VitrineFooter";
import { CartDrawer } from "@/components/vitrine/layout/CartDrawer";

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
  return (
    <div data-vitrine className="min-h-screen" style={{ backgroundColor: "var(--v-bg)", color: "var(--v-text)" }}>
      <VitrineNav />
      <main className="pt-16">{children}</main>
      <VitrineFooter />
      <CartDrawer />
    </div>
  );
}
