'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, Vote, Calendar, ChevronRight } from 'lucide-react';
import Link from 'next/link';
import { Senator } from '@/lib/data';
import { SenatorPhoto } from '@/components/SenatorPhoto';
import { cn, getPartyColor, getPartyBgClass } from '@/lib/utils';

interface PoliticianCardProps {
  senator: Senator;
  index: number;
}

export function PoliticianCard({ senator, index }: PoliticianCardProps) {
  const hasConflicts = senator.conflicts.length > 0;
  const partyColor = getPartyColor(senator.party);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.5, ease: 'easeOut' }}
    >
      <Link href={`/politician/${senator.id}`}>
        <div
          className={cn(
            'group relative overflow-hidden rounded-xl',
            'bg-[#0a0a0f]/80 backdrop-blur-xl',
            'border border-white/[0.06]',
            'hover:border-blue-500/30',
            'transition-all duration-300 ease-out',
            'hover:shadow-[0_0_40px_rgba(59,130,246,0.12)]',
            'hover:translate-y-[-2px]',
            'cursor-pointer'
          )}
        >
          {/* Scan line effect on hover */}
          <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 overflow-hidden pointer-events-none">
            <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 via-transparent to-transparent animate-pulse" />
          </div>

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Content */}
          <div className="relative p-6">
            {/* Header */}
            <div className="flex items-start gap-4">
              {/* Photo with party ring */}
              <div className="relative shrink-0">
                <div
                  className="w-16 h-16 rounded-full overflow-hidden transition-all duration-300 group-hover:scale-105"
                  style={{
                    boxShadow: `0 0 0 2px ${partyColor}, 0 0 20px ${partyColor}30`,
                  }}
                >
                  <SenatorPhoto
                    src={senator.photo}
                    alt={senator.name}
                    size={64}
                    party={senator.party}
                    className="w-full h-full rounded-full"
                  />
                </div>
                {/* Party indicator dot */}
                <div
                  className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-2 border-[#0a0a0f] flex items-center justify-center text-[10px] font-bold text-white"
                  style={{ backgroundColor: partyColor }}
                >
                  {senator.party}
                </div>
              </div>

              {/* Name and info */}
              <div className="flex-1 min-w-0">
                <h3 className="text-lg font-semibold text-white truncate group-hover:text-blue-400 transition-colors">
                  {senator.name}
                </h3>
                <p className="text-sm text-[#6b6b7a]">
                  {senator.state} • Since {senator.since}
                </p>
                {/* Party badge */}
                <div className={cn('inline-flex items-center mt-2 px-2 py-0.5 rounded text-xs font-medium border', getPartyBgClass(senator.party))}>
                  {senator.party === 'R' ? 'Republican' : senator.party === 'D' ? 'Democrat' : 'Independent'}
                </div>
              </div>

              {/* Conflict badge */}
              {hasConflicts && (
                <div className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center gap-1.5 animate-pulse">
                  <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400 font-mono">
                    {senator.conflicts.length}
                  </span>
                </div>
              )}
            </div>

            {/* Stats Grid */}
            <div className="mt-6 grid grid-cols-4 gap-2">
              <StatBox
                icon={<span className="text-base">💰</span>}
                value={senator.netWorth}
                label="Net Worth"
              />
              <StatBox
                icon={<TrendingUp className="w-4 h-4 text-blue-400" />}
                value={senator.stockTrades.toString()}
                label="Trades"
                highlight={senator.stockTrades > 50}
              />
              <StatBox
                icon={<Vote className="w-4 h-4 text-[#6b6b7a]" />}
                value={`${senator.partyVotes}%`}
                label="Party Line"
              />
              <StatBox
                icon={<Calendar className="w-4 h-4 text-[#6b6b7a]" />}
                value={`${senator.attendance}%`}
                label="Attendance"
                warning={senator.attendance < 85}
              />
            </div>

            {/* Conflict preview */}
            {hasConflicts && (
              <div className="mt-4 p-3 rounded-lg bg-red-500/5 border border-red-500/10">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-4 h-4 text-red-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-red-300/80 line-clamp-2 leading-relaxed">
                    {senator.conflicts[0]}
                  </p>
                </div>
              </div>
            )}

            {/* Recent trades preview */}
            {senator.recentTrades.length > 0 && (
              <div className="mt-4 pt-4 border-t border-white/[0.04]">
                <div className="flex items-center justify-between text-xs text-[#6b6b7a] mb-2">
                  <span>Latest Trade</span>
                  <span className="font-mono">{senator.recentTrades[0].date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      'px-1.5 py-0.5 rounded text-[10px] font-bold',
                      senator.recentTrades[0].type === 'BUY'
                        ? 'bg-red-500/20 text-red-400'
                        : 'bg-green-500/20 text-green-400'
                    )}
                  >
                    {senator.recentTrades[0].type}
                  </span>
                  <span className="font-mono text-sm text-white font-semibold">
                    {senator.recentTrades[0].ticker}
                  </span>
                  <span className="text-xs text-[#6b6b7a]">
                    {senator.recentTrades[0].amount}
                  </span>
                </div>
              </div>
            )}

            {/* Hover CTA */}
            <div className="mt-4 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0">
              <span className="text-sm text-blue-400 font-medium">View Full Dossier</span>
              <ChevronRight className="w-4 h-4 text-blue-400" />
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

function StatBox({
  icon,
  value,
  label,
  highlight = false,
  warning = false,
}: {
  icon: React.ReactNode;
  value: string;
  label: string;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={cn(
        'text-center p-2 rounded-lg transition-colors',
        highlight
          ? 'bg-amber-500/10'
          : warning
          ? 'bg-red-500/5'
          : 'bg-white/[0.02]'
      )}
    >
      <div className="flex justify-center mb-1">{icon}</div>
      <div
        className={cn(
          'text-sm font-semibold font-mono',
          highlight ? 'text-amber-400' : warning ? 'text-red-400' : 'text-white'
        )}
      >
        {value}
      </div>
      <div className="text-[10px] text-[#6b6b7a] uppercase tracking-wide">{label}</div>
    </div>
  );
}
