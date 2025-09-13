'use client';

import React, { useEffect, useMemo, useRef, useState } from 'react';
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
  const containerRef = useRef<HTMLDivElement | null>(null);

  const unreadNotifications = useMemo(() => notifications.filter(n => !n.read), [notifications]);
  const topNotifications = useMemo(() => unreadNotifications.slice(0, 8), [unreadNotifications]);

  // Close on outside click (desktop) and on Escape
  useEffect(() => {
    if (!open) return;

    function handleDocumentMouseDown(event: MouseEvent) {
      const container = containerRef.current;
      if (!container) return;
      const target = event.target as Node | null;
      if (target && !container.contains(target)) {
        setOpen(false);
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') setOpen(false);
    }

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [open]);

  return (
    <div className="relative" ref={containerRef}>
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-lg text-gray-600 hover:text-[rgb(var(--fg))] hover:bg-[rgb(var(--border))]/40 transition-colors"
        style={{ color: 'var(--fg)' }}
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
        <>
          {/* Desktop dropdown */}
          <div className="hidden sm:block absolute right-0 mt-2 w-[420px] max-w-[92vw] z-[100]">
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
                            {!n.action ? (
                              <Link
                                href="/dashboard"
                                onClick={() => setOpen(false)}
                                className="text-xs text-white bg-purple-600 hover:bg-purple-500 px-2.5 py-1 rounded-md inline-flex items-center gap-1"
                              >
                                Open <ChevronRight className="w-3.5 h-3.5" />
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

          {/* Mobile sheet */}
          <>
            {/* overlay */}
            <div className="sm:hidden fixed inset-0 bg-black/40 z-[100]" onClick={() => setOpen(false)} />
            <div className="sm:hidden fixed inset-x-0 top-16 z-[101] bg-slate-900 text-white border-t border-slate-700 rounded-b-xl shadow-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-slate-700/80">
                <div className="text-base font-semibold">Notifications</div>
                {unreadNotifications.length > 0 && (
                  <button
                    onClick={() => markAllAsRead()}
                    className="text-sm text-gray-300 hover:text-white inline-flex items-center gap-1"
                  >
                    <Check className="w-4 h-4" /> Mark all read
                  </button>
                )}
              </div>
              {topNotifications.length === 0 ? (
                <div className="px-5 py-8 text-gray-300 text-sm flex items-center gap-3">
                  <Megaphone className="w-5 h-5 text-gray-400" /> No unread notifications
                </div>
              ) : (
                <ul className="max-h-[65vh] overflow-auto">
                  {topNotifications.map(n => (
                    <li key={n.id} className="px-4 py-4 border-b border-slate-800">
                      <div className="flex items-start gap-3">
                        <div className="mt-0.5">
                          {n.kind === 'issue' ? (
                            <AlertTriangle className={`w-5 h-5 ${n.read ? 'text-amber-400/70' : 'text-amber-400'}`} />
                          ) : (
                            <Megaphone className={`w-5 h-5 ${n.read ? 'text-blue-400/70' : 'text-blue-400'}`} />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <div className="text-sm font-semibold break-words">{n.title}</div>
                            <div className="text-[12px] text-gray-400 whitespace-nowrap">{formatWhen(n.createdAt)}</div>
                          </div>
                          {n.message && (
                            <div className="text-sm text-gray-300 mt-1 break-words">{n.message}</div>
                          )}
                          <div className="mt-3 flex items-center gap-2">
                            {n.action ? (
                              <Link
                                href={buildDashboardLink(n)}
                                onClick={() => setOpen(false)}
                                className="text-sm text-white bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded-md inline-flex items-center gap-1"
                              >
                                Resolve <ChevronRight className="w-4 h-4" />
                              </Link>
                            ) : (
                              <Link
                                href="/dashboard"
                                onClick={() => setOpen(false)}
                                className="text-sm text-white bg-purple-600 hover:bg-purple-500 px-3 py-2 rounded-md inline-flex items-center gap-1"
                              >
                                Open <ChevronRight className="w-4 h-4" />
                              </Link>
                            )}
                            <button
                              onClick={() => markAsRead(n.id)}
                              className="text-sm text-gray-300 hover:text-white px-3 py-2 rounded-md bg-slate-800/60"
                            >
                              Mark read
                            </button>
                            <button
                              onClick={() => removeNotification(n.id)}
                              className="ml-auto text-sm text-gray-400 hover:text-white p-2 rounded-md bg-slate-800/60"
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
          </>
        </>
      )}
    </div>
  );
}

