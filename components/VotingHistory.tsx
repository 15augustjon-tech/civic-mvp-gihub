'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Vote,
  CheckCircle2,
  XCircle,
  MinusCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
  Users,
  TrendingUp,
  Calendar,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface VoteRecord {
  rollCallNumber: number;
  date: string;
  question: string;
  result: string;
  description: string;
  billNumber?: string;
  billTitle?: string;
  memberVote: 'Yea' | 'Nay' | 'Not Voting' | 'Present';
  partyVote: {
    democratic: { yea: number; nay: number };
    republican: { yea: number; nay: number };
  };
}

interface Statistics {
  totalVotes: number;
  yeaVotes: number;
  nayVotes: number;
  missedVotes: number;
  participationRate: number;
}

interface VotingHistoryProps {
  bioguideId: string;
  party: 'R' | 'D' | 'I';
}

export function VotingHistory({ bioguideId, party }: VotingHistoryProps) {
  const [votes, setVotes] = useState<VoteRecord[]>([]);
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(false);
  const [filter, setFilter] = useState<'all' | 'yea' | 'nay' | 'missed'>('all');

  useEffect(() => {
    fetch(`/api/votes/${bioguideId}`)
      .then(res => res.json())
      .then(data => {
        setVotes(data.votes || []);
        setStatistics(data.statistics || null);
        if (data.error) setError(data.error);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load voting history');
        setLoading(false);
      });
  }, [bioguideId]);

  const getVoteIcon = (vote: string) => {
    switch (vote) {
      case 'Yea':
        return <CheckCircle2 className="w-4 h-4 text-green-400" />;
      case 'Nay':
        return <XCircle className="w-4 h-4 text-red-400" />;
      default:
        return <MinusCircle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getVoteColor = (vote: string) => {
    switch (vote) {
      case 'Yea':
        return 'bg-green-500/10 border-green-500/20 text-green-400';
      case 'Nay':
        return 'bg-red-500/10 border-red-500/20 text-red-400';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  const calculatePartyAlignment = (vote: VoteRecord) => {
    const partyData = party === 'D' ? vote.partyVote.democratic : vote.partyVote.republican;
    const totalPartyVotes = partyData.yea + partyData.nay;
    if (totalPartyVotes === 0) return null;

    const partyMajorityVote = partyData.yea > partyData.nay ? 'Yea' : 'Nay';
    const alignedWithParty = vote.memberVote === partyMajorityVote;

    return {
      aligned: alignedWithParty,
      partyMajority: partyMajorityVote,
      percentage: Math.round((Math.max(partyData.yea, partyData.nay) / totalPartyVotes) * 100)
    };
  };

  const filteredVotes = votes.filter(vote => {
    if (filter === 'all') return true;
    if (filter === 'yea') return vote.memberVote === 'Yea';
    if (filter === 'nay') return vote.memberVote === 'Nay';
    if (filter === 'missed') return vote.memberVote === 'Not Voting';
    return true;
  });

  const displayVotes = expanded ? filteredVotes : filteredVotes.slice(0, 5);

  // Calculate party alignment rate
  const partyAlignmentRate = votes.length > 0
    ? Math.round(
        (votes.filter(v => {
          const alignment = calculatePartyAlignment(v);
          return alignment?.aligned;
        }).length / votes.filter(v => v.memberVote !== 'Not Voting').length) * 100
      )
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics Cards */}
      {statistics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 rounded-xl bg-green-500/5 border border-green-500/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-400" />
              <span className="text-xs text-green-400/70">Yea Votes</span>
            </div>
            <p className="text-2xl font-bold text-green-400">{statistics.yeaVotes}</p>
            <p className="text-xs text-[#6b6b7a]">
              {statistics.totalVotes > 0 ? Math.round((statistics.yeaVotes / statistics.totalVotes) * 100) : 0}% of votes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-4 rounded-xl bg-red-500/5 border border-red-500/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <XCircle className="w-4 h-4 text-red-400" />
              <span className="text-xs text-red-400/70">Nay Votes</span>
            </div>
            <p className="text-2xl font-bold text-red-400">{statistics.nayVotes}</p>
            <p className="text-xs text-[#6b6b7a]">
              {statistics.totalVotes > 0 ? Math.round((statistics.nayVotes / statistics.totalVotes) * 100) : 0}% of votes
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10"
          >
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-blue-400" />
              <span className="text-xs text-blue-400/70">Participation</span>
            </div>
            <p className="text-2xl font-bold text-blue-400">{statistics.participationRate}%</p>
            <p className="text-xs text-[#6b6b7a]">
              {statistics.missedVotes} votes missed
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className={cn(
              "p-4 rounded-xl border",
              party === 'D' ? 'bg-blue-500/5 border-blue-500/10' : 'bg-red-500/5 border-red-500/10'
            )}
          >
            <div className="flex items-center gap-2 mb-2">
              <Users className={cn("w-4 h-4", party === 'D' ? 'text-blue-400' : 'text-red-400')} />
              <span className={cn("text-xs", party === 'D' ? 'text-blue-400/70' : 'text-red-400/70')}>
                Party Alignment
              </span>
            </div>
            <p className={cn("text-2xl font-bold", party === 'D' ? 'text-blue-400' : 'text-red-400')}>
              {partyAlignmentRate}%
            </p>
            <p className="text-xs text-[#6b6b7a]">
              Votes with {party === 'D' ? 'Democrats' : party === 'R' ? 'Republicans' : 'Party'}
            </p>
          </motion.div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex gap-2">
        {(['all', 'yea', 'nay', 'missed'] as const).map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-all',
              filter === f
                ? 'bg-white/10 text-white'
                : 'text-[#6b6b7a] hover:text-white hover:bg-white/5'
            )}
          >
            {f === 'all' && 'All Votes'}
            {f === 'yea' && 'Yea'}
            {f === 'nay' && 'Nay'}
            {f === 'missed' && 'Missed'}
          </button>
        ))}
      </div>

      {/* Votes List */}
      <div className="space-y-3">
        {displayVotes.map((vote, index) => {
          const alignment = calculatePartyAlignment(vote);

          return (
            <motion.div
              key={vote.rollCallNumber}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-all"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-mono text-[#6b6b7a]">
                      Roll #{vote.rollCallNumber}
                    </span>
                    <span className="text-xs text-[#3d3d4a]">•</span>
                    <span className="text-xs text-[#6b6b7a] flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(vote.date).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                  </div>

                  <h4 className="text-sm font-medium text-white mb-1">
                    {vote.question}
                  </h4>

                  {vote.billNumber && (
                    <div className="flex items-center gap-2 mb-1">
                      <FileText className="w-3 h-3 text-[#6b6b7a]" />
                      <span className="text-xs text-[#a0a0aa]">
                        {vote.billNumber}: {vote.billTitle || vote.description}
                      </span>
                    </div>
                  )}

                  <p className="text-xs text-[#6b6b7a] line-clamp-1">
                    Result: <span className="text-[#a0a0aa]">{vote.result}</span>
                  </p>
                </div>

                <div className="flex flex-col items-end gap-2">
                  {/* Member's vote */}
                  <div className={cn(
                    'flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium',
                    getVoteColor(vote.memberVote)
                  )}>
                    {getVoteIcon(vote.memberVote)}
                    {vote.memberVote}
                  </div>

                  {/* Party alignment indicator */}
                  {alignment && vote.memberVote !== 'Not Voting' && (
                    <div className={cn(
                      'text-xs px-2 py-0.5 rounded',
                      alignment.aligned
                        ? 'bg-green-500/10 text-green-400'
                        : 'bg-amber-500/10 text-amber-400'
                    )}>
                      {alignment.aligned ? 'With party' : 'Against party'}
                    </div>
                  )}
                </div>
              </div>

              {/* Party Vote Breakdown */}
              <div className="mt-3 pt-3 border-t border-white/[0.04]">
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-blue-400">Democrats</span>
                      <span className="text-[#6b6b7a]">
                        {vote.partyVote.democratic.yea}Y - {vote.partyVote.democratic.nay}N
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-blue-500"
                        style={{
                          width: `${(vote.partyVote.democratic.yea / (vote.partyVote.democratic.yea + vote.partyVote.democratic.nay || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-red-400">Republicans</span>
                      <span className="text-[#6b6b7a]">
                        {vote.partyVote.republican.yea}Y - {vote.partyVote.republican.nay}N
                      </span>
                    </div>
                    <div className="h-1.5 bg-[#1a1a24] rounded-full overflow-hidden flex">
                      <div
                        className="h-full bg-red-500"
                        style={{
                          width: `${(vote.partyVote.republican.yea / (vote.partyVote.republican.yea + vote.partyVote.republican.nay || 1)) * 100}%`
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Show More/Less */}
      {filteredVotes.length > 5 && (
        <button
          onClick={() => setExpanded(!expanded)}
          className="w-full py-3 rounded-xl bg-white/[0.02] border border-white/[0.06] text-sm text-[#a0a0aa] hover:text-white hover:bg-white/[0.04] transition-all flex items-center justify-center gap-2"
        >
          {expanded ? (
            <>
              Show Less <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              Show All {filteredVotes.length} Votes <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>
      )}

      {votes.length === 0 && !error && (
        <div className="text-center py-8">
          <Vote className="w-10 h-10 text-[#3d3d4a] mx-auto mb-3" />
          <p className="text-sm text-[#6b6b7a]">No voting records available</p>
        </div>
      )}
    </div>
  );
}
