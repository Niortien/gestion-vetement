"use client";

import { Button } from "@heroui/react";
import { useExportExcel, useExportPdf } from "@/features/rapports/query/rapports-queries";

export function RapportExportBar() {
  const exportExcel = useExportExcel();
  const exportPdf = useExportPdf();

  return (
    <div className="sticky bottom-3 flex gap-2 rounded-md border border-border bg-surface p-3">
      <Button variant="bordered" onPress={() => void exportExcel()}>
        Export Excel
      </Button>
      <Button variant="bordered" onPress={() => void exportPdf()}>
        Export PDF
      </Button>
    </div>
  );
}
