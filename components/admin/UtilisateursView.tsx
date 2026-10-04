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
  Select,
  SelectItem,
  useDisclosure,
} from "@heroui/react";
import { motion } from "framer-motion";
import {
  IconBuildingStore,
  IconCashRegister,
  IconPencil,
  IconShieldCheck,
  IconTrash,
  IconUserPlus,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useForm, Controller } from "react-hook-form";
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
import { useUsers } from "@/features/users/query/users-queries";
import {
  useCreateUser,
  useDeleteUser,
  useUpdateUser,
} from "@/features/users/mutation/users-mutations";
import { useBoutiques } from "@/features/boutiques/query/boutiques-queries";
import type { AppUser } from "@/features/users/api/users-api";

const createSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "6 caractères minimum"),
  role: z.enum(["ADMIN", "VENDEUR"]),
  boutiqueId: z.string().nullable().optional(),
});

const updateSchema = z.object({
  email: z.string().email("Email invalide").optional(),
  password: z.string().min(6).optional().or(z.literal("")),
  role: z.enum(["ADMIN", "VENDEUR"]).optional(),
  boutiqueId: z.string().nullable().optional(),
});

type CreateFormData = z.infer<typeof createSchema>;
type UpdateFormData = z.infer<typeof updateSchema>;

export function UtilisateursView() {
  const { data: usersRes, isLoading } = useUsers();
  const users = usersRes?.data ?? [];
  const { data: boutiquesRes } = useBoutiques();
  const boutiques = boutiquesRes?.data ?? [];

  const createMutation = useCreateUser();
  const updateMutation = useUpdateUser();
  const deleteMutation = useDeleteUser();

  const { isOpen, onOpen, onClose } = useDisclosure();
  const [editing, setEditing] = useState<AppUser | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<AppUser | null>(null);
  const reduced = useReducedMotion();

  const createForm = useForm<CreateFormData>({ resolver: zodResolver(createSchema) });
  const updateForm = useForm<UpdateFormData>({ resolver: zodResolver(updateSchema) });

  function openCreate() {
    setEditing(null);
    createForm.reset({ email: "", password: "", role: "VENDEUR", boutiqueId: null });
    onOpen();
  }

  function openEdit(u: AppUser) {
    setEditing(u);
    updateForm.reset({ email: u.email, password: "", role: u.role, boutiqueId: u.boutiqueId });
    onOpen();
  }

  const onSubmitCreate = createForm.handleSubmit(async (data) => {
    await createMutation.mutateAsync({
      ...data,
      boutiqueId: data.boutiqueId || null,
    });
    onClose();
  });

  const onSubmitUpdate = updateForm.handleSubmit(async (data) => {
    if (!editing) return;
    const body = {
      ...(data.email ? { email: data.email } : {}),
      ...(data.password ? { password: data.password } : {}),
      ...(data.role ? { role: data.role } : {}),
      boutiqueId: data.boutiqueId || null,
    };
    await updateMutation.mutateAsync({ id: editing.id, body });
    onClose();
  });

  const admins = users.filter((u) => u.role === "ADMIN").length;

  return (
    <PageWrapper>
      <PageHero
        tone="accent"
        icon={IconUsersGroup}
        eyebrow="Administration"
        title="Utilisateurs"
        description="Comptes administrateurs et vendeurs, rattachés chacun à une boutique."
        actions={
          <Button
            className="min-h-11 bg-accent font-semibold text-on-accent"
            startContent={<IconUserPlus size={18} aria-hidden />}
            onPress={openCreate}
          >
            Nouvel utilisateur
          </Button>
        }
      >
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          <StatTile tone="accent" icon={IconUsersGroup} label="Utilisateurs" value={isLoading ? "—" : <CountUp value={users.length} />} />
          <StatTile tone="cash" icon={IconShieldCheck} label="Administrateurs" value={isLoading ? "—" : <CountUp value={admins} />} delay={0.05} />
          <StatTile tone="in" icon={IconCashRegister} label="Vendeurs" value={isLoading ? "—" : <CountUp value={users.length - admins} />} delay={0.1} />
        </div>
      </PageHero>

      {isLoading && (
        <div role="status" aria-label="Chargement des utilisateurs" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 animate-pulse rounded-lg border border-border bg-surface" />
          ))}
        </div>
      )}

      {!isLoading && users.length === 0 && (
        <EmptyRiver
          message="Aucun utilisateur"
          hint="Créez un compte pour donner accès à la caisse ou à l'administration."
          action={
            <Button size="sm" className="bg-accent font-semibold text-on-accent" onPress={openCreate}>
              Ajouter un utilisateur
            </Button>
          }
        />
      )}

      {users.length > 0 && (
        <ul className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {users.map((u, i) => (
            <motion.li
              key={u.id}
              initial={reduced ? false : { opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.38, ease: motionEasing.outExpo, delay: Math.min(i * 0.04, 0.24) }}
            >
              <SpotlightCard tone={u.role === "ADMIN" ? "cash" : "accent"} className="p-4">
                <div className="flex items-start gap-3">
                  <span
                    aria-hidden
                    className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--tone)_16%,transparent)] font-display text-lg font-extrabold uppercase text-[var(--tone-text)]"
                  >
                    {u.email.charAt(0)}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-text">{u.email}</p>
                    <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-text-muted">
                      <IconBuildingStore size={12} aria-hidden className="shrink-0" />
                      {u.boutique?.nom ?? "Aucune boutique"}
                    </p>
                    <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[color-mix(in_srgb,var(--tone)_14%,transparent)] px-2 py-0.5 text-xs font-semibold text-[var(--tone-text)]">
                      {u.role === "ADMIN" ? <IconShieldCheck size={12} aria-hidden /> : <IconCashRegister size={12} aria-hidden />}
                      {u.role === "ADMIN" ? "Administrateur" : "Vendeur"}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex items-center gap-2 border-t border-border pt-3">
                  <Button size="sm" variant="flat" className="min-h-9 flex-1 font-medium" startContent={<IconPencil size={15} aria-hidden />} onPress={() => openEdit(u)}>
                    Modifier
                  </Button>
                  <Button
                    size="sm"
                    variant="flat"
                    color="danger"
                    className="min-h-9 flex-1 font-medium"
                    startContent={<IconTrash size={15} aria-hidden />}
                    onPress={() => setDeleteTarget(u)}
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
        title="Supprimer l'utilisateur"
        message={`${deleteTarget?.email ?? "Ce compte"} ne pourra plus se connecter. Cette action est définitive.`}
        confirmLabel="Supprimer"
        isLoading={deleteMutation.isPending}
        danger
      />

      <Modal isOpen={isOpen} onClose={onClose} size="md" backdrop="blur">
        <ModalContent>
          {editing ? (
            <>
              <ModalHeader>Modifier l&apos;utilisateur</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <Input label="Email" variant="bordered" isInvalid={!!updateForm.formState.errors.email} errorMessage={updateForm.formState.errors.email?.message} {...updateForm.register("email")} />
                  <Input label="Nouveau mot de passe" type="password" variant="bordered" placeholder="Laisser vide pour ne pas changer" {...updateForm.register("password")} />
                  <Controller
                    name="role"
                    control={updateForm.control}
                    render={({ field }) => (
                      <Select label="Rôle" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}>
                        <SelectItem key="ADMIN">ADMIN</SelectItem>
                        <SelectItem key="VENDEUR">VENDEUR</SelectItem>
                      </Select>
                    )}
                  />
                  <Controller
                    name="boutiqueId"
                    control={updateForm.control}
                    render={({ field }) => (
                      <Select label="Boutique" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] ?? null)}>
                        <>
                          <SelectItem key="">Aucune boutique</SelectItem>
                          {boutiques.map((b) => (
                            <SelectItem key={b.id}>{b.nom}</SelectItem>
                          ))}
                        </>
                      </Select>
                    )}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Annuler</Button>
                <Button className="bg-accent font-semibold text-on-accent" isLoading={updateMutation.isPending} onPress={() => void onSubmitUpdate()}>
                  Enregistrer
                </Button>
              </ModalFooter>
            </>
          ) : (
            <>
              <ModalHeader>Nouvel utilisateur</ModalHeader>
              <ModalBody>
                <div className="flex flex-col gap-3">
                  <Input label="Email" variant="bordered" isInvalid={!!createForm.formState.errors.email} errorMessage={createForm.formState.errors.email?.message} {...createForm.register("email")} />
                  <Input label="Mot de passe" type="password" variant="bordered" isInvalid={!!createForm.formState.errors.password} errorMessage={createForm.formState.errors.password?.message} {...createForm.register("password")} />
                  <Controller
                    name="role"
                    control={createForm.control}
                    render={({ field }) => (
                      <Select label="Rôle" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0])}>
                        <SelectItem key="ADMIN">ADMIN</SelectItem>
                        <SelectItem key="VENDEUR">VENDEUR</SelectItem>
                      </Select>
                    )}
                  />
                  <Controller
                    name="boutiqueId"
                    control={createForm.control}
                    render={({ field }) => (
                      <Select label="Boutique" variant="bordered" selectedKeys={field.value ? [field.value] : []} onSelectionChange={(keys) => field.onChange(Array.from(keys)[0] ?? null)}>
                        <>
                          <SelectItem key="">Aucune boutique</SelectItem>
                          {boutiques.map((b) => (
                            <SelectItem key={b.id}>{b.nom}</SelectItem>
                          ))}
                        </>
                      </Select>
                    )}
                  />
                </div>
              </ModalBody>
              <ModalFooter>
                <Button variant="light" onPress={onClose}>Annuler</Button>
                <Button className="bg-accent font-semibold text-on-accent" isLoading={createMutation.isPending} onPress={() => void onSubmitCreate()}>
                  Créer
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </PageWrapper>
  );
}
