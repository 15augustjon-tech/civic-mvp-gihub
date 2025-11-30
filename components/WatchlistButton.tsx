'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, BellOff, Loader2, Check } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';

interface WatchlistButtonProps {
  politicianId: string;
  politicianName: string;
  politicianParty: 'R' | 'D' | 'I';
  politicianState: string;
  politicianChamber: 'senate' | 'house';
}

export function WatchlistButton({
  politicianId,
  politicianName,
  politicianParty,
  politicianState,
  politicianChamber,
}: WatchlistButtonProps) {
  const [isWatching, setIsWatching] = useState(false);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();
  const router = useRouter();

  useEffect(() => {
    // Check if user is logged in and if politician is in watchlist
    const checkStatus = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const res = await fetch('/api/watchlist');
        const data = await res.json();
        if (data.watchlist) {
          const isInList = data.watchlist.some((item: any) => item.politician_id === politicianId);
          setIsWatching(isInList);
        }
      }
      setLoading(false);
    };

    checkStatus();
  }, [politicianId, supabase.auth]);

  const handleToggle = async () => {
    if (!user) {
      // Redirect to login using Next.js router
      router.push('/login');
      return;
    }

    setActionLoading(true);

    if (isWatching) {
      // Remove from watchlist
      const res = await fetch(`/api/watchlist?politician_id=${politicianId}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        setIsWatching(false);
      }
    } else {
      // Add to watchlist
      const res = await fetch('/api/watchlist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          politician_id: politicianId,
          politician_name: politicianName,
          politician_party: politicianParty,
          politician_state: politicianState,
          politician_chamber: politicianChamber,
        }),
      });
      if (res.ok) {
        setIsWatching(true);
      }
    }

    setActionLoading(false);
  };

  if (loading) {
    return (
      <button
        disabled
        className="px-4 py-2 rounded-lg bg-white/[0.04] border border-white/[0.08] text-[#6b6b7a]"
      >
        <Loader2 className="w-4 h-4 animate-spin" />
      </button>
    );
  }

  return (
    <motion.button
      onClick={handleToggle}
      disabled={actionLoading}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className={cn(
        'px-4 py-2 rounded-lg font-medium transition-all flex items-center gap-2',
        isWatching
          ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500/20'
          : 'bg-white/[0.04] border border-white/[0.08] text-white hover:border-amber-500/30'
      )}
    >
      <AnimatePresence mode="wait">
        {actionLoading ? (
          <motion.div
            key="loading"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <Loader2 className="w-4 h-4 animate-spin" />
          </motion.div>
        ) : isWatching ? (
          <motion.div
            key="watching"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <Bell className="w-4 h-4" />
            <span>Watching</span>
            <Check className="w-3 h-3" />
          </motion.div>
        ) : (
          <motion.div
            key="watch"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="flex items-center gap-2"
          >
            <BellOff className="w-4 h-4" />
            <span>{user ? 'Add to Watchlist' : 'Sign in to Watch'}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.button>
  );
}
