import { Button } from '@/components/ui/button';
import { Modal } from './Modal';
import type { LucideIcon } from 'lucide-react';

interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  confirmIcon?: LucideIcon;
  loading?: boolean;
}

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  confirmIcon,
  loading,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title}>
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3">
        <Button onClick={onClose} variant="secondary" className="flex-1" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="danger"
          loading={loading}
          icon={confirmIcon}
          className="flex-1"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
