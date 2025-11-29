'use client';

import { motion } from 'framer-motion';
import { DollarSign, Building2, Users, Briefcase } from 'lucide-react';
import { FundingGroup } from '@/lib/data';
import { cn } from '@/lib/utils';

interface FundingGroupsProps {
  groups: FundingGroup[];
}

export function FundingGroups({ groups }: FundingGroupsProps) {
  if (!groups || groups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
          <DollarSign className="w-6 h-6 text-blue-400" />
        </div>
        <p className="text-sm text-[#6b6b7a]">Funding data coming soon</p>
        <p className="text-xs text-[#3d3d4a] mt-1">Connect OpenSecrets API for donor info</p>
      </div>
    );
  }

  const getTypeIcon = (type: FundingGroup['type']) => {
    switch (type) {
      case 'PAC': return <Building2 className="w-4 h-4" />;
      case 'Super PAC': return <Briefcase className="w-4 h-4" />;
      case 'Industry': return <DollarSign className="w-4 h-4" />;
      default: return <Users className="w-4 h-4" />;
    }
  };

  const getTypeColor = (type: FundingGroup['type']) => {
    switch (type) {
      case 'PAC': return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'Super PAC': return 'bg-red-500/10 border-red-500/20 text-red-400';
      case 'Industry': return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default: return 'bg-green-500/10 border-green-500/20 text-green-400';
    }
  };

  // Sort by amount
  const sortedGroups = [...groups].sort((a, b) => {
    const aVal = parseFloat(a.amount.replace(/[^0-9.-]/g, '')) || 0;
    const bVal = parseFloat(b.amount.replace(/[^0-9.-]/g, '')) || 0;
    return bVal - aVal;
  });

  // Calculate max for bar width
  const maxAmount = Math.max(...sortedGroups.map(g => parseFloat(g.amount.replace(/[^0-9.-]/g, '')) || 0));

  return (
    <div className="space-y-3">
      {sortedGroups.map((group, index) => {
        const amount = parseFloat(group.amount.replace(/[^0-9.-]/g, '')) || 0;
        const barWidth = (amount / maxAmount) * 100;

        return (
          <motion.div
            key={group.name}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-amber-500/30 transition-colors overflow-hidden"
          >
            {/* Background bar */}
            <div
              className="absolute inset-y-0 left-0 bg-gradient-to-r from-amber-500/10 to-transparent"
              style={{ width: `${barWidth}%` }}
            />

            {/* Content */}
            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center border', getTypeColor(group.type))}>
                  {getTypeIcon(group.type)}
                </div>
                <div>
                  <div className="text-sm font-medium text-white">{group.name}</div>
                  <div className={cn('text-xs px-1.5 py-0.5 rounded border inline-block', getTypeColor(group.type))}>
                    {group.type}
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-bold font-mono text-amber-400">{group.amount}</div>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}
