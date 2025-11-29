'use client';

import { motion } from 'framer-motion';
import { AlertTriangle } from 'lucide-react';
import { Trade } from '@/lib/data';
import { cn, formatDate, getDaysAgo } from '@/lib/utils';

interface TradeTimelineProps {
  trades: Trade[];
}

export function TradeTimeline({ trades }: TradeTimelineProps) {
  if (trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-16 h-16 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
          <span className="text-2xl text-blue-400">?</span>
        </div>
        <p className="text-[#6b6b7a]">Stock trade data not yet available</p>
        <p className="text-xs text-[#3d3d4a] mt-1 max-w-[250px]">
          Senate financial disclosures require manual scraping from efdsearch.senate.gov
        </p>
        <a
          href="https://efdsearch.senate.gov/search/"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 text-xs text-blue-400 hover:text-blue-300 transition-colors"
        >
          View Senate Disclosures →
        </a>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Timeline line */}
      <div className="absolute left-[7px] top-2 bottom-2 w-0.5 bg-gradient-to-b from-blue-500/40 via-blue-500/20 to-transparent" />

      {/* Trade items */}
      <div className="space-y-4">
        {trades.map((trade, index) => (
          <motion.div
            key={`${trade.ticker}-${trade.date}-${index}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1, duration: 0.4 }}
            className="relative pl-8"
          >
            {/* Timeline dot */}
            <div
              className={cn(
                'absolute left-0 top-3 w-[14px] h-[14px] rounded-full border-2 border-[#0a0a0f]',
                trade.type === 'BUY'
                  ? 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                  : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
              )}
            />

            {/* Trade card */}
            <div
              className={cn(
                'p-4 rounded-lg border transition-all hover:translate-x-1',
                'bg-[#0a0a0f]/60 backdrop-blur-sm',
                trade.potentialConflict
                  ? 'border-amber-500/20 hover:border-amber-500/40'
                  : 'border-white/[0.06] hover:border-blue-500/30'
              )}
            >
              {/* Header */}
              <div className="flex items-start justify-between mb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold font-mono text-white">{trade.ticker}</span>
                    <span
                      className={cn(
                        'px-2 py-0.5 rounded text-xs font-bold',
                        trade.type === 'BUY'
                          ? 'bg-red-500/20 text-red-400'
                          : 'bg-green-500/20 text-green-400'
                      )}
                    >
                      {trade.type}
                    </span>
                  </div>
                  <p className="text-sm text-[#6b6b7a] mt-0.5">{trade.company}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono text-white">{trade.amount}</p>
                  <p className="text-xs text-[#3d3d4a]">{getDaysAgo(trade.date)}</p>
                </div>
              </div>

              {/* Date */}
              <div className="text-xs text-[#6b6b7a]">{formatDate(trade.date)}</div>

              {/* Conflict warning */}
              {trade.potentialConflict && (
                <div className="mt-3 p-2 rounded bg-amber-500/10 border border-amber-500/20 flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  <p className="text-xs text-amber-300/80">{trade.potentialConflict}</p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
