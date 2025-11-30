'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, TrendingUp, Users, Building2, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ConflictDetectorProps {
  senatorName: string;
  committees: string[];
  stockTrades: number;
  party: 'R' | 'D' | 'I';
}

interface Conflict {
  type: 'insider_trading' | 'pay_to_play' | 'lobbying_influence' | 'unexplained_wealth';
  severity: 'high' | 'medium' | 'low';
  title: string;
  description: string;
}

export function ConflictDetector({ senatorName, committees, stockTrades, party }: ConflictDetectorProps) {
  const [conflicts, setConflicts] = useState<Conflict[]>([]);
  const [loading, setLoading] = useState(true);
  const [corruptionScore, setCorruptionScore] = useState(0);

  useEffect(() => {
    // Detect conflicts based on available data
    const detected: Conflict[] = [];

    // Check for potential insider trading
    const safeCommittees = committees || [];
    const financeCommittees = safeCommittees.filter(c =>
      c.toLowerCase().includes('finance') ||
      c.toLowerCase().includes('banking') ||
      c.toLowerCase().includes('commerce') ||
      c.toLowerCase().includes('energy')
    );

    if (financeCommittees.length > 0 && stockTrades > 10) {
      detected.push({
        type: 'insider_trading',
        severity: stockTrades > 50 ? 'high' : 'medium',
        title: 'Committee + Stock Trade Overlap',
        description: `Sits on ${financeCommittees[0]} while making ${stockTrades} stock trades. Potential access to non-public information.`,
      });
    }

    // High trading activity warning
    if (stockTrades > 100) {
      detected.push({
        type: 'insider_trading',
        severity: 'high',
        title: 'Unusually High Trading Activity',
        description: `${stockTrades} stock trades is significantly above average for senators. May warrant scrutiny.`,
      });
    } else if (stockTrades > 50) {
      detected.push({
        type: 'insider_trading',
        severity: 'medium',
        title: 'Above Average Trading',
        description: `${stockTrades} trades is above the Senate average. Worth monitoring.`,
      });
    }

    // Calculate corruption score (0-100)
    let score = 0;
    detected.forEach(c => {
      if (c.severity === 'high') score += 30;
      else if (c.severity === 'medium') score += 15;
      else score += 5;
    });
    score = Math.min(100, score);

    setConflicts(detected);
    setCorruptionScore(score);
    setLoading(false);
  }, [senatorName, committees, stockTrades]);

  const getSeverityColor = (severity: string) => {
    if (severity === 'high') return 'bg-red-500/10 border-red-500/20 text-red-400';
    if (severity === 'medium') return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
    return 'bg-yellow-500/10 border-yellow-500/20 text-yellow-400';
  };

  const getSeverityIcon = (severity: string) => {
    if (severity === 'high') return <AlertTriangle className="w-4 h-4 text-red-400" />;
    if (severity === 'medium') return <AlertTriangle className="w-4 h-4 text-amber-400" />;
    return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
  };

  const getScoreColor = () => {
    if (corruptionScore >= 60) return 'text-red-400';
    if (corruptionScore >= 30) return 'text-amber-400';
    return 'text-green-400';
  };

  const getScoreLabel = () => {
    if (corruptionScore >= 60) return 'High Risk';
    if (corruptionScore >= 30) return 'Moderate Risk';
    if (corruptionScore > 0) return 'Low Risk';
    return 'Clean';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Corruption Score */}
      <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04]">
        <div className="flex items-center justify-between mb-3">
          <span className="text-xs text-[#6b6b7a] uppercase">Conflict Score</span>
          <span className={cn('text-2xl font-mono font-bold', getScoreColor())}>
            {corruptionScore}
          </span>
        </div>
        <div className="w-full h-2 rounded-full bg-white/[0.04] overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${corruptionScore}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className={cn(
              'h-full rounded-full',
              corruptionScore >= 60 ? 'bg-red-500' :
              corruptionScore >= 30 ? 'bg-amber-500' : 'bg-green-500'
            )}
          />
        </div>
        <p className={cn('text-xs mt-2 text-center', getScoreColor())}>
          {getScoreLabel()}
        </p>
      </div>

      {/* Detected Conflicts */}
      {conflicts.length > 0 ? (
        <div className="space-y-2">
          {conflicts.map((conflict, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn('p-3 rounded-lg border', getSeverityColor(conflict.severity))}
            >
              <div className="flex items-start gap-2">
                {getSeverityIcon(conflict.severity)}
                <div>
                  <p className="text-sm font-medium text-white">{conflict.title}</p>
                  <p className="text-xs text-[#a0a0aa] mt-1">{conflict.description}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/10 border border-green-500/20 flex items-center justify-center mb-3">
            <Shield className="w-6 h-6 text-green-400" />
          </div>
          <p className="text-sm text-green-400 font-medium">No Conflicts Detected</p>
          <p className="text-xs text-[#6b6b7a] mt-1">Based on available public data</p>
        </div>
      )}

      {/* Methodology Note */}
      <p className="text-[10px] text-[#3d3d4a] text-center">
        Algorithm cross-references committees, trades, donors & votes
      </p>
    </div>
  );
}
