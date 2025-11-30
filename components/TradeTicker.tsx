'use client';

import { useState, useEffect } from 'react';
import { getDaysAgo } from '@/lib/utils';

interface Trade {
  senator: string;
  ticker: string;
  type: string;
  amount: string;
  transactionDate: string;
}

export function TradeTicker() {
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    fetch('/api/stock-trades')
      .then(res => res.json())
      .then(data => {
        if (data.trades) {
          setTrades(data.trades.slice(0, 20));
        }
      })
      .catch(console.error);
  }, []);

  // Duplicate trades for seamless infinite scroll
  const duplicatedTrades = [...trades, ...trades];

  if (trades.length === 0) {
    return (
      <div className="relative w-full overflow-hidden bg-[#08080c] border-y border-white/[0.03]">
        <div className="animate-ticker flex items-center gap-8 py-3 px-4 whitespace-nowrap">
          <span className="text-[#3d3d4a] text-sm">Loading latest stock trades...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full overflow-hidden bg-[#08080c] border-y border-white/[0.03]">
      {/* Gradient fade on edges */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#08080c] to-transparent z-10 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#08080c] to-transparent z-10 pointer-events-none" />

      {/* Ticker content */}
      <div className="animate-ticker flex items-center gap-8 py-3 px-4 hover:pause whitespace-nowrap">
        {duplicatedTrades.map((trade, index) => {
          const isPurchase = trade.type?.toLowerCase().includes('purchase');
          const senatorLastName = trade.senator?.split(' ').pop() || 'Unknown';

          return (
            <div
              key={`${trade.senator}-${trade.ticker}-${index}`}
              className="flex items-center gap-3 text-sm"
            >
              {/* Trade type indicator */}
              <span
                className={`w-2 h-2 rounded-full ${
                  isPurchase ? 'bg-green-500' : 'bg-red-500'
                } animate-pulse`}
              />

              {/* Trade info */}
              <span className="text-[#6b6b7a]">Sen.</span>
              <span className="text-white font-medium">{senatorLastName}</span>
              <span
                className={`font-semibold ${
                  isPurchase ? 'text-green-400' : 'text-red-400'
                }`}
              >
                {isPurchase ? 'BOUGHT' : 'SOLD'}
              </span>
              <span className="text-[#6b6b7a]">{trade.amount || 'N/A'}</span>
              <span className="font-mono font-bold text-blue-400">{trade.ticker || 'N/A'}</span>
              <span className="text-[#3d3d4a]">•</span>
              <span className="text-[#3d3d4a] text-xs">{getDaysAgo(trade.transactionDate)}</span>

              {/* Separator */}
              <span className="text-[#1a1a24] mx-4">│</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
