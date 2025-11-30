'use client';

import { motion } from 'framer-motion';
import { FileText, CheckCircle, XCircle, Clock, Users } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Bill {
  id: string;
  title: string;
  description: string;
  status: 'Introduced' | 'Committee' | 'Floor Vote' | 'Passed' | 'Failed';
  date: string;
  sponsor: string;
  yeas: number;
  nays: number;
  category: string;
}

// Sample bills for demonstration
const sampleBills: Bill[] = [
  {
    id: 'S.1234',
    title: 'STOCK Act Enhancement Act',
    description: 'Strengthens stock trading disclosure requirements for members of Congress',
    status: 'Committee',
    date: '2024-11-15',
    sponsor: 'Sen. Warren',
    yeas: 0,
    nays: 0,
    category: 'Ethics',
  },
  {
    id: 'H.R.5678',
    title: 'Government Transparency Act',
    description: 'Requires real-time disclosure of financial transactions',
    status: 'Floor Vote',
    date: '2024-11-10',
    sponsor: 'Rep. Ocasio-Cortez',
    yeas: 218,
    nays: 205,
    category: 'Ethics',
  },
  {
    id: 'S.2468',
    title: 'Defense Authorization Act',
    description: 'Annual defense spending and policy authorization',
    status: 'Passed',
    date: '2024-11-05',
    sponsor: 'Sen. Reed',
    yeas: 83,
    nays: 11,
    category: 'Defense',
  },
];

export function BillTracker() {
  const getStatusIcon = (status: Bill['status']) => {
    switch (status) {
      case 'Passed': return <CheckCircle className="w-4 h-4 text-green-400" />;
      case 'Failed': return <XCircle className="w-4 h-4 text-red-400" />;
      case 'Floor Vote': return <Users className="w-4 h-4 text-amber-400" />;
      default: return <Clock className="w-4 h-4 text-blue-400" />;
    }
  };

  const getStatusColor = (status: Bill['status']) => {
    switch (status) {
      case 'Passed': return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'Failed': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'Floor Vote': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default: return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Ethics': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
      'Defense': 'bg-red-500/10 text-red-400 border-red-500/20',
      'Healthcare': 'bg-green-500/10 text-green-400 border-green-500/20',
      'Immigration': 'bg-orange-500/10 text-orange-400 border-orange-500/20',
      'Environment': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    };
    return colors[category] || 'bg-blue-500/10 text-blue-400 border-blue-500/20';
  };

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <FileText className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Bill Tracker</h3>
            <p className="text-xs text-[#6b6b7a]">Recent legislation activity</p>
          </div>
        </div>
        <div className="text-xs text-[#3d3d4a] font-mono">
          {sampleBills.length} ACTIVE BILLS
        </div>
      </div>

      {/* Bills List */}
      <div className="space-y-3">
        {sampleBills.map((bill, index) => (
          <motion.div
            key={bill.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="group p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-amber-500/30 transition-all cursor-pointer"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs font-mono text-[#3d3d4a]">{bill.id.toUpperCase()}</span>
                  <span className={cn('px-2 py-0.5 rounded-full text-[10px] font-medium border', getCategoryColor(bill.category))}>
                    {bill.category}
                  </span>
                </div>
                <h4 className="text-sm font-medium text-white mb-1 group-hover:text-amber-400 transition-colors">
                  {bill.title}
                </h4>
                <p className="text-xs text-[#6b6b7a] line-clamp-1">{bill.description}</p>
                <div className="flex items-center gap-3 mt-2 text-xs text-[#3d3d4a]">
                  <span>Sponsor: <span className="text-[#6b6b7a]">{bill.sponsor}</span></span>
                  <span>•</span>
                  <span>{bill.date}</span>
                </div>
              </div>

              <div className="flex flex-col items-end gap-2">
                <div className={cn('flex items-center gap-1.5 px-2 py-1 rounded-lg border text-xs font-medium', getStatusColor(bill.status))}>
                  {getStatusIcon(bill.status)}
                  {bill.status}
                </div>
                {bill.yeas > 0 && (
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-green-400 font-mono">{bill.yeas} YEA</span>
                    <span className="text-[#3d3d4a]">|</span>
                    <span className="text-red-400 font-mono">{bill.nays} NAY</span>
                  </div>
                )}
              </div>
            </div>

            {/* Vote Progress Bar */}
            {bill.yeas > 0 && (
              <div className="mt-3 h-1.5 rounded-full bg-[#1a1a24] overflow-hidden flex">
                <div
                  className="h-full bg-green-500"
                  style={{ width: `${(bill.yeas / (bill.yeas + bill.nays)) * 100}%` }}
                />
                <div
                  className="h-full bg-red-500"
                  style={{ width: `${(bill.nays / (bill.yeas + bill.nays)) * 100}%` }}
                />
              </div>
            )}
          </motion.div>
        ))}
      </div>

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,158,11,0.05) 2px, rgba(245,158,11,0.05) 4px)',
          }}
        />
      </div>
    </div>
  );
}
