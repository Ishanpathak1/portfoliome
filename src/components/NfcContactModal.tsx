'use client';

import React from 'react';

interface NfcContactModalProps {
  open: boolean;
  onClose: () => void;
  onSaveContact: () => void;
  onSendEmail: () => void;
  name?: string;
  email?: string;
  phone?: string;
}

export function NfcContactModal({ open, onClose, onSaveContact, onSendEmail, name, email, phone }: NfcContactModalProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative z-10 w-[90%] max-w-md rounded-xl border border-white/10 bg-gray-900 p-6 text-white shadow-2xl">
        <div className="mb-3 rounded-md bg-white/10 px-3 py-2 text-sm text-gray-100">
          You just tapped {name ? `${name}'s` : 'this'} portfolio.
        </div>
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Quick actions</h2>
          <p className="mt-1 text-sm text-gray-300">
            Save contact or send an email to {name || 'this contact'}.
          </p>
        </div>
        <div className="mb-4 space-y-1 text-sm text-gray-300">
          {name ? <div><span className="text-gray-400">Name:</span> {name}</div> : null}
          {email ? <div><span className="text-gray-400">Email:</span> {email}</div> : null}
          {phone ? <div><span className="text-gray-400">Phone:</span> {phone}</div> : null}
        </div>
        <div className="mt-2 flex flex-col gap-3 sm:flex-row">
          <button
            onClick={onSaveContact}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Save contact
          </button>
          <button
            onClick={onSendEmail}
            className="inline-flex flex-1 items-center justify-center rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium hover:bg-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-400"
          >
            Send email
          </button>
        </div>
        <button
          onClick={onClose}
          className="mt-4 w-full rounded-lg border border-white/10 bg-white/5 px-4 py-2 text-sm text-gray-200 hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-white/20"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}


