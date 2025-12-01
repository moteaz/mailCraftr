import { Trash2, Power, PowerOff } from 'lucide-react';
import type { Webhook } from '@/types';

interface WebhookCardProps {
  webhook: Webhook;
  onDelete: (id: number) => void;
  onToggle: (id: number, active: boolean) => void;
}

export function WebhookCard({ webhook, onDelete, onToggle }: WebhookCardProps) {
  return (
    <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 border border-gray-200 hover:shadow-lg transition-all">
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <h3 className="text-base sm:text-lg font-semibold text-gray-900 truncate">
              {new URL(webhook.url).hostname}
            </h3>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              webhook.active 
                ? 'bg-green-100 text-green-700' 
                : 'bg-gray-100 text-gray-700'
            }`}>
              {webhook.active ? 'Active' : 'Inactive'}
            </span>
          </div>
          <p className="text-xs sm:text-sm text-gray-600 break-all">{webhook.url}</p>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs sm:text-sm font-medium text-gray-700 mb-2">
          Events ({webhook.events.length})
        </p>
        <div className="flex flex-wrap gap-2">
          {webhook.events.map((event) => (
            <span
              key={event}
              className="px-2 py-1 bg-blue-50 text-blue-700 rounded-md text-xs font-medium"
            >
              {event}
            </span>
          ))}
        </div>
      </div>

      <div className="flex gap-2">
        <button
          onClick={() => onToggle(webhook.id, !webhook.active)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-100 hover:bg-gray-200 text-gray-900 rounded-lg font-medium transition-colors text-sm min-h-[44px]"
        >
          {webhook.active ? (
            <>
              <PowerOff className="w-4 h-4" />
              <span>Disable</span>
            </>
          ) : (
            <>
              <Power className="w-4 h-4" />
              <span>Enable</span>
            </>
          )}
        </button>
        <button
          onClick={() => onDelete(webhook.id)}
          className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-lg font-medium transition-colors text-sm min-h-[44px]"
        >
          <Trash2 className="w-4 h-4" />
          <span>Delete</span>
        </button>
      </div>
    </div>
  );
}
