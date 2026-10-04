"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { IconPhoto, IconPlus } from "@tabler/icons-react";
import { EmptyRiver } from "@/components/common/EmptyRiver";
import { PageHero } from "@/components/common/PageHero";
import { PageWrapper } from "@/components/common/PageWrapper";
import { SegmentedControl } from "@/components/common/SegmentedControl";
import {
  Button,
  Chip,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure,
} from "@heroui/react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { readFileAsDataUrl } from "@/lib/files";
import { useAdminLookbookPhotos } from "@/features/lookbook-photos/query/lookbook-photos-queries";
import {
  useDeleteLookbookPhoto,
  useUpdateLookbookPhotoPubliee,
  useUpdateLookbookPhotoStatut,
  useUploadLookbookPhoto,
} from "@/features/lookbook-photos/mutation/lookbook-photos-mutations";
import type { LookbookPhoto, LookbookPhotoStatut } from "@/types";

const MAX_SIZE_BYTES = 5 * 1024 * 1024;

const uploadSchema = z.object({
  nom: z.string().optional(),
  telephone: z.string().optional(),
  message: z.string().optional(),
});
type UploadFormData = z.infer<typeof uploadSchema>;

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
  const updatePubliee = useUpdateLookbookPhotoPubliee();
  const deleteMutation = useDeleteLookbookPhoto();
  const uploadMutation = useUploadLookbookPhoto();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selected, setSelected] = useState<LookbookPhoto | null>(null);

  const { isOpen: isAddOpen, onOpen: onAddOpen, onClose: onAddClose } = useDisclosure();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [addFile, setAddFile] = useState<File | null>(null);
  const [addPreview, setAddPreview] = useState<string | null>(null);
  const [addFileError, setAddFileError] = useState<string | null>(null);
  const { register: registerAdd, handleSubmit: handleAddSubmit, reset: resetAddForm } =
    useForm<UploadFormData>({ resolver: zodResolver(uploadSchema) });

  function openPhoto(photo: LookbookPhoto) {
    setSelected(photo);
    onOpen();
    if (photo.statut === "nouveau") {
      updateStatut.mutate({ id: photo.id, statut: "vu" });
    }
  }

  function handleAddFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0] ?? null;
    setAddFileError(null);
    if (!file) {
      setAddFile(null);
      setAddPreview(null);
      return;
    }
    if (!file.type.startsWith("image/")) {
      setAddFileError("Le fichier doit être une image.");
      return;
    }
    if (file.size > MAX_SIZE_BYTES) {
      setAddFileError("La photo est trop lourde (max 5 Mo).");
      return;
    }
    setAddFile(file);
    setAddPreview(URL.createObjectURL(file));
  }

  function closeAddModal() {
    setAddFile(null);
    setAddPreview(null);
    setAddFileError(null);
    resetAddForm();
    if (fileInputRef.current) fileInputRef.current.value = "";
    onAddClose();
  }

  const onAddSubmit = handleAddSubmit(async (values) => {
    if (!addFile) {
      setAddFileError("Ajoute d'abord une photo.");
      return;
    }
    const dataUrl = await readFileAsDataUrl(addFile);
    await uploadMutation.mutateAsync({
      photo: dataUrl,
      nom: values.nom || undefined,
      telephone: values.telephone || undefined,
      message: values.message || undefined,
    });
    closeAddModal();
  });

  return (
    <PageWrapper>
      <PageHero
        tone="cash"
        icon={IconPhoto}
        eyebrow="Lookbook"
        title="Photos clients"
        description="Les photos envoyées par vos clients : triez-les, puis publiez les meilleures sur le lookbook de la vitrine."
        actions={
          <Button
            className="min-h-11 bg-cash font-semibold text-white"
            startContent={<IconPlus size={18} aria-hidden />}
            onPress={onAddOpen}
          >
            Ajouter une photo
          </Button>
        }
      >
        <SegmentedControl
          ariaLabel="Filtrer les photos par statut"
          tone="cash"
          value={filtre}
          onChange={setFiltre}
          options={[
            { key: "all", label: "Toutes" },
            { key: "nouveau", label: "Nouvelles" },
            { key: "vu", label: "Vues" },
            { key: "traite", label: "Traitées" },
          ]}
        />
      </PageHero>

      {isLoading && (
        <div role="status" aria-label="Chargement des photos" className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="aspect-square animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && photos.length === 0 && (
        <EmptyRiver message="Aucune photo pour le moment" hint="Les photos envoyées depuis le lookbook de la vitrine arrivent ici." />
      )}

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
        {photos.map((photo) => (
          <button
            key={photo.id}
            onClick={() => openPhoto(photo)}
            className="group relative cursor-pointer overflow-hidden rounded-lg border border-border bg-surface text-left shadow-card transition-[border-color,transform] duration-200 hover:-translate-y-0.5 hover:border-cash focus-visible:outline focus-visible:outline-2 focus-visible:outline-cash"
          >
            <div className="relative aspect-square w-full">
              <Image
                src={photo.url}
                alt={photo.nom ?? "Photo client"}
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              {photo.publiee && (
                <span className="absolute right-2 top-2 rounded-full bg-accent px-2 py-0.5 text-[10px] font-bold text-on-accent">
                  Publiée
                </span>
              )}
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

      <Modal isOpen={isOpen} onClose={onClose} size="2xl" backdrop="blur">
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
                      color={selected.publiee ? "default" : "primary"}
                      isLoading={updatePubliee.isPending}
                      onPress={() =>
                        updatePubliee.mutate({ id: selected.id, publiee: !selected.publiee })
                      }
                    >
                      {selected.publiee ? "Retirer du site" : "Publier sur le site"}
                    </Button>
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

      <Modal isOpen={isAddOpen} onClose={closeAddModal}>
        <ModalContent>
          <ModalHeader>Ajouter une photo client</ModalHeader>
          <form onSubmit={onAddSubmit}>
            <ModalBody>
              <div className="flex flex-col gap-3">
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleAddFileChange}
                  className="hidden"
                  id="admin-add-photo-input"
                />
                <label
                  htmlFor="admin-add-photo-input"
                  className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-border px-4 py-6 text-center transition-colors hover:border-accent"
                >
                  {addPreview ? (
                    <Image
                      src={addPreview}
                      alt="Aperçu"
                      width={140}
                      height={140}
                      unoptimized
                      className="h-32 w-32 rounded-lg object-cover"
                    />
                  ) : (
                    <>
                      <span className="text-2xl">📷</span>
                      <span className="text-sm font-semibold text-text">Choisir une photo</span>
                      <span className="text-xs text-text-muted">JPG, PNG — 5 Mo max</span>
                    </>
                  )}
                </label>
                {addFileError && (
                  <p className="text-xs" style={{ color: "var(--v-red)" }}>{addFileError}</p>
                )}

                <input
                  {...registerAdd("nom")}
                  placeholder="Nom du client (optionnel)"
                  className="w-full rounded-xl border border-border bg-transparent px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-accent"
                />
                <input
                  {...registerAdd("telephone")}
                  type="tel"
                  placeholder="Téléphone / WhatsApp (optionnel)"
                  className="w-full rounded-xl border border-border bg-transparent px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-accent"
                />
                <textarea
                  {...registerAdd("message")}
                  placeholder="Message ou contexte (optionnel)"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-border bg-transparent px-3 py-2.5 text-sm text-text outline-none transition-colors focus:border-accent"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              <Button variant="light" onPress={closeAddModal} type="button">
                Annuler
              </Button>
              <Button
                className="bg-accent text-on-accent"
                type="submit"
                isLoading={uploadMutation.isPending}
              >
                Ajouter
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
}
