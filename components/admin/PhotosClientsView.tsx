"use client";

import { useState } from "react";
import Image from "next/image";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Tab,
  Tabs,
  useDisclosure,
} from "@heroui/react";
import { useAdminLookbookPhotos } from "@/features/lookbook-photos/query/lookbook-photos-queries";
import {
  useDeleteLookbookPhoto,
  useUpdateLookbookPhotoStatut,
} from "@/features/lookbook-photos/mutation/lookbook-photos-mutations";
import type { LookbookPhoto, LookbookPhotoStatut } from "@/types";

const STATUT_LABEL: Record<LookbookPhotoStatut, string> = {
  nouveau: "Nouveau",
  vu: "Vu",
  traite: "Traité",
};

const STATUT_COLOR: Record<LookbookPhotoStatut, "warning" | "primary" | "success"> = {
  nouveau: "warning",
  vu: "primary",
  traite: "success",
};

export function PhotosClientsView() {
  const [filtre, setFiltre] = useState<LookbookPhotoStatut | "all">("all");
  const { data: res, isLoading } = useAdminLookbookPhotos(
    filtre === "all" ? {} : { statut: filtre }
  );
  const photos = res?.data ?? [];

  const updateStatut = useUpdateLookbookPhotoStatut();
  const deleteMutation = useDeleteLookbookPhoto();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<LookbookPhoto | null>(null);

  function openPhoto(photo: LookbookPhoto) {
    setSelected(photo);
    onOpen();
    if (photo.statut === "nouveau") {
      updateStatut.mutate({ id: photo.id, statut: "vu" });
    }
  }

  return (
    <div className="p-6">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <h1 className="text-2xl font-bold text-text">Photos clients — Lookbook</h1>
        <Tabs
          selectedKey={filtre}
          onSelectionChange={(key) => setFiltre(key as LookbookPhotoStatut | "all")}
          size="sm"
        >
          <Tab key="all" title="Toutes" />
          <Tab key="nouveau" title="Nouvelles" />
          <Tab key="vu" title="Vues" />
          <Tab key="traite" title="Traitées" />
        </Tabs>
      </div>

      {isLoading && (
        <p className="text-sm text-text-muted">Chargement...</p>
      )}

      {!isLoading && photos.length === 0 && (
        <p className="text-sm text-text-muted">Aucune photo pour le moment.</p>
      )}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => openPhoto(photo)}
            className="group relative overflow-hidden rounded-xl border border-border bg-surface text-left"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={photo.url}
                alt={photo.nom ?? "Photo client"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
            </div>
            <div className="flex items-center justify-between gap-2 p-2">
              <span className="truncate text-xs font-medium text-text">
                {photo.nom ?? "Sans nom"}
              </span>
              <Chip size="sm" color={STATUT_COLOR[photo.statut]} variant="flat">
                {STATUT_LABEL[photo.statut]}
              </Chip>
            </div>
          </button>
        ))}
      </div>

      <Modal isOpen={isOpen} onClose={onClose} size="2xl">
        <ModalContent>
          <ModalHeader>{selected?.nom ?? "Photo client"}</ModalHeader>
          <ModalBody className="pb-6">
            {selected && (
              <div className="flex flex-col gap-4 sm:flex-row">
                <div className="relative aspect-square w-full shrink-0 overflow-hidden rounded-xl sm:w-64">
                  <Image
                    src={selected.url}
                    alt={selected.nom ?? "Photo client"}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-1 flex-col gap-3">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                      Téléphone
                    </p>
                    <p className="text-sm text-text">{selected.telephone ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                      Message
                    </p>
                    <p className="text-sm text-text">{selected.message ?? "—"}</p>
                  </div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-widest text-text-muted">
                      Reçue le
                    </p>
                    <p className="text-sm text-text">
                      {new Date(selected.createdAt).toLocaleString("fr-FR")}
                    </p>
                  </div>

                  <div className="mt-auto flex flex-wrap gap-2">
                    {selected.telephone && (
                      <Button
                        size="sm"
                        className="bg-[#25D366] text-black"
                        as="a"
                        href={`https://wa.me/${selected.telephone.replace(/\D/g, "")}`}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        Contacter sur WhatsApp
                      </Button>
                    )}
                    {selected.statut !== "traite" && (
                      <Button
                        size="sm"
                        variant="flat"
                        color="success"
                        isLoading={updateStatut.isPending}
                        onPress={() => updateStatut.mutate({ id: selected.id, statut: "traite" })}
                      >
                        Marquer traité
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="flat"
                      color="danger"
                      isLoading={deleteMutation.isPending}
                      onPress={() => {
                        deleteMutation.mutate(selected.id);
                        onClose();
                      }}
                    >
                      Supprimer
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </div>
  );
}
