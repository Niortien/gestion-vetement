"use client";

import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader } from "@heroui/react";

interface CaisseCloseModalProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function CaisseCloseModal({ isOpen, onOpenChange, onConfirm }: CaisseCloseModalProps) {
  return (
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent className="rounded-[24px] border border-border bg-surface">
        <ModalHeader>Cloturer la session</ModalHeader>
        <ModalBody>
          <p className="text-sm text-text-muted">Cette action est irreversible.</p>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" onPress={onConfirm}>
            Cloturer definitivement
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
}
