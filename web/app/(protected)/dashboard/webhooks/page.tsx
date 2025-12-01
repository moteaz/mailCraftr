'use client';

import { useState } from 'react';
import { Webhook, Plus } from 'lucide-react';
import { PageHeader } from '@/components/common/page-header';
import { SearchBar } from '@/components/common/search-bar';
import { EmptyState } from '@/components/common/empty-state';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';
import { ConfirmDialog } from '@/components/common/confirm-dialog';
import { useWebhooks } from '@/features/webhooks/hooks/useWebhooks';
import { WebhookCard } from '@/features/webhooks/components/WebhookCard';
import { CreateWebhookModal } from '@/features/webhooks/components/CreateWebhookModal';
import { useSearch } from '@/hooks/use-search';

export default function WebhooksPage() {
  const { webhooks, loading, createWebhook, updateWebhook, deleteWebhook } = useWebhooks();
  const { query, setQuery, filtered } = useSearch(webhooks, 'url');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    if (!deleteId) return;
    setIsDeleting(true);
    try {
      await deleteWebhook(deleteId);
      setDeleteId(null);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleToggle = async (id: number, active: boolean) => {
    await updateWebhook(id, { active });
  };

  if (loading) return <Spinner />;

  return (
    <div className="space-y-6">
      <PageHeader
        icon={Webhook}
        title="Webhooks"
        description="Manage webhook integrations"
        iconGradient="from-purple-600 to-pink-600"
        action={
          <Button icon={Plus} onClick={() => setIsCreateModalOpen(true)}>
            Create Webhook
          </Button>
        }
      />

      {webhooks.length > 0 && (
        <SearchBar
          value={query}
          onChange={setQuery}
          placeholder="🔍 Search webhooks by URL..."
          resultCount={filtered.length}
          totalCount={webhooks.length}
        />
      )}

      {filtered.length === 0 ? (
        <EmptyState
          message={query ? 'No webhooks match your search' : 'Create your first webhook to get started'}
          icon={Webhook}
        />
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {filtered.map((webhook) => (
            <WebhookCard
              key={webhook.id}
              webhook={webhook}
              onDelete={setDeleteId}
              onToggle={handleToggle}
            />
          ))}
        </div>
      )}

      <CreateWebhookModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={createWebhook}
      />

      <ConfirmDialog
        isOpen={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={handleDelete}
        title="Delete Webhook"
        message="Are you sure you want to delete this webhook? This action cannot be undone."
        loading={isDeleting}
      />
    </div>
  );
}
