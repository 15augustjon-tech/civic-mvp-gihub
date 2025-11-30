'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ConflictBlip {
  senatorName: string;
  senatorId: string;
  conflict: string;
  severity: 'high' | 'medium' | 'low';
  tradeCount: number;
}

export function ConflictRadar() {
  const [blips, setBlips] = useState<ConflictBlip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Fetch trade data and generate conflicts based on trading activity
    Promise.all([
      fetch('/api/stock-trades').then(res => res.json()),
      fetch('/api/senators').then(res => res.json())
    ])
      .then(([tradesData, senators]) => {
        const trades = tradesData.trades || [];

        // Count trades per senator and track recent activity
        const traderStats: Record<string, { count: number; tickers: Set<string>; types: Set<string> }> = {};

        trades.forEach((trade: any) => {
          const name = trade.senator;
          if (name) {
            if (!traderStats[name]) {
              traderStats[name] = { count: 0, tickers: new Set(), types: new Set() };
            }
            traderStats[name].count++;
            if (trade.ticker) traderStats[name].tickers.add(trade.ticker);
            if (trade.type) traderStats[name].types.add(trade.type.toLowerCase());
          }
        });

        // Generate conflict blips based on trading activity
        const conflictBlips: ConflictBlip[] = Object.entries(traderStats)
          .filter(([_, stats]) => stats.count >= 3) // Only show traders with 3+ trades
          .map(([name, stats]) => {
            // Try to find matching senator for ID
            const senator = senators.find((s: any) =>
              s.name.toLowerCase().includes(name.split(' ').pop()?.toLowerCase() || '')
            );

            // Determine severity based on trade count
            let severity: 'high' | 'medium' | 'low';
            let conflict: string;

            if (stats.count >= 20) {
              severity = 'high';
              conflict = `High trading volume: ${stats.count} trades across ${stats.tickers.size} securities`;
            } else if (stats.count >= 10) {
              severity = 'medium';
              conflict = `Active trader: ${stats.count} stock transactions disclosed`;
            } else {
              severity = 'low';
              conflict = `${stats.count} trades in ${stats.tickers.size} different securities`;
            }

            return {
              senatorName: name,
              senatorId: senator?.id || name.toLowerCase().replace(/\s+/g, '-'),
              conflict,
              severity,
              tradeCount: stats.count,
            };
          })
          .sort((a, b) => b.tradeCount - a.tradeCount)
          .slice(0, 10); // Top 10 traders as potential conflicts

        setBlips(conflictBlips);
        setLoading(false);
      })
      .catch(err => {
        console.error('Failed to fetch conflict data:', err);
        setLoading(false);
      });
  }, []);

  const highSeverityBlips = blips.filter((b) => b.severity === 'high');
  const displayBlips = highSeverityBlips.length > 0 ? highSeverityBlips : blips.slice(0, 5);

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white">Conflict Radar</h3>
            <p className="text-xs text-[#6b6b7a]">
              {loading ? 'Scanning...' : `${blips.length} potential conflicts detected`}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium text-red-400">LIVE</span>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="w-6 h-6 text-amber-400 animate-spin" />
        </div>
      ) : (
        /* Radar visualization */
        <div className="relative flex items-center gap-6">
          {/* Radar circle */}
          <div className="relative w-48 h-48 shrink-0">
            {/* Radar rings */}
            <div className="absolute inset-0 rounded-full border border-amber-500/10" />
            <div className="absolute inset-4 rounded-full border border-amber-500/10" />
            <div className="absolute inset-8 rounded-full border border-amber-500/10" />
            <div className="absolute inset-12 rounded-full border border-amber-500/10" />

            {/* Center dot */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-3 h-3 rounded-full bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]" />
            </div>

            {/* Sweep line */}
            <div className="absolute inset-0 animate-radar">
              <div
                className="absolute top-1/2 left-1/2 w-1/2 h-0.5 origin-left"
                style={{
                  background: 'linear-gradient(90deg, rgba(245,158,11,0.8), transparent)',
                }}
              />
            </div>

            {/* Sweep glow */}
            <div className="absolute inset-0 animate-radar">
              <div
                className="absolute top-0 left-1/2 w-1/2 h-1/2 origin-bottom-left"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(245,158,11,0.1) 0deg, transparent 60deg)',
                }}
              />
            </div>

            {/* Blips */}
            {displayBlips.slice(0, 4).map((blip, index) => {
              // Position blips around the radar
              const angle = (index * 90 + 45) * (Math.PI / 180);
              const radius = 30 + (index % 2) * 20;
              const x = 50 + Math.cos(angle) * radius;
              const y = 50 + Math.sin(angle) * radius;

              return (
                <motion.div
                  key={`${blip.senatorId}-${index}`}
                  initial={{ opacity: 0, scale: 0 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.2 }}
                  className="absolute w-3 h-3"
                  style={{
                    left: `${x}%`,
                    top: `${y}%`,
                    transform: 'translate(-50%, -50%)',
                  }}
                >
                  <div
                    className={cn(
                      'w-full h-full rounded-full',
                      blip.severity === 'high'
                        ? 'bg-red-500 shadow-[0_0_8px_rgba(239,68,68,0.6)]'
                        : blip.severity === 'medium'
                        ? 'bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]'
                        : 'bg-yellow-500 shadow-[0_0_8px_rgba(234,179,8,0.6)]'
                    )}
                  />
                  <div
                    className={cn(
                      'absolute inset-0 rounded-full animate-ping',
                      blip.severity === 'high' ? 'bg-red-500/50' : 'bg-amber-500/50'
                    )}
                  />
                </motion.div>
              );
            })}
          </div>

          {/* Conflict list */}
          <div className="flex-1 space-y-3 max-h-48 overflow-y-auto pr-2">
            {displayBlips.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#6b6b7a] text-sm">No conflicts detected</p>
              </div>
            ) : (
              displayBlips.slice(0, 5).map((blip, index) => (
                <motion.div
                  key={`list-${blip.senatorId}-${index}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                >
                  <Link href={`/politician/${blip.senatorId}`}>
                    <div
                      className={cn(
                        'p-3 rounded-lg border transition-all hover:translate-x-1',
                        blip.severity === 'high'
                          ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                          : blip.severity === 'medium'
                          ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                          : 'bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/40'
                      )}
                    >
                      <div className="flex items-start gap-2">
                        <AlertCircle
                          className={cn(
                            'w-4 h-4 mt-0.5 shrink-0',
                            blip.severity === 'high'
                              ? 'text-red-400'
                              : blip.severity === 'medium'
                              ? 'text-amber-400'
                              : 'text-yellow-400'
                          )}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="text-sm font-medium text-white">{blip.senatorName}</span>
                            <span
                              className={cn(
                                'px-1.5 py-0.5 rounded text-[10px] font-bold uppercase',
                                blip.severity === 'high'
                                  ? 'bg-red-500/20 text-red-400'
                                  : blip.severity === 'medium'
                                  ? 'bg-amber-500/20 text-amber-400'
                                  : 'bg-yellow-500/20 text-yellow-400'
                              )}
                            >
                              {blip.severity}
                            </span>
                          </div>
                          <p className="text-xs text-[#6b6b7a] mt-1 line-clamp-1">{blip.conflict}</p>
                        </div>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Scanline effect */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(245,158,11,0.03) 2px, rgba(245,158,11,0.03) 4px)',
          }}
        />
      </div>
    </div>
  );
}
