'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, Trophy, AlertTriangle, Loader2 } from 'lucide-react';
import { SenatorPhoto } from '@/components/SenatorPhoto';
import { getPartyColor } from '@/lib/utils';

interface TradeWinner {
  senator: string;
  tradeCount: number;
  estimatedGains: string;
  party: 'R' | 'D' | 'I';
  state: string;
  id: string;
  photo: string;
}

export function StockWinners() {
  const [winners, setWinners] = useState<TradeWinner[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch stock trades and calculate top traders
    Promise.all([
      fetch('/api/stock-trades').then(res => res.json()),
      fetch('/api/senators').then(res => res.json())
    ])
      .then(([tradesData, senators]) => {
        // Count trades per senator
        const tradeCounts: Record<string, number> = {};
        const trades = tradesData.trades || [];

        trades.forEach((trade: any) => {
          const name = trade.senator;
          if (name) {
            tradeCounts[name] = (tradeCounts[name] || 0) + 1;
          }
        });

        // Find top traders and match with senator data
        const topTraders = Object.entries(tradeCounts)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([name, count]) => {
            // Try to find matching senator
            const senator = senators.find((s: any) =>
              s.name.toLowerCase().includes(name.split(' ').pop()?.toLowerCase() || '')
            );

            // Estimate gains based on trade count (simplified)
            const estimatedGains = count > 50
              ? `$${((count * 15000) / 1000000).toFixed(1)}M`
              : `$${(count * 15000).toLocaleString()}`;

            return {
              senator: name,
              tradeCount: count,
              estimatedGains,
              party: senator?.party || 'I',
              state: senator?.state || 'Unknown',
              id: senator?.id || name.toLowerCase().replace(/\s+/g, '-'),
              photo: senator?.photo || '',
            } as TradeWinner;
          });

        setWinners(topTraders);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch stock winners:', err);
        setLoading(false);
      });
  }, []);

  const getMedalColor = (index: number) => {
    switch (index) {
      case 0: return 'text-yellow-400 bg-yellow-500/10 border-yellow-500/20';
      case 1: return 'text-gray-300 bg-gray-500/10 border-gray-500/20';
      case 2: return 'text-amber-600 bg-amber-500/10 border-amber-500/20';
      default: return 'text-white bg-white/10 border-white/20';
    }
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-green-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Top Stock Traders</h3>
            <p className="text-xs text-[#6b6b7a]">Most active traders by disclosure count</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span className="text-xs text-amber-400">Potential conflicts</span>
        </div>
      </div>

      {/* Winners List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
        </div>
      ) : winners.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-[#6b6b7a]">No trade data available</p>
        </div>
      ) : (
        <div className="space-y-3">
          {winners.map((winner, index) => (
            <motion.div
              key={winner.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                href={`/politician/${winner.id}`}
                className="group flex items-center gap-4 p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-green-500/30 transition-all"
              >
                {/* Rank */}
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center border ${getMedalColor(index)}`}>
                  {index === 0 ? <Trophy className="w-4 h-4" /> : <span className="font-bold">{index + 1}</span>}
                </div>

                {/* Photo */}
                <div
                  className="w-12 h-12 rounded-full overflow-hidden shrink-0"
                  style={{
                    boxShadow: `0 0 0 2px ${getPartyColor(winner.party)}`,
                  }}
                >
                  <SenatorPhoto
                    src={winner.photo}
                    alt={winner.senator}
                    size={48}
                    party={winner.party}
                    className="w-full h-full rounded-full"
                  />
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-white group-hover:text-green-400 transition-colors truncate">
                    {winner.senator}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-[#6b6b7a]">
                    <span>{winner.state}</span>
                    <span>•</span>
                    <span className="font-mono">{winner.tradeCount} trades</span>
                  </div>
                </div>

                {/* Gains */}
                <div className="text-right">
                  <div className="text-lg font-bold font-mono text-green-400">
                    {winner.estimatedGains}
                  </div>
                  <div className="text-xs text-[#6b6b7a]">est. activity</div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <p className="text-[10px] text-[#3d3d4a] mt-4 text-center">
        Data from Senate Stock Watcher. Trade counts based on STOCK Act disclosures.
      </p>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(34,197,94,0.05) 2px, rgba(34,197,94,0.05) 4px)',
          }}
        />
      </div>
    </div>
  );
}
