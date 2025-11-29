'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { TrendingUp, Trophy, AlertTriangle } from 'lucide-react';
import { getTopStockWinners } from '@/lib/data';
import { getPartyColor } from '@/lib/utils';

export function StockWinners() {
  const winners = getTopStockWinners();

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
            <h3 className="text-lg font-semibold text-white">Top Stock Winners</h3>
            <p className="text-xs text-[#6b6b7a]">Estimated trading gains</p>
          </div>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
          <AlertTriangle className="w-3 h-3 text-amber-400" />
          <span className="text-xs text-amber-400">Potential conflicts</span>
        </div>
      </div>

      {/* Winners List */}
      <div className="space-y-3">
        {winners.map((winner, index) => (
          <motion.div
            key={winner.senator.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link
              href={`/politician/${winner.senator.id}`}
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
                  boxShadow: `0 0 0 2px ${getPartyColor(winner.senator.party)}`,
                }}
              >
                <Image
                  src={winner.senator.photo}
                  alt={winner.senator.name}
                  width={48}
                  height={48}
                  className="w-full h-full object-cover"
                  unoptimized
                />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white group-hover:text-green-400 transition-colors truncate">
                  {winner.senator.name}
                </div>
                <div className="flex items-center gap-2 text-xs text-[#6b6b7a]">
                  <span>{winner.senator.state}</span>
                  <span>•</span>
                  <span className="font-mono">{winner.senator.stockTrades} trades</span>
                </div>
              </div>

              {/* Gains */}
              <div className="text-right">
                <div className="text-lg font-bold font-mono text-green-400">
                  {winner.totalGains}
                </div>
                <div className="text-xs text-[#6b6b7a]">est. gains</div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Disclaimer */}
      <p className="text-[10px] text-[#3d3d4a] mt-4 text-center">
        Estimated gains based on reported trade disclosures. Actual returns may vary.
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
