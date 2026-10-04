import { VitrineRoot } from "@/components/vitrine/layout/VitrineRoot";
import { VitrineNav } from "@/components/vitrine/layout/VitrineNav";
import { VitrineFooter } from "@/components/vitrine/layout/VitrineFooter";
import { VitrineDock } from "@/components/vitrine/layout/VitrineDock";
import { CartDrawer } from "@/components/vitrine/layout/CartDrawer";

export default function VitrineLayout({ children }: { children: React.ReactNode }) {
  return (
    <VitrineRoot>
      <VitrineNav />
      <main className="pb-20 pt-20 md:pb-0">{children}</main>
      <VitrineFooter />
      <CartDrawer />
      <VitrineDock />
    </VitrineRoot>
  );
}
