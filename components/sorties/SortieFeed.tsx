import { Timeline } from "@/components/common/Timeline";
import type { Sortie } from "@/types";
import { SortieFeedItem } from "./SortieFeedItem";

interface SortieFeedProps {
  items: Sortie[];
  density?: "compact" | "cozy";
}

export function SortieFeed({ items, density = "cozy" }: SortieFeedProps) {
  return (
    <Timeline density={density}>
      {items.map((sortie) => (
        <SortieFeedItem key={sortie.id} sortie={sortie} />
      ))}
    </Timeline>
  );
}
