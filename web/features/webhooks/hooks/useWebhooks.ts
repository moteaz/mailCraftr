import { useState, useEffect } from 'react';
import { webhookService } from '@/lib/services/webhook.service';
import { toast } from 'sonner';
import type { Webhook } from '@/types';

export function useWebhooks() {
  const [webhooks, setWebhooks] = useState<Webhook[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchWebhooks = async () => {
    try {
      setLoading(true);
      const data = await webhookService.getMyWebhooks();
      setWebhooks(data);
    } catch (error: any) {
      toast.error(error.message || 'Failed to load webhooks');
    } finally {
      setLoading(false);
    }
  };

  const createWebhook = async (data: { url: string; events: string[]; secret?: string }) => {
    try {
      const response = await webhookService.create(data);
      toast.success(response.message);
      await fetchWebhooks();
      return response.webhook;
    } catch (error: any) {
      toast.error(error.message || 'Failed to create webhook');
      throw error;
    }
  };

  const updateWebhook = async (id: number, data: { url?: string; events?: string[]; active?: boolean }) => {
    try {
      await webhookService.update(id, data);
      toast.success('Webhook updated successfully');
      await fetchWebhooks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update webhook');
      throw error;
    }
  };

  const deleteWebhook = async (id: number) => {
    try {
      await webhookService.delete(id);
      toast.success('Webhook deleted successfully');
      await fetchWebhooks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete webhook');
      throw error;
    }
  };

  useEffect(() => {
    fetchWebhooks();
  }, []);

  return {
    webhooks,
    loading,
    createWebhook,
    updateWebhook,
    deleteWebhook,
    refetch: fetchWebhooks,
  };
}
