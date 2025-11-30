'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { createClient } from '@/lib/supabase/client';
import { Bell, BellOff, Trash2, Loader2, ExternalLink, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface WatchlistItem {
  id: string;
  politician_id: string;
  politician_name: string;
  politician_party: 'R' | 'D' | 'I';
  politician_state: string;
  politician_chamber: 'senate' | 'house';
  alerts_enabled: boolean;
  created_at: string;
}

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        router.push('/login');
        return;
      }
      setUser(user);

      // Fetch watchlist
      const res = await fetch('/api/watchlist');
      const data = await res.json();
      setWatchlist(data.watchlist || []);
      setLoading(false);
    };

    checkAuth();
  }, [router, supabase.auth]);

  const handleRemove = async (politicianId: string) => {
    const res = await fetch(`/api/watchlist?politician_id=${politicianId}`, {
      method: 'DELETE',
    });
    if (res.ok) {
      setWatchlist(prev => prev.filter(item => item.politician_id !== politicianId));
    }
  };

  const getPartyColor = (party: string) => {
    if (party === 'R') return 'bg-red-500';
    if (party === 'D') return 'bg-blue-500';
    return 'bg-purple-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center gap-4 mb-8">
          <Link
            href="/"
            className="p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] transition-colors"
          >
            <ArrowLeft className="w-5 h-5 text-[#a0a0aa]" />
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-white">My Watchlist</h1>
            <p className="text-[#6b6b7a]">Track politicians and get alerts on new trades</p>
          </div>
        </div>

        {/* Watchlist */}
        {watchlist.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16"
          >
            <div className="w-16 h-16 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center mx-auto mb-4">
              <BellOff className="w-8 h-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No politicians watched yet</h2>
            <p className="text-[#6b6b7a] mb-6">Start tracking politicians to get alerts on their stock trades</p>
            <Link
              href="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 rounded-lg text-white font-medium transition-all"
            >
              Browse Politicians
              <ExternalLink className="w-4 h-4" />
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4">
            {watchlist.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors"
              >
                <div className="flex items-center justify-between">
                  <Link
                    href={`/politician/${item.politician_id}`}
                    className="flex items-center gap-4 group"
                  >
                    <div className={`w-12 h-12 rounded-full ${getPartyColor(item.politician_party)} flex items-center justify-center text-white font-bold`}>
                      {item.politician_name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors">
                        {item.politician_name}
                      </h3>
                      <p className="text-sm text-[#6b6b7a]">
                        {item.politician_party === 'R' ? 'Republican' : item.politician_party === 'D' ? 'Democrat' : 'Independent'} • {item.politician_state} • {item.politician_chamber === 'senate' ? 'Senate' : 'House'}
                      </p>
                    </div>
                  </Link>

                  <div className="flex items-center gap-3">
                    <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 text-sm">
                      <Bell className="w-4 h-4" />
                      <span>Alerts On</span>
                    </div>
                    <button
                      onClick={() => handleRemove(item.politician_id)}
                      className="p-2 rounded-lg text-[#6b6b7a] hover:text-red-400 hover:bg-red-500/10 transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
