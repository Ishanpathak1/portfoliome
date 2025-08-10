'use client';

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AppNotification } from './NotificationTypes';

declare global {
  interface Window {
    __notify?: (notification: Partial<AppNotification>) => void;
    __notifyMany?: (notifications: Partial<AppNotification>[]) => void;
  }
}

interface NotificationContextValue {
  notifications: AppNotification[];
  unreadCount: number;
  addNotifications: (items: AppNotification[]) => void;
  addNotification: (item: AppNotification) => void;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  removeNotification: (id: string) => void;
  removeByDedupeKey: (dedupeKey: string) => void;
}

const NotificationContext = createContext<NotificationContextValue | undefined>(undefined);

function getStorageKey(): string {
  return 'portfolio.notifications.v1';
}

function getReadKey(): string {
  return 'portfolio.notifications.readIds.v1';
}

function loadFromStorage(): AppNotification[] {
  try {
    const raw = typeof window !== 'undefined' ? window.localStorage.getItem(getStorageKey()) : null;
    if (!raw) return [];
    const parsed = JSON.parse(raw) as AppNotification[];
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveToStorage(notifications: AppNotification[]): void {
  try {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem(getStorageKey(), JSON.stringify(notifications));
    }
  } catch {
    // ignore
  }
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [readIds, setReadIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    setNotifications(loadFromStorage());
    try {
      const raw = typeof window !== 'undefined' ? window.localStorage.getItem(getReadKey()) : null;
      if (raw) setReadIds(new Set(JSON.parse(raw)));
    } catch {}
  }, []);

  useEffect(() => {
    saveToStorage(notifications);
  }, [notifications]);

  useEffect(() => {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(getReadKey(), JSON.stringify(Array.from(readIds)));
      }
    } catch {}
  }, [readIds]);

  // Preload announcements (with Authorization if available)
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const authHeader = (window as any)?.firebaseAuthToken
          ? { Authorization: `Bearer ${(window as any).firebaseAuthToken}` }
          : undefined;
        const res = await fetch('/api/notifications', { headers: { ...(authHeader || {}) } });
        if (!res.ok) return;
        const data = await res.json();
        const announcements = (data?.announcements || []) as any[];
        if (cancelled || announcements.length === 0) return;
        const items: AppNotification[] = announcements.map(a => ({
          id: a.id,
          kind: 'announcement',
          title: a.title,
          message: a.message,
          createdAt: a.createdAt || Date.now(),
          read: readIds.has(a.id) ? true : !!a.read,
        }));
        setNotifications(prev => {
          const incomingById = new Map(items.map(n => [n.id, n]));
          const updated = prev.map(n => {
            const inc = incomingById.get(n.id);
            if (inc) {
              // Merge server read state; once read anywhere, keep it read
              return { ...n, ...inc, read: n.read || inc.read };
            }
            return n;
          });
          const existingIds = new Set(prev.map(n => n.id));
          const toAdd = items.filter(n => !existingIds.has(n.id));
          return toAdd.length > 0 ? [...toAdd, ...updated] : updated;
        });
      } catch {
        // ignore
      }
    })();
    return () => { cancelled = true; };
  }, [readIds]);

  const addNotification = useCallback((item: AppNotification) => {
    setNotifications(prev => {
      // dedupe by id or dedupeKey if present
      const exists = prev.some(n => n.id === item.id || (!!item.dedupeKey && n.dedupeKey === item.dedupeKey));
      if (exists) {
        // Merge while preserving read state (once read, stay read)
        return prev.map(n => {
          if (n.id === item.id || (!!item.dedupeKey && n.dedupeKey === item.dedupeKey)) {
            return {
              ...n,
              ...item,
              read: n.read || item.read || false,
              createdAt: item.createdAt ?? n.createdAt,
            };
          }
          return n;
        });
      }
      return [{ ...item, createdAt: item.createdAt || Date.now() }, ...prev].slice(0, 100);
    });
  }, []);

  const addNotifications = useCallback((items: AppNotification[]) => {
    items.forEach(addNotification);
  }, [addNotification]);

  const markAsRead = useCallback(async (id: string) => {
    setNotifications(prev => prev.map(n => (n.id === id ? { ...n, read: true } : n)));
    setReadIds(prev => new Set(prev).add(id));
    try {
      const authHeader = (window as any)?.firebaseAuthToken
        ? { Authorization: `Bearer ${(window as any).firebaseAuthToken}` }
        : undefined;
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(authHeader || {}) },
        body: JSON.stringify({ ids: [id] }),
      });
    } catch {}
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setReadIds(prev => {
      const next = new Set(prev);
      notifications.forEach(n => next.add(n.id));
      return next;
    });
    try {
      const ids = notifications.map(n => n.id);
      const authHeader = (window as any)?.firebaseAuthToken
        ? { Authorization: `Bearer ${(window as any).firebaseAuthToken}` }
        : undefined;
      await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(authHeader || {}) },
        body: JSON.stringify({ ids }),
      });
    } catch {}
  }, [notifications]);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
    setReadIds(prev => new Set(prev).add(id));
  }, []);

  const removeByDedupeKey = useCallback((dedupeKey: string) => {
    setNotifications(prev => prev.filter(n => n.dedupeKey !== dedupeKey));
  }, []);

  const unreadCount = useMemo(() => notifications.filter(n => !n.read).length, [notifications]);

  const value: NotificationContextValue = useMemo(() => ({
    notifications,
    unreadCount,
    addNotifications,
    addNotification,
    markAsRead,
    markAllAsRead,
    removeNotification,
    removeByDedupeKey,
  }), [notifications, unreadCount, addNotifications, addNotification, markAsRead, markAllAsRead, removeNotification, removeByDedupeKey]);

  // Expose developer helpers in the browser console
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.__notify = (notification: Partial<AppNotification>) => {
      const id = notification.id || Math.random().toString(36).slice(2);
      const item: AppNotification = {
        id,
        kind: (notification.kind as any) || 'announcement',
        title: notification.title || 'Notification',
        message: notification.message,
        createdAt: notification.createdAt || Date.now(),
        read: readIds.has(id) ? true : false,
        action: notification.action,
        dedupeKey: notification.dedupeKey,
      };
      addNotification(item);
    };
    window.__notifyMany = (arr: Partial<AppNotification>[]) => {
      arr.forEach(n => window.__notify?.(n));
    };
    return () => {
      delete window.__notify;
      delete window.__notifyMany;
    };
  }, [addNotification, readIds]);

  return (
    <NotificationContext.Provider value={value}>{children}</NotificationContext.Provider>
  );
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
}

