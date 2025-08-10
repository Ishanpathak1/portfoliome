'use client';

import React, { useMemo, useState } from 'react';
import { Bell, Check, ChevronRight, Circle, X, AlertTriangle, Megaphone } from 'lucide-react';
import { useNotifications } from './NotificationStore';
import { AppNotification } from './NotificationTypes';
import Link from 'next/link';

interface NotificationBellProps {
  isDashboard?: boolean;
}

function formatWhen(ts: number): string {
  const delta = Date.now() - ts;
  const minutes = Math.floor(delta / 60000);
  if (minutes < 1) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

function buildDashboardLink(n: AppNotification): string {
  if (!n.action) return '/dashboard';
  const params = new URLSearchParams();
  if (n.action.targetTab) params.set('tab', n.action.targetTab);
  if (n.action.section) params.set('section', n.action.section);
  if (typeof n.action.index === 'number') params.set('index', String(n.action.index));
  return `/dashboard?${params.toString()}`;
}

export function NotificationBell({ isDashboard = false }: NotificationBellProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification } = useNotifications();
  const [open, setOpen] = useState(false);

  const unreadNotifications = useMemo(() => notifications.filter(n => !n.read), [notifications]);
  const topNotifications = useMemo(() => unreadNotifications.slice(0, 8), [unreadNotifications]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
        title="Notifications"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[10px] leading-none px-1.5 py-0.5 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-[420px] max-w-[92vw] z-[100]">
          {/* caret */}
          <div className="absolute right-4 -top-2 w-4 h-4 bg-slate-900 border border-slate-700 rotate-45 rounded-sm" />
          <div className="relative bg-slate-900 text-white border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/80 bg-slate-900">
              <div className="text-sm font-semibold tracking-wide">Notifications</div>
              {unreadNotifications.length > 0 && (
                <button
                  onClick={() => markAllAsRead()}
                  className="text-xs text-gray-300 hover:text-white inline-flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" /> Mark all read
                </button>
              )}
            </div>

            {topNotifications.length === 0 ? (
              <div className="px-5 py-8 text-gray-300 text-sm flex items-center gap-3">
                <Megaphone className="w-5 h-5 text-gray-400" /> No unread notifications
              </div>
            ) : (
              <ul className="max-h-[440px] overflow-auto">
                {topNotifications.map(n => (
                  <li key={n.id} className="px-4 py-3 hover:bg-slate-800/70 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5">
                        {n.kind === 'issue' ? (
                          <AlertTriangle className={`w-4 h-4 ${n.read ? 'text-amber-400/70' : 'text-amber-400'}`} />
                        ) : (
                          <Megaphone className={`w-4 h-4 ${n.read ? 'text-blue-400/70' : 'text-blue-400'}`} />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <div className="text-sm font-medium truncate">{n.title}</div>
                          <div className="text-[11px] text-gray-400 whitespace-nowrap">{formatWhen(n.createdAt)}</div>
                        </div>
                        {n.message && (
                          <div className="text-xs text-gray-300 mt-1 line-clamp-3">{n.message}</div>
                        )}
                        <div className="mt-2 flex items-center gap-2">
                          {n.action ? (
                            <Link
                              href={buildDashboardLink(n)}
                              onClick={() => setOpen(false)}
                              className="text-xs text-white bg-purple-600 hover:bg-purple-500 px-2.5 py-1 rounded-md inline-flex items-center gap-1"
                            >
                              Resolve <ChevronRight className="w-3.5 h-3.5" />
                            </Link>
                          ) : null}
                          <button
                            onClick={() => markAsRead(n.id)}
                            className="text-xs text-gray-300 hover:text-white px-2 py-1 rounded-md hover:bg-slate-800"
                          >
                            Mark read
                          </button>
                          <button
                            onClick={() => removeNotification(n.id)}
                            className="ml-auto text-xs text-gray-400 hover:text-white p-1 rounded-md hover:bg-slate-800"
                            aria-label="Dismiss"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

