'use client';

import { VoteRecord } from '@/lib/data';
import { motion } from 'framer-motion';
import { ThumbsUp, ThumbsDown, Minus, Vote } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VotingRecordChartProps {
  votes: VoteRecord[];
  partyVotes: number;
}

export function VotingRecordChart({ votes, partyVotes }: VotingRecordChartProps) {
  const yeaVotes = votes.filter(v => v.vote === 'YEA').length;
  const nayVotes = votes.filter(v => v.vote === 'NAY').length;
  const abstainVotes = votes.filter(v => v.vote === 'ABSTAIN').length;
  const total = votes.length || 1;

  const yeaPercent = Math.round((yeaVotes / total) * 100);
  const nayPercent = Math.round((nayVotes / total) * 100);

  return (
    <div className="space-y-6">
      {/* Party Line Voting */}
      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm text-[#6b6b7a]">Party Line Voting</span>
          <span className="text-lg font-bold font-mono text-white">{partyVotes}%</span>
        </div>
        <div className="h-2 rounded-full bg-[#1a1a24] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${partyVotes}%` }}
            transition={{ duration: 1, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              partyVotes > 90 ? 'bg-red-500' : partyVotes > 75 ? 'bg-amber-500' : 'bg-green-500'
            )}
          />
        </div>
        <p className="text-xs text-[#3d3d4a] mt-2">
          {partyVotes > 90 ? 'Highly partisan voting record' :
           partyVotes > 75 ? 'Generally votes with party' :
           'Independent voting patterns'}
        </p>
      </div>

      {/* Vote Breakdown */}
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 text-center">
          <ThumbsUp className="w-5 h-5 text-green-400 mx-auto mb-2" />
          <div className="text-xl font-bold font-mono text-green-400">{yeaVotes}</div>
          <div className="text-xs text-[#6b6b7a]">YEA ({yeaPercent}%)</div>
        </div>
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-center">
          <ThumbsDown className="w-5 h-5 text-red-400 mx-auto mb-2" />
          <div className="text-xl font-bold font-mono text-red-400">{nayVotes}</div>
          <div className="text-xs text-[#6b6b7a]">NAY ({nayPercent}%)</div>
        </div>
        <div className="p-3 rounded-lg bg-gray-500/10 border border-gray-500/20 text-center">
          <Minus className="w-5 h-5 text-gray-400 mx-auto mb-2" />
          <div className="text-xl font-bold font-mono text-gray-400">{abstainVotes}</div>
          <div className="text-xs text-[#6b6b7a]">ABSTAIN</div>
        </div>
      </div>

      {/* Recent Votes */}
      {votes.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-2 mb-3">
            <Vote className="w-4 h-4 text-[#6b6b7a]" />
            <span className="text-sm text-[#6b6b7a]">Recent Votes</span>
          </div>
          {votes.slice(0, 5).map((vote, index) => (
            <motion.div
              key={`${vote.date}-${vote.bill}`}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'p-3 rounded-lg border flex items-center justify-between',
                vote.vote === 'YEA'
                  ? 'bg-green-500/5 border-green-500/20'
                  : vote.vote === 'NAY'
                  ? 'bg-red-500/5 border-red-500/20'
                  : 'bg-gray-500/5 border-gray-500/20'
              )}
            >
              <div className="flex-1 min-w-0">
                <div className="text-sm font-medium text-white truncate">{vote.bill}</div>
                <div className="text-xs text-[#6b6b7a] truncate">{vote.description}</div>
              </div>
              <div className="flex items-center gap-2 ml-3">
                <span className="text-xs text-[#3d3d4a] font-mono">{vote.date}</span>
                <span className={cn(
                  'px-2 py-0.5 rounded text-xs font-bold',
                  vote.vote === 'YEA' ? 'bg-green-500/20 text-green-400' :
                  vote.vote === 'NAY' ? 'bg-red-500/20 text-red-400' :
                  'bg-gray-500/20 text-gray-400'
                )}>
                  {vote.vote}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
