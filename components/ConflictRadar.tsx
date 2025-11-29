'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, AlertCircle } from 'lucide-react';
import { getSenatorsWithConflicts } from '@/lib/data';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface ConflictBlip {
  senatorName: string;
  senatorId: string;
  conflict: string;
  severity: 'high' | 'medium' | 'low';
}

export function ConflictRadar() {
  const senatorsWithConflicts = getSenatorsWithConflicts();

  // Create blips from conflicts
  const blips: ConflictBlip[] = senatorsWithConflicts.flatMap((senator) =>
    senator.conflicts.map((conflict, index) => ({
      senatorName: senator.name,
      senatorId: senator.id,
      conflict,
      severity: index === 0 ? 'high' : index === 1 ? 'medium' : 'low',
    }))
  );

  const highSeverityBlips = blips.filter((b) => b.severity === 'high');

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
            <p className="text-xs text-[#6b6b7a]">{blips.length} potential conflicts detected</p>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
          <span className="text-xs font-medium text-red-400">LIVE</span>
        </div>
      </div>

      {/* Radar visualization */}
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
          {highSeverityBlips.slice(0, 4).map((blip, index) => {
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
          {highSeverityBlips.slice(0, 5).map((blip, index) => (
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
                      : 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                  )}
                >
                  <div className="flex items-start gap-2">
                    <AlertCircle
                      className={cn(
                        'w-4 h-4 mt-0.5 shrink-0',
                        blip.severity === 'high' ? 'text-red-400' : 'text-amber-400'
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
                              : 'bg-amber-500/20 text-amber-400'
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
          ))}
        </div>
      </div>

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
