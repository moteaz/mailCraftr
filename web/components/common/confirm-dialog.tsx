import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';
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
  confirmText = 'Delete',
  confirmIcon,
  loading = false,
}: ConfirmDialogProps) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="sm">
      <p className="text-gray-600 mb-6">{message}</p>
      <div className="flex gap-3">
        <Button onClick={onClose} variant="secondary" className="flex-1" disabled={loading}>
          Cancel
        </Button>
        <Button
          onClick={onConfirm}
          variant="danger"
          loading={loading}
          loadingText={`${confirmText}...`}
          icon={confirmIcon}
          className="flex-1"
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
}
