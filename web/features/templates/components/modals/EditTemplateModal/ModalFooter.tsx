import { Edit2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ModalFooterProps {
  onCancel: () => void;
  onSave: () => Promise<void>;
  updating: boolean;
}

export function ModalFooter({ onCancel, onSave, updating }: ModalFooterProps) {
  return (
    <div className="border-t border-gray-200 bg-white px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between gap-3 flex-shrink-0">
      <div className="flex items-center gap-2 text-xs text-gray-600">
        <div className="hidden sm:flex items-center gap-1.5">
          <div className="w-2 h-2 rounded-full bg-gray-400" />
          <span>Last saved: Just now</span>
        </div>
      </div>
      <div className="flex items-center gap-2 sm:gap-3 flex-1 sm:flex-initial justify-end">
        <Button
          onClick={onCancel}
          variant="secondary"
          className="flex-1 sm:flex-initial min-w-[100px]"
          disabled={updating}
        >
          Cancel
        </Button>
        <Button
          onClick={onSave}
          loading={updating}
          loadingText="Saving..."
          icon={Edit2}
          className="flex-1 sm:flex-initial min-w-[120px] bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 hover:from-orange-600 hover:via-red-600 hover:to-pink-600"
        >
          Save Changes
        </Button>
      </div>
    </div>
  );
}
