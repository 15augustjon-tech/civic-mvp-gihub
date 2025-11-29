'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, TrendingDown, Loader2, ExternalLink, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Trade {
  ticker: string;
  assetDescription: string;
  assetType: string;
  type: string;
  amount: string;
  transactionDate: string;
  disclosureDate: string;
  ptrLink: string;
  owner: string;
}

interface RealStockTradesProps {
  senatorName: string;
}

export function RealStockTrades({ senatorName }: RealStockTradesProps) {
  const [trades, setTrades] = useState<Trade[]>([]);
  const [stats, setStats] = useState({ total: 0, purchases: 0, sales: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Extract last name for search
    const lastName = senatorName.split(' ').pop() || senatorName;

    fetch(`/api/stock-trades/${encodeURIComponent(lastName)}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setTrades(data.trades || []);
          setStats(data.stats || { total: 0, purchases: 0, sales: 0 });
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load trades');
        setLoading(false);
      });
  }, [senatorName]);

  const formatAmount = (amount: string) => {
    // Parse FEC amount ranges like "$1,001 - $15,000"
    return amount || 'N/A';
  };

  const getTradeTypeColor = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('purchase')) return 'text-green-400 bg-green-500/10 border-green-500/20';
    if (t.includes('sale')) return 'text-red-400 bg-red-500/10 border-red-500/20';
    return 'text-blue-400 bg-blue-500/10 border-blue-500/20';
  };

  const getTradeIcon = (type: string) => {
    const t = type.toLowerCase();
    if (t.includes('purchase')) return <TrendingUp className="w-4 h-4" />;
    if (t.includes('sale')) return <TrendingDown className="w-4 h-4" />;
    return <TrendingUp className="w-4 h-4" />;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error || trades.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
          <TrendingUp className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-sm text-[#6b6b7a]">No STOCK Act trades found</p>
        <p className="text-xs text-[#3d3d4a] mt-1">This senator may not have filed trades</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Stats Row */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
          <p className="text-xl font-mono font-bold text-white">{stats.total}</p>
          <p className="text-[10px] text-[#6b6b7a] uppercase">Total Trades</p>
        </div>
        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10 text-center">
          <p className="text-xl font-mono font-bold text-green-400">{stats.purchases}</p>
          <p className="text-[10px] text-[#6b6b7a] uppercase">Purchases</p>
        </div>
        <div className="p-3 rounded-lg bg-red-500/5 border border-red-500/10 text-center">
          <p className="text-xl font-mono font-bold text-red-400">{stats.sales}</p>
          <p className="text-[10px] text-[#6b6b7a] uppercase">Sales</p>
        </div>
      </div>

      {/* Trade List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {trades.slice(0, 10).map((trade, index) => (
          <motion.div
            key={`${trade.ticker}-${trade.transactionDate}-${index}`}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-mono font-bold text-white">
                    {trade.ticker || 'N/A'}
                  </span>
                  <span className={cn('px-1.5 py-0.5 rounded text-[10px] font-medium border flex items-center gap-1', getTradeTypeColor(trade.type))}>
                    {getTradeIcon(trade.type)}
                    {trade.type}
                  </span>
                </div>
                <p className="text-xs text-[#a0a0aa] line-clamp-1">{trade.assetDescription}</p>
                <p className="text-xs text-[#6b6b7a] mt-1">
                  {new Date(trade.transactionDate).toLocaleDateString()} • {trade.owner}
                </p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-xs font-mono text-white">{formatAmount(trade.amount)}</p>
                {trade.ptrLink && (
                  <a
                    href={trade.ptrLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[10px] text-blue-400 hover:text-blue-300 flex items-center gap-1 mt-1 justify-end"
                  >
                    Filing <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {trades.length > 10 && (
        <p className="text-xs text-center text-[#6b6b7a]">
          Showing 10 of {trades.length} trades
        </p>
      )}

      {/* Data Source */}
      <p className="text-xs text-[#3d3d4a] text-center">
        Data from Senate Stock Watcher • STOCK Act Filings
      </p>
    </div>
  );
}
