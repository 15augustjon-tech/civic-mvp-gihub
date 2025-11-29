'use client';

import { motion } from 'framer-motion';
import { getAllTrades } from '@/lib/data';
import { getDaysAgo } from '@/lib/utils';

export function TradeTicker() {
  const allTrades = getAllTrades();

  // Duplicate trades for seamless infinite scroll
  const duplicatedTrades = [...allTrades, ...allTrades];

  return (
    <div className="relative w-full overflow-hidden bg-[#08080c] border-y border-white/[0.03]">
      {/* Gradient fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#08080c] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#08080c] to-transparent z-10 pointer-events-none" />

      {/* Ticker content */}
      <div className="animate-ticker flex items-center gap-8 py-3 px-4 hover:pause whitespace-nowrap">
        {duplicatedTrades.map((trade, index) => (
          <div
            key={`${trade.senatorId}-${trade.ticker}-${index}`}
            className="flex items-center gap-3 text-sm"
          >
            {/* Trade type indicator */}
            <span
              className={`w-2 h-2 rounded-full ${
                trade.type === 'BUY' ? 'bg-red-500' : 'bg-green-500'
              } animate-pulse`}
            />

            {/* Trade info */}
            <span className="text-[#6b6b7a]">Sen.</span>
            <span className="text-white font-medium">{trade.senatorName.split(' ')[1]}</span>
            <span
              className={`font-semibold ${
                trade.type === 'BUY' ? 'text-red-400' : 'text-green-400'
              }`}
            >
              {trade.type === 'BUY' ? 'BOUGHT' : 'SOLD'}
            </span>
            <span className="text-[#6b6b7a]">{trade.amount}</span>
            <span className="font-mono font-bold text-blue-400">{trade.ticker}</span>
            <span className="text-[#3d3d4a]">•</span>
            <span className="text-[#3d3d4a] text-xs">{getDaysAgo(trade.date)}</span>

            {/* Separator */}
            <span className="text-[#1a1a24] mx-4">│</span>
          </div>
        ))}
      </div>
    </div>
  );
}
