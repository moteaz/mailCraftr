import { create } from 'zustand';

interface Notification {
  id: string;
  event: string;
  timestamp: string;
  data: any;
  read: boolean;
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (event: string, timestamp: string, data: any) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  unreadCount: () => number;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],

  addNotification: (event, timestamp, data) => {
    const notification: Notification = {
      id: `${Date.now()}-${Math.random()}`,
      event,
      timestamp,
      data,
      read: false,
    };
    set((state) => ({
      notifications: [notification, ...state.notifications].slice(0, 50), // Keep last 50
    }));
  },

  markAsRead: (id) => {
    set((state) => ({
      notifications: state.notifications.map((n) =>
        n.id === id ? { ...n, read: true } : n
      ),
    }));
  },

  markAllAsRead: () => {
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, read: true })),
    }));
  },

  clearAll: () => {
    set({ notifications: [] });
  },

  unreadCount: () => {
    return get().notifications.filter((n) => !n.read).length;
  },
}));
