import { useState } from 'react';
import { Modal } from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Webhook, WEBHOOK_EVENTS } from '@/types';

interface CreateWebhookModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (data: { url: string; events: string[]; secret?: string }) => Promise<void>;
}

export function CreateWebhookModal({ isOpen, onClose, onCreate }: CreateWebhookModalProps) {
  const [url, setUrl] = useState('');
  const [secret, setSecret] = useState('');
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const allEvents = Object.values(WEBHOOK_EVENTS);

  const toggleEvent = (event: string) => {
    setSelectedEvents((prev) =>
      prev.includes(event) ? prev.filter((e) => e !== event) : [...prev, event]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url || selectedEvents.length === 0) return;

    setLoading(true);
    try {
      await onCreate({ url, events: selectedEvents, secret: secret || undefined });
      setUrl('');
      setSecret('');
      setSelectedEvents([]);
      onClose();
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Create Webhook">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Webhook URL"
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="https://your-system.com/webhook"
          required
        />

        <Input
          label="Secret (Optional)"
          type="text"
          value={secret}
          onChange={(e) => setSecret(e.target.value)}
          placeholder="For signature verification"
        />

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select Events ({selectedEvents.length})
          </label>
          <div className="max-h-60 overflow-y-auto border border-gray-300 rounded-lg p-3 space-y-2">
            {allEvents.map((event) => (
              <label
                key={event}
                className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedEvents.includes(event)}
                  onChange={() => toggleEvent(event)}
                  className="w-4 h-4 text-blue-600 rounded"
                />
                <span className="text-sm text-gray-700">{event}</span>
              </label>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button type="button" onClick={onClose} variant="secondary" className="flex-1">
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
            disabled={!url || selectedEvents.length === 0}
            className="flex-1"
          >
            Create Webhook
          </Button>
        </div>
      </form>
    </Modal>
  );
}
