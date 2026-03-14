'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import { LogOut, Megaphone, Send, Link as LinkIcon } from 'lucide-react';
import Link from 'next/link';

const ADMIN_EMAIL = 'ishan.pathak2711@gmail.com';

export default function AdminPage() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Announcement');
  const [loading, setLoading] = useState(false);
  // Optional deep-link action
  const [actionTab, setActionTab] = useState('');
  const [actionSection, setActionSection] = useState('');
  const [actionIndex, setActionIndex] = useState<string>('');

  const isAdmin = useMemo(() => !!user && user.email === ADMIN_EMAIL, [user]);

  const load = async () => {
    const res = await fetch('/api/admin/announcements');
    if (res.ok) {
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    }
  };

  useEffect(() => { load(); }, []);

  const send = async () => {
    if (!message.trim()) return;
    setLoading(true);
    try {
      const action = (actionTab || actionSection || actionIndex)
        ? {
            ...(actionTab ? { targetTab: actionTab } : {}),
            ...(actionSection ? { section: actionSection } : {}),
            ...(actionIndex !== '' ? { index: Number(actionIndex) } : {}),
          }
        : undefined;
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`,
        },
        body: JSON.stringify({ title, message, action }),
      });
      if (res.ok) {
        setMessage('');
        setActionTab('');
        setActionSection('');
        setActionIndex('');
        await load();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Admin Login</h1>
          <button onClick={() => signInWithGoogle()} className="px-5 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Sign in with Google</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center text-white">
          <div className="text-xl font-semibold">Unauthorized</div>
          <div className="text-gray-300 mt-2">You do not have access to this page.</div>
          <button onClick={() => signOut()} className="mt-4 inline-flex items-center gap-2 text-gray-300 hover:text-white">
            <LogOut className="w-4 h-4" /> Sign out
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold flex items-center gap-2"><Megaphone className="w-5 h-5" /> Admin Announcements</h1>
            <button onClick={() => signOut()} className="text-gray-300 hover:text-white flex items-center gap-2"><LogOut className="w-4 h-4" />Sign out</button>
          </div>

          <div className="mt-6 grid gap-3">
            <input value={title} onChange={e => setTitle(e.target.value)} className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="Title" />
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="Message..." />
            <div className="grid gap-2 sm:grid-cols-3">
              <div>
                <label className="block text-xs text-gray-300 mb-1">Tab</label>
                <input value={actionTab} onChange={e => setActionTab(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="e.g., content, design, settings" />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Section</label>
                <input value={actionSection} onChange={e => setActionSection(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="e.g., experience, projects" />
              </div>
              <div>
                <label className="block text-xs text-gray-300 mb-1">Index</label>
                <input value={actionIndex} onChange={e => setActionIndex(e.target.value)} className="w-full bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="0" inputMode="numeric" />
              </div>
            </div>
            <button onClick={send} disabled={loading} className="self-start inline-flex items-center gap-2 bg-gray-600 hover:bg-gray-500 disabled:opacity-50 text-white px-4 py-2 rounded-md">
              <Send className="w-4 h-4" /> {loading ? 'Sending...' : 'Send'}
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6 mt-6">
          <h2 className="text-white text-lg font-semibold mb-3">Recent Announcements</h2>
          <div className="space-y-3">
            {announcements.map((a) => (
              <div key={a.id} className="bg-white/5 border border-white/10 rounded-lg p-3">
                <div className="flex items-center justify-between">
                  <div className="text-white font-medium">{a.title}</div>
                  <div className="text-xs text-gray-300">{new Date(a.createdAt).toLocaleString()}</div>
                </div>
                <div className="text-sm text-gray-300 mt-1">{a.message}</div>
                {a.action ? (
                  <div className="mt-2 text-xs text-gray-300 flex items-center gap-2">
                    <LinkIcon className="w-3.5 h-3.5" />
                    <Link className="underline hover:text-white" href={`/dashboard${buildLinkFromAction(a.action)}`}>Open deep link</Link>
                  </div>
                ) : null}
              </div>
            ))}
            {announcements.length === 0 && <div className="text-sm text-gray-300">No announcements yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

function buildLinkFromAction(action: any): string {
  try {
    const params = new URLSearchParams();
    if (action?.targetTab) params.set('tab', String(action.targetTab));
    if (action?.section) params.set('section', String(action.section));
    if (typeof action?.index === 'number') params.set('index', String(action.index));
    const query = params.toString();
    return query ? `?${query}` : '';
  } catch {
    return '';
  }
}

