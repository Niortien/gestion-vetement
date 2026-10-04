interface EntreeImportZoneProps {
  onDropCsv?: () => void;
}

export function EntreeImportZone({ onDropCsv }: EntreeImportZoneProps) {
  return (
    <div
      className="rounded-lg border border-dashed border-border/80 bg-in-dim p-6 text-sm text-text-muted transition hover:border-accent hover:text-text"
      onDragOver={(event) => event.preventDefault()}
      onDrop={(event) => {
        event.preventDefault();
        onDropCsv?.();
      }}
    >
      Glisse un fichier CSV pour pr&eacute;-remplir la liste d&apos;entr&eacute;es
    </div>
  );
}
