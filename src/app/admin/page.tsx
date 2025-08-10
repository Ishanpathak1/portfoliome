'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '@/components/FirebaseAuthWrapper';
import { LogOut, Megaphone, Send } from 'lucide-react';

const ADMIN_EMAIL = 'ishan.pathak2711@gmail.com';

export default function AdminPage() {
  const { user, signInWithGoogle, signOut } = useAuth();
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [message, setMessage] = useState('');
  const [title, setTitle] = useState('Announcement');
  const [loading, setLoading] = useState(false);

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
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${await user?.getIdToken()}`,
        },
        body: JSON.stringify({ title, message }),
      });
      if (res.ok) {
        setMessage('');
        await load();
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-8 text-center">
          <h1 className="text-white text-2xl font-bold mb-4">Admin Login</h1>
          <button onClick={() => signInWithGoogle()} className="px-5 py-2 bg-white/10 text-white rounded-lg hover:bg-white/20">Sign in with Google</button>
        </div>
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-6">
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/10 backdrop-blur-xl border border-white/20 rounded-2xl p-6">
          <div className="flex items-center justify-between">
            <h1 className="text-white text-2xl font-bold flex items-center gap-2"><Megaphone className="w-5 h-5" /> Admin Announcements</h1>
            <button onClick={() => signOut()} className="text-gray-300 hover:text-white flex items-center gap-2"><LogOut className="w-4 h-4" />Sign out</button>
          </div>

          <div className="mt-6 grid gap-3">
            <input value={title} onChange={e => setTitle(e.target.value)} className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="Title" />
            <textarea value={message} onChange={e => setMessage(e.target.value)} rows={3} className="bg-white/5 border border-white/20 rounded-lg px-3 py-2 text-white" placeholder="Message..." />
            <button onClick={send} disabled={loading} className="self-start inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 disabled:opacity-50 text-white px-4 py-2 rounded-md">
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
              </div>
            ))}
            {announcements.length === 0 && <div className="text-sm text-gray-300">No announcements yet.</div>}
          </div>
        </div>
      </div>
    </div>
  );
}

