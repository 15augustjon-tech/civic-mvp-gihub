'use client';

import { motion } from 'framer-motion';
import { Flame, CheckCircle, XCircle, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { VoteRecord } from '@/lib/data';

interface VotingStreakProps {
  recentVotes: VoteRecord[];
  attendance: number;
}

export function VotingStreak({ recentVotes, attendance }: VotingStreakProps) {
  // Calculate current streak (consecutive votes without missing)
  let streak = 0;
  for (const vote of recentVotes) {
    if (vote.vote !== 'ABSTAIN') {
      streak++;
    } else {
      break;
    }
  }

  // Calculate voting patterns
  const totalVotes = recentVotes.length;
  const yeaVotes = recentVotes.filter(v => v.vote === 'YEA').length;
  const nayVotes = recentVotes.filter(v => v.vote === 'NAY').length;
  const missedVotes = recentVotes.filter(v => v.vote === 'ABSTAIN').length;

  const getStreakLevel = () => {
    if (streak >= 20) return { label: 'On Fire', color: 'text-orange-400', bg: 'bg-orange-500/10', border: 'border-orange-500/20' };
    if (streak >= 10) return { label: 'Hot Streak', color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/20' };
    if (streak >= 5) return { label: 'Consistent', color: 'text-green-400', bg: 'bg-green-500/10', border: 'border-green-500/20' };
    return { label: 'Building', color: 'text-blue-400', bg: 'bg-blue-500/10', border: 'border-blue-500/20' };
  };

  const streakLevel = getStreakLevel();

  return (
    <div className="space-y-4">
      {/* Streak Display */}
      <div className={cn('p-4 rounded-lg border', streakLevel.bg, streakLevel.border)}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-lg flex items-center justify-center', streakLevel.bg)}>
              <Flame className={cn('w-5 h-5', streakLevel.color)} />
            </div>
            <div>
              <p className="text-sm text-[#6b6b7a]">Voting Streak</p>
              <p className={cn('text-2xl font-bold font-mono', streakLevel.color)}>{streak} votes</p>
            </div>
          </div>
          <div className={cn('px-3 py-1.5 rounded-full text-xs font-medium', streakLevel.bg, streakLevel.color)}>
            {streakLevel.label}
          </div>
        </div>
      </div>

      {/* Recent Votes Grid */}
      <div>
        <p className="text-xs text-[#6b6b7a] uppercase tracking-wide mb-2">Last 20 Votes</p>
        <div className="flex flex-wrap gap-1">
          {recentVotes.slice(0, 20).map((vote, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={cn(
                'w-6 h-6 rounded flex items-center justify-center',
                vote.vote === 'YEA'
                  ? 'bg-green-500/20 text-green-400'
                  : vote.vote === 'NAY'
                  ? 'bg-red-500/20 text-red-400'
                  : 'bg-white/[0.04] text-[#6b6b7a]'
              )}
              title={`${vote.bill}: ${vote.vote}`}
            >
              {vote.vote === 'YEA' ? (
                <CheckCircle className="w-3 h-3" />
              ) : vote.vote === 'NAY' ? (
                <XCircle className="w-3 h-3" />
              ) : (
                <Minus className="w-3 h-3" />
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-4 gap-2">
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
          <p className="text-lg font-mono font-bold text-white">{totalVotes}</p>
          <p className="text-[10px] text-[#6b6b7a] uppercase">Total</p>
        </div>
        <div className="p-2 rounded-lg bg-green-500/5 border border-green-500/10 text-center">
          <p className="text-lg font-mono font-bold text-green-400">{yeaVotes}</p>
          <p className="text-[10px] text-[#6b6b7a] uppercase">Yea</p>
        </div>
        <div className="p-2 rounded-lg bg-red-500/5 border border-red-500/10 text-center">
          <p className="text-lg font-mono font-bold text-red-400">{nayVotes}</p>
          <p className="text-[10px] text-[#6b6b7a] uppercase">Nay</p>
        </div>
        <div className="p-2 rounded-lg bg-white/[0.02] border border-white/[0.04] text-center">
          <p className="text-lg font-mono font-bold text-[#6b6b7a]">{missedVotes}</p>
          <p className="text-[10px] text-[#6b6b7a] uppercase">Missed</p>
        </div>
      </div>

      {/* Attendance */}
      <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-[#6b6b7a]">Attendance Rate</span>
          <span className={cn(
            'text-sm font-mono font-bold',
            attendance >= 95 ? 'text-green-400' :
            attendance >= 85 ? 'text-amber-400' : 'text-red-400'
          )}>
            {attendance}%
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${attendance}%` }}
            transition={{ duration: 0.8 }}
            className={cn(
              'h-full rounded-full',
              attendance >= 95 ? 'bg-green-500' :
              attendance >= 85 ? 'bg-amber-500' : 'bg-red-500'
            )}
          />
        </div>
      </div>
    </div>
  );
}
