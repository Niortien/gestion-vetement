"use client";

import { useState } from "react";
import {
  Button,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  IconBrandWhatsapp,
  IconBuildingStore,
  IconMapPin,
  IconPencil,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ConfirmModal } from "@/components/common/ConfirmModal";
import { CountUp } from "@/components/common/CountUp";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SpotlightCard } from "@/components/common/SpotlightCard";
import { StatTile } from "@/components/common/StatTile";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { motionEasing } from "@/lib/motionVariants";
import { useBoutiques } from "@/features/boutiques/query/boutiques-queries";
import {
  useCreateBoutique,
  useDeleteBoutique,
  useUpdateBoutique,
} from "@/features/boutiques/mutation/boutiques-mutations";
import type { Boutique } from "@/types";

const schema = z.object({
  nom: z.string().min(1, "Requis"),
  adresse: z.string().optional(),
  ville: z.string().optional(),
  whatsapp: z.string().optional(),
});
type FormData = z.infer<typeof schema>;

export function BoutiquesView() {
  const { data: res, isLoading } = useBoutiques();
  const boutiques = res?.data ?? [];
  const createMutation = useCreateBoutique();
  const updateMutation = useUpdateBoutique();
  const deleteMutation = useDeleteBoutique();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<Boutique | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Boutique | null>(null);
  const reduced = useReducedMotion();

  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  function openCreate() {
    setEditing(null);
    reset({ nom: "", adresse: "", ville: "", whatsapp: "" });
    onOpen();
  }

  function openEdit(b: Boutique) {
    setEditing(b);
    reset({ nom: b.nom, adresse: b.adresse ?? "", ville: b.ville ?? "", whatsapp: b.whatsapp ?? "" });
    onOpen();
  }

  const onSubmit = handleSubmit(async (data) => {
    if (editing) {
      await updateMutation.mutateAsync({ id: editing.id, body: data });
    } else {
      await createMutation.mutateAsync(data);
    }
    onClose();
  });

  return (
    <PageWrapper>
      <PageHero
        tone="accent"
        icon={IconBuildingStore}
        eyebrow="Administration"
        title="Boutiques"
        description="Les points de vente : adresse, ville et numéro WhatsApp utilisé pour les commandes de la vitrine."
        actions={
          <Button
            className="min-h-11 bg-accent font-semibold text-on-accent"
            startContent={<IconPlus size={18} aria-hidden />}
            onPress={openCreate}
          >
            Nouvelle boutique
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <StatTile tone="accent" icon={IconBuildingStore} label="Boutiques" value={isLoading ? "—" : <CountUp value={boutiques.length} />} />
          <StatTile
            tone="in"
            icon={IconBrandWhatsapp}
            label="Avec WhatsApp"
            value={isLoading ? "—" : <CountUp value={boutiques.filter((b) => !!b.whatsapp).length} />}
            delay={0.05}
          />
        </div>
      </PageHero>

      {isLoading && (
        <div role="status" aria-label="Chargement des boutiques" className="grid gap-3 sm:grid-cols-2">
          {[...Array(2)].map((_, i) => (
            <div key={i} className="h-36 animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && boutiques.length === 0 && (
        <EmptyRiver
          message="Aucune boutique"
          hint="Créez une boutique pour y rattacher le stock, la caisse et l'équipe."
          action={
            <Button size="sm" className="bg-accent font-semibold text-on-accent" onPress={openCreate}>
              Créer une boutique
            </Button>
          }
        />
      )}

      {boutiques.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2">
          {boutiques.map((b, i) => (
            <motion.li
              key={b.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: motionEasing.outExpo, delay: Math.min(i * 0.05, 0.25) }}
            >
              <SpotlightCard tone="accent" className="p-4">
                <div className="flex items-start gap-3">
                  <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-accent-dim text-accent-text">
                    <IconBuildingStore size={22} aria-hidden />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate font-display text-lg font-bold text-text">{b.nom}</p>
                    <dl className="mt-1.5 space-y-1 text-sm text-text-muted">
                      <div className="flex items-center gap-1.5">
                        <dt className="sr-only">Adresse</dt>
                        <IconMapPin size={14} aria-hidden className="shrink-0" />
                        <dd className="truncate">{[b.adresse, b.ville].filter(Boolean).join(", ") || "Adresse non renseignée"}</dd>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <dt className="sr-only">WhatsApp</dt>
                        <IconBrandWhatsapp size={14} aria-hidden className="shrink-0" />
                        <dd className="truncate font-mono text-xs">{b.whatsapp ?? "Non renseigné"}</dd>
                      </div>
                    </dl>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="flat" className="min-h-9 flex-1 font-medium" startContent={<IconPencil size={15} aria-hidden />} onPress={() => openEdit(b)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    className="min-h-9 flex-1 font-medium"
                    startContent={<IconTrash size={15} aria-hidden />}
                    onPress={() => setDeleteTarget(b)}
                  >
                    Supprimer
                  </Button>
                </div>
              </SpotlightCard>
            </motion.li>
          ))}
        </ul>
      )}

      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget && !deleteMutation.isPending) {
            deleteMutation.mutate(deleteTarget.id, { onSuccess: () => setDeleteTarget(null) });
          }
        }}
        title="Supprimer la boutique"
        message={`Supprimer « ${deleteTarget?.nom ?? ""} » ? Son stock, ses ventes et ses comptes rattachés peuvent être affectés.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        danger
      />

      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          <ModalHeader>{editing ? "Modifier la boutique" : "Nouvelle boutique"}</ModalHeader>
          <ModalBody>
            <div className="flex flex-col gap-3">
              <Input label="Nom" variant="bordered" isInvalid={!!errors.nom} errorMessage={errors.nom?.message} {...register("nom")} />
              <Input label="Ville" variant="bordered" {...register("ville")} />
              <Input label="Adresse" variant="bordered" {...register("adresse")} />
              <Input label="WhatsApp" variant="bordered" placeholder="+221 77 000 00 00" {...register("whatsapp")} />
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="light" onPress={onClose}>Annuler</Button>
            <Button
              className="bg-accent font-semibold text-on-accent"
              isLoading={createMutation.isPending || updateMutation.isPending}
              onPress={() => void onSubmit()}
            >
              {editing ? "Enregistrer" : "Créer"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
}
