'use client';

import React from 'react';
import { useSearchParams, usePathname } from 'next/navigation';
import { NfcContactModal } from './NfcContactModal';
import { downloadVCard } from '@/lib/vcard';
import { DatabasePortfolio } from '@/lib/portfolio-db';

interface NfcTapGuardProps {
  portfolio: DatabasePortfolio;
}

const STORAGE_TTL_MS = 1000 * 60 * 60 * 6; // 6 hours

export function NfcTapGuard({ portfolio }: NfcTapGuardProps) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const [open, setOpen] = React.useState(false);

  React.useEffect(() => {
    try {
      // Trigger if tap or nfc param is present (any value). 'force' bypasses cooldown
      const tapVal = searchParams?.get('tap');
      const nfcVal = searchParams?.get('nfc');
      const hasTap = tapVal !== null || nfcVal !== null;
      const isForce = tapVal === 'force' || nfcVal === 'force';
      if (!hasTap) return;

      const key = `nfcPrompt:${portfolio.id}`;
      const raw = window.localStorage.getItem(key);
      const now = Date.now();
      if (!isForce && raw) {
        const { ts } = JSON.parse(raw);
        if (now - ts < STORAGE_TTL_MS) {
          // Respect cooldown; still clean URL
          cleanUrl(pathname);
          return;
        }
      }

      // Show modal and set cooldown
      setOpen(true);
      window.localStorage.setItem(key, JSON.stringify({ ts: now }));
      // Clean up the query param for SEO/share cleanliness
      cleanUrl(pathname);
    } catch {}
  }, [searchParams, pathname, portfolio.id]);

  function cleanUrl(path: string) {
    if (typeof window === 'undefined') return;
    const url = new URL(window.location.href);
    url.searchParams.delete('tap');
    url.searchParams.delete('nfc');
    window.history.replaceState({}, '', url.toString());
  }

  function handleSaveContact() {
    const c = portfolio.resumeData.contact;
    downloadVCard(c, c.name || portfolio.slug);
  }

  function handleSendEmail() {
    const c = portfolio.resumeData.contact;
    const email = c.email || portfolio.userId;
    if (!email) return;
    const subject = encodeURIComponent('Hello from your NFC card');
    const body = encodeURIComponent(`Hi ${c.name || ''},\n\n`);
    window.location.href = `mailto:${email}?subject=${subject}&body=${body}`;
  }

  // Auto-dismiss after 5 seconds when opened
  React.useEffect(() => {
    if (!open) return;
    const timer = window.setTimeout(() => setOpen(false), 5000);
    return () => window.clearTimeout(timer);
  }, [open]);

  // Android-only haptic (vibration) when modal opens
  React.useEffect(() => {
    if (!open) return;
    try {
      const isIos = () => {
        const ua = navigator.userAgent || (navigator as any).vendor || (window as any).opera;
        const iPadOS13 = navigator.platform === 'MacIntel' && (navigator as any).maxTouchPoints > 1;
        return /iPad|iPhone|iPod/.test(ua) || iPadOS13;
      };
      if ('vibrate' in navigator && !isIos()) {
        // Short pulse; safe on Android Chrome
        (navigator as any).vibrate?.(40);
      }
    } catch {}
  }, [open]);

  return (
    <NfcContactModal
      open={open}
      onClose={() => setOpen(false)}
      onSaveContact={handleSaveContact}
      onSendEmail={handleSendEmail}
      name={portfolio.resumeData.contact.name}
      email={portfolio.resumeData.contact.email}
      phone={portfolio.resumeData.contact.phone}
    />
  );
}


