'use client';

import { motion } from 'framer-motion';

interface IdeologyScoreProps {
  partyVotes: number;
  party: 'R' | 'D' | 'I';
}

export function IdeologyScore({ partyVotes, party }: IdeologyScoreProps) {
  // Estimate ideology from party votes (simplified)
  // Higher party votes = more partisan
  // D with high party votes = more liberal
  // R with high party votes = more conservative

  const getIdeologyPosition = () => {
    if (party === 'D') {
      // Democrats: higher party votes = more liberal (lower score)
      return 100 - (partyVotes * 0.5); // Scale 0-100, left side
    } else if (party === 'R') {
      // Republicans: higher party votes = more conservative (higher score)
      return (partyVotes * 0.5) + 50; // Scale 50-100, right side
    }
    // Independent: center-ish
    return 50;
  };

  const position = getIdeologyPosition();
  const positionPercent = Math.max(0, Math.min(100, position));

  const getPositionLabel = () => {
    if (positionPercent < 20) return 'Very Liberal';
    if (positionPercent < 40) return 'Liberal';
    if (positionPercent < 60) return 'Moderate';
    if (positionPercent < 80) return 'Conservative';
    return 'Very Conservative';
  };

  return (
    <div className="space-y-4">
      {/* Spectrum Bar */}
      <div className="relative">
        <div className="h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-red-500 opacity-60" />

        {/* Position Marker */}
        <motion.div
          initial={{ left: '50%' }}
          animate={{ left: `${positionPercent}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2"
        >
          <div className="w-5 h-5 rounded-full bg-white border-2 border-[#0a0a0f] shadow-lg flex items-center justify-center">
            <div className="w-2 h-2 rounded-full bg-white" />
          </div>
        </motion.div>
      </div>

      {/* Labels */}
      <div className="flex justify-between text-xs text-[#6b6b7a]">
        <span>Liberal</span>
        <span>Moderate</span>
        <span>Conservative</span>
      </div>

      {/* Current Position */}
      <div className="text-center">
        <p className="text-sm font-medium text-white">{getPositionLabel()}</p>
        <p className="text-xs text-[#6b6b7a]">
          Based on {partyVotes}% party-line voting
        </p>
      </div>

      {/* Note */}
      <p className="text-[10px] text-[#3d3d4a] text-center">
        Estimated from voting patterns. Full DW-NOMINATE scores coming soon.
      </p>
    </div>
  );
}
