'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DollarSign, TrendingUp, Wallet, CreditCard, Loader2 } from 'lucide-react';

interface FECData {
  receipts: number;
  disbursements: number;
  cashOnHand: number;
  debt: number;
  individualContributions: number;
  pacContributions: number;
  cycle: number;
}

interface FECFundraisingProps {
  fecId?: string;
}

export function FECFundraising({ fecId }: FECFundraisingProps) {
  const [data, setData] = useState<FECData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!fecId) {
      setLoading(false);
      return;
    }

    fetch(`/api/fec/${fecId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setData(data);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load FEC data');
        setLoading(false);
      });
  }, [fecId]);

  const formatMoney = (amount: number) => {
    if (amount >= 1000000) {
      return `$${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `$${(amount / 1000).toFixed(0)}K`;
    }
    return `$${amount.toFixed(0)}`;
  };

  if (!fecId) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
          <DollarSign className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-sm text-[#6b6b7a]">FEC ID not available</p>
        <p className="text-xs text-[#3d3d4a] mt-1">Link FEC candidate record to view</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-green-400 animate-spin" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
          <DollarSign className="w-6 h-6 text-green-400" />
        </div>
        <p className="text-sm text-[#6b6b7a]">Unable to load FEC data</p>
        <p className="text-xs text-[#3d3d4a] mt-1">{error}</p>
      </div>
    );
  }

  const stats = [
    {
      icon: TrendingUp,
      label: 'Total Raised',
      value: formatMoney(data.receipts),
      color: 'green',
    },
    {
      icon: CreditCard,
      label: 'Spent',
      value: formatMoney(data.disbursements),
      color: 'red',
    },
    {
      icon: Wallet,
      label: 'Cash on Hand',
      value: formatMoney(data.cashOnHand),
      color: 'blue',
    },
  ];

  return (
    <div className="space-y-4">
      {/* Main Stats */}
      <div className="grid grid-cols-3 gap-3">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center"
          >
            <stat.icon className={`w-5 h-5 mx-auto mb-2 text-${stat.color}-400`} />
            <p className="text-lg font-mono font-bold text-white">{stat.value}</p>
            <p className="text-[10px] text-[#6b6b7a] uppercase">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Breakdown */}
      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
        <h4 className="text-xs text-[#6b6b7a] uppercase mb-3">Contribution Sources</h4>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#a0a0aa]">Individual Contributions</span>
            <span className="text-sm font-mono text-white">{formatMoney(data.individualContributions)}</span>
          </div>
          <div className="w-full bg-white/[0.04] rounded-full h-2">
            <div
              className="bg-green-500 h-2 rounded-full"
              style={{
                width: `${data.receipts > 0 ? Math.min((data.individualContributions / data.receipts) * 100, 100) : 0}%`,
              }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-[#a0a0aa]">PAC Contributions</span>
            <span className="text-sm font-mono text-white">{formatMoney(data.pacContributions)}</span>
          </div>
          <div className="w-full bg-white/[0.04] rounded-full h-2">
            <div
              className="bg-amber-500 h-2 rounded-full"
              style={{
                width: `${data.receipts > 0 ? Math.min((data.pacContributions / data.receipts) * 100, 100) : 0}%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Cycle Info */}
      <p className="text-xs text-[#3d3d4a] text-center">
        2024 Election Cycle • Data from FEC.gov
      </p>
    </div>
  );
}
