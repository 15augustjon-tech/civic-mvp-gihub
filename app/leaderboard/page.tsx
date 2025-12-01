'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  Trophy,
  Clock,
  DollarSign,
  TrendingUp,
  ChevronRight,
  Loader2,
  ArrowLeft,
  Crown,
  Medal,
  Award
} from 'lucide-react';
import { fetchSenators, Senator } from '@/lib/data';
import { cn } from '@/lib/utils';

type LeaderboardCategory = 'tenure' | 'fundraising' | 'trading';

export default function LeaderboardPage() {
  const [senators, setSenators] = useState<Senator[]>([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<LeaderboardCategory>('tenure');

  useEffect(() => {
    fetchSenators()
      .then(data => {
        setSenators(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Failed to fetch senators:', error);
        setLoading(false);
      });
  }, []);

  // Calculate years in office for each senator
  const senatorsWithTenure = useMemo(() => {
    const currentYear = new Date().getFullYear();
    return senators.map(s => ({
      ...s,
      yearsInOffice: currentYear - s.since
    }));
  }, [senators]);

  // Sort by tenure (longest serving)
  const longestServing = useMemo(() => {
    return [...senatorsWithTenure]
      .sort((a, b) => b.yearsInOffice - a.yearsInOffice)
      .slice(0, 25);
  }, [senatorsWithTenure]);

  // Sort by trading activity
  const mostTrades = useMemo(() => {
    return [...senators]
      .sort((a, b) => b.stockTrades - a.stockTrades)
      .slice(0, 25);
  }, [senators]);

  // Party breakdown
  const partyStats = useMemo(() => {
    const dems = senators.filter(s => s.party === 'D').length;
    const reps = senators.filter(s => s.party === 'R').length;
    const inds = senators.filter(s => s.party === 'I').length;
    return { dems, reps, inds };
  }, [senators]);

  const categories = [
    { id: 'tenure' as const, label: 'Longest Serving', icon: Clock, color: 'blue' },
    { id: 'fundraising' as const, label: 'Most $ Raised', icon: DollarSign, color: 'green' },
    { id: 'trading' as const, label: 'Most Trades', icon: TrendingUp, color: 'amber' },
  ];

  const getRankIcon = (rank: number) => {
    if (rank === 0) return <Crown className="w-5 h-5 text-yellow-400" />;
    if (rank === 1) return <Medal className="w-5 h-5 text-gray-400" />;
    if (rank === 2) return <Award className="w-5 h-5 text-amber-600" />;
    return <span className="text-sm font-mono text-[#6b6b7a]">#{rank + 1}</span>;
  };

  const getPartyColor = (party: string) => {
    if (party === 'D') return 'bg-blue-500';
    if (party === 'R') return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getCurrentList = () => {
    switch (category) {
      case 'tenure':
        return longestServing;
      case 'trading':
        return mostTrades;
      case 'fundraising':
        // For now, show by tenure since we need to fetch FEC data
        return longestServing;
      default:
        return longestServing;
    }
  };

  const getValue = (senator: Senator & { yearsInOffice?: number }) => {
    switch (category) {
      case 'tenure':
        return `${senator.yearsInOffice} years`;
      case 'trading':
        return `${senator.stockTrades} trades`;
      case 'fundraising':
        return 'Loading...';
      default:
        return '';
    }
  };

  return (
    <div className="min-h-screen bg-[#050508] bg-grid">
      {/* Header */}
      <div className="bg-mesh">
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-12">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#6b6b7a] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Trophy className="w-10 h-10 text-yellow-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                LEADERBOARD
              </h1>
            </div>
            <p className="text-[#6b6b7a] text-lg">
              Senate rankings by tenure, fundraising, and trading activity
            </p>
          </motion.div>

          {/* Party Breakdown */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="flex justify-center gap-6 mt-8"
          >
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-blue-500" />
              <span className="text-sm text-[#a0a0aa]">{partyStats.dems} Democrats</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500" />
              <span className="text-sm text-[#a0a0aa]">{partyStats.reps} Republicans</span>
            </div>
            {partyStats.inds > 0 && (
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-purple-500" />
                <span className="text-sm text-[#a0a0aa]">{partyStats.inds} Independent</span>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* Category Tabs */}
      <div className="max-w-5xl mx-auto px-6 -mt-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="flex gap-2 p-1 rounded-xl bg-white/[0.02] border border-white/[0.04] backdrop-blur-sm"
        >
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategory(cat.id)}
              className={cn(
                'flex-1 flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium transition-all',
                category === cat.id
                  ? 'bg-white/[0.08] text-white'
                  : 'text-[#6b6b7a] hover:text-white hover:bg-white/[0.04]'
              )}
            >
              <cat.icon className="w-4 h-4" />
              {cat.label}
            </button>
          ))}
        </motion.div>
      </div>

      {/* Leaderboard List */}
      <div className="max-w-5xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-[#6b6b7a]">Loading senators...</p>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="space-y-3"
          >
            {/* Top 3 Podium */}
            <div className="grid grid-cols-3 gap-4 mb-8">
              {getCurrentList().slice(0, 3).map((senator, index) => {
                const displayOrder = [1, 0, 2]; // Silver, Gold, Bronze
                const actualIndex = displayOrder[index];
                const actualSenator = getCurrentList()[actualIndex];
                if (!actualSenator) return null;

                const heights = ['h-32', 'h-40', 'h-28'];
                const podiumColors = [
                  'from-gray-400/20 to-gray-500/10 border-gray-400/30',
                  'from-yellow-400/20 to-yellow-500/10 border-yellow-400/30',
                  'from-amber-600/20 to-amber-700/10 border-amber-600/30'
                ];

                return (
                  <motion.div
                    key={actualSenator.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + actualIndex * 0.1 }}
                    className="flex flex-col items-center"
                  >
                    <Link href={`/politician/${actualSenator.id}`} className="group">
                      <div className="relative mb-3">
                        <img
                          src={actualSenator.photo}
                          alt={actualSenator.name}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover border-2 border-white/20 group-hover:border-blue-500/50 transition-colors"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = '/placeholder-senator.png';
                          }}
                        />
                        <div className={cn(
                          'absolute -bottom-1 -right-1 w-6 h-6 rounded-full flex items-center justify-center',
                          getPartyColor(actualSenator.party)
                        )}>
                          <span className="text-[10px] font-bold text-white">{actualSenator.party}</span>
                        </div>
                      </div>
                      <div className="text-center">
                        <p className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors truncate max-w-[120px]">
                          {actualSenator.lastName}
                        </p>
                        <p className="text-xs text-[#6b6b7a]">{actualSenator.stateAbbr}</p>
                      </div>
                    </Link>
                    <div className={cn(
                      'w-full mt-3 rounded-t-lg bg-gradient-to-b border-t border-x flex items-start justify-center pt-3',
                      heights[actualIndex],
                      podiumColors[actualIndex]
                    )}>
                      <div className="text-center">
                        {getRankIcon(actualIndex)}
                        <p className="text-xs font-mono text-white mt-1">
                          {getValue(actualSenator as Senator & { yearsInOffice?: number })}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Rest of the list */}
            {getCurrentList().slice(3).map((senator, index) => (
              <motion.div
                key={senator.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.02 }}
              >
                <Link
                  href={`/politician/${senator.id}`}
                  className="flex items-center gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/30 hover:bg-white/[0.04] transition-all group"
                >
                  {/* Rank */}
                  <div className="w-10 flex justify-center">
                    {getRankIcon(index + 3)}
                  </div>

                  {/* Photo */}
                  <div className="relative">
                    <img
                      src={senator.photo}
                      alt={senator.name}
                      className="w-12 h-12 rounded-full object-cover border border-white/10"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder-senator.png';
                      }}
                    />
                    <div className={cn(
                      'absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center',
                      getPartyColor(senator.party)
                    )}>
                      <span className="text-[9px] font-bold text-white">{senator.party}</span>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <h3 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors">
                        {senator.name}
                      </h3>
                    </div>
                    <p className="text-xs text-[#6b6b7a]">
                      {senator.state} • Since {senator.since}
                    </p>
                  </div>

                  {/* Value */}
                  <div className="text-right">
                    <p className="text-sm font-mono text-white">
                      {getValue(senator as Senator & { yearsInOffice?: number })}
                    </p>
                  </div>

                  <ChevronRight className="w-4 h-4 text-[#3d3d4a] group-hover:text-blue-400 transition-colors" />
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 mt-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs text-[#3d3d4a]">
            Data sourced from Congress.gov and @unitedstates/congress-legislators
          </p>
        </div>
      </footer>
    </div>
  );
}
