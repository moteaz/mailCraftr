import { useEffect } from 'react';
import { useAuthStore } from '@/store/auth-store';
import { useNotificationStore } from '@/store/notification-store';
import { session } from '@/lib/auth/session';
import { toast } from 'sonner';
import { API_URL } from '@/constants';

export function useWebhookNotifications() {
  const { user } = useAuthStore();
  const addNotification = useNotificationStore((state) => state.addNotification);

  useEffect(() => {
    if (!user || user.role !== 'SUPERADMIN') {
      return;
    }

    const token = session.getToken();
    if (!token) {
      console.log('No token, skipping SSE');
      return;
    }

    const url = `${API_URL}/webhooks/events/stream?token=${token}`;
    
    const eventSource = new EventSource(url);

    eventSource.onopen = () => {
      console.log('✅ SSE Connected!');
      toast.success('Real-time notifications enabled');
    };

    eventSource.onmessage = (event) => {
      console.log('📨 SSE Message received:', event.data);
      const data = JSON.parse(event.data);
      
      // Add to notification store
      addNotification(data.event, data.timestamp, data.data);
      
      // Show toast
      toast.info(`🔔 ${data.event}`, {
        description: `Triggered at ${new Date(data.timestamp).toLocaleTimeString()}`,
        duration: 4000,
      });
    };

    eventSource.onerror = (error) => {
      console.error('❌ SSE Error:', error);
      // Don't close on error, let it reconnect automatically
    };

    return () => {
      console.log('Closing SSE connection');
      eventSource.close();
    };
  }, [user?.role]);
}
