import { toast } from 'sonner';

export const webhookListener = {
  start: (userRole: string) => {
    if (userRole !== 'SUPERADMIN') return;

    const eventSource = new EventSource(`${process.env.NEXT_PUBLIC_API_URL}/webhooks/events`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      toast.info(`🔔 ${data.event}`, {
        description: `Event triggered at ${new Date(data.timestamp).toLocaleTimeString()}`,
      });
    };

    return () => eventSource.close();
  },
};
