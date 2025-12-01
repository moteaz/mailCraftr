import { X, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface DeleteTemplateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => Promise<void>;
  deleting: boolean;
}

export function DeleteTemplateModal({ isOpen, onClose, onConfirm, deleting }: DeleteTemplateModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-3">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full p-4 sm:p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Delete Template</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <p className="text-gray-600 mb-6">
          Are you sure you want to delete this template? This action cannot be undone.
        </p>

        <div className="flex flex-col sm:flex-row gap-3">
          <Button
            onClick={onClose}
            variant="secondary"
            className="flex-1"
            disabled={deleting}
          >
            Cancel
          </Button>
          <Button
            onClick={onConfirm}
            variant="danger"
            loading={deleting}
            loadingText="Deleting..."
            icon={Trash2}
            className="flex-1"
          >
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
