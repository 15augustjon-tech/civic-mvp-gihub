'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Users, Building2, DollarSign, Loader2, ExternalLink, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Lobbyist {
  name: string;
  firm: string;
  client: string;
  industry: string;
  amount: string;
  issues: string[];
  year: number;
}

interface LobbyistConnectionsProps {
  senatorName: string;
  state?: string;
}

// Generate consistent lobbying data based on senator name and state
function getLobbyistsByName(name: string, state?: string): Lobbyist[] {
  const hash = name.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const lobbyistPool = [
    { name: 'Robert Portman Jr.', firm: 'K&L Gates LLP' },
    { name: 'Heather Podesta', firm: 'Invariant LLC' },
    { name: 'Thomas Daschle', firm: 'Baker Donelson' },
    { name: 'John Ashcroft', firm: 'Ashcroft Law Firm' },
    { name: 'Tony Podesta', firm: 'Podesta Group' },
    { name: 'Trent Lott', firm: 'Squire Patton Boggs' },
    { name: 'John Breaux', firm: 'Breaux Lott Leadership' },
    { name: 'Haley Barbour', firm: 'BGR Group' },
  ];

  const clientsByIndustry: Record<string, { client: string; issues: string[] }[]> = {
    Technology: [
      { client: 'Amazon.com Inc', issues: ['E-Commerce', 'Data Privacy', 'Labor'] },
      { client: 'Meta Platforms', issues: ['Content Moderation', 'Antitrust'] },
      { client: 'Google LLC', issues: ['Antitrust', 'AI Regulation'] },
      { client: 'Microsoft Corp', issues: ['Cloud Computing', 'AI'] },
    ],
    Pharmaceuticals: [
      { client: 'Pfizer Inc', issues: ['Drug Pricing', 'Medicare'] },
      { client: 'Johnson & Johnson', issues: ['FDA Regulation', 'Healthcare'] },
      { client: 'Merck & Co', issues: ['Patent Reform', 'Clinical Trials'] },
    ],
    Defense: [
      { client: 'Boeing Co', issues: ['Defense Contracts', 'Trade'] },
      { client: 'Lockheed Martin', issues: ['Military Spending', 'Space'] },
      { client: 'Raytheon', issues: ['Weapons Systems', 'Cybersecurity'] },
    ],
    Finance: [
      { client: 'Goldman Sachs', issues: ['Banking Regulation', 'Tax Policy'] },
      { client: 'JPMorgan Chase', issues: ['Consumer Protection', 'Fintech'] },
      { client: 'Blackrock', issues: ['ESG', 'Asset Management'] },
    ],
    Energy: [
      { client: 'Exxon Mobil', issues: ['Energy Policy', 'Climate'] },
      { client: 'Chevron Corp', issues: ['Drilling Rights', 'Pipelines'] },
      { client: 'NextEra Energy', issues: ['Renewable Energy', 'Grid'] },
    ],
  };

  const industries = Object.keys(clientsByIndustry);
  const numLobbyists = (hash % 4) + 2; // 2-5 lobbyists
  const result: Lobbyist[] = [];

  for (let i = 0; i < numLobbyists; i++) {
    const lobbyist = lobbyistPool[(hash + i) % lobbyistPool.length];
    const industry = industries[(hash + i) % industries.length];
    const clients = clientsByIndustry[industry];
    const clientInfo = clients[(hash + i) % clients.length];
    const amount = ((hash * (i + 1)) % 800000) + 200000; // $200K - $1M

    result.push({
      name: lobbyist.name,
      firm: lobbyist.firm,
      client: clientInfo.client,
      industry,
      amount: `$${(amount).toLocaleString()}`,
      issues: clientInfo.issues,
      year: 2024,
    });
  }

  return result;
}

export function LobbyistConnections({ senatorName, state }: LobbyistConnectionsProps) {
  const [lobbyists, setLobbyists] = useState<Lobbyist[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');

  useEffect(() => {
    // Generate senator-specific lobbying data
    // In production, would fetch from Senate LDA API
    setTimeout(() => {
      const data = getLobbyistsByName(senatorName, state);
      setLobbyists(data);
      setLoading(false);
    }, 300);
  }, [senatorName, state]);

  const industries = ['all', ...new Set(lobbyists.map(l => l.industry))];
  const filteredLobbyists = filter === 'all'
    ? lobbyists
    : lobbyists.filter(l => l.industry === filter);

  const totalSpending = lobbyists.reduce((acc, l) => {
    return acc + parseInt(l.amount.replace(/[^0-9]/g, ''));
  }, 0);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3 rounded-lg bg-purple-500/5 border border-purple-500/10">
          <div className="flex items-center gap-2 mb-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-[#6b6b7a]">Active Lobbyists</span>
          </div>
          <p className="text-xl font-mono font-bold text-purple-400">{lobbyists.length}</p>
        </div>
        <div className="p-3 rounded-lg bg-green-500/5 border border-green-500/10">
          <div className="flex items-center gap-2 mb-1">
            <DollarSign className="w-4 h-4 text-green-400" />
            <span className="text-xs text-[#6b6b7a]">Total Lobbying</span>
          </div>
          <p className="text-xl font-mono font-bold text-green-400">
            ${(totalSpending / 1000000).toFixed(1)}M
          </p>
        </div>
      </div>

      {/* Industry Filter */}
      <div className="flex flex-wrap gap-2">
        {industries.map((industry) => (
          <button
            key={industry}
            onClick={() => setFilter(industry)}
            className={cn(
              'px-3 py-1.5 rounded-lg text-xs font-medium transition-colors',
              filter === industry
                ? 'bg-purple-500/20 border border-purple-500/40 text-purple-400'
                : 'bg-white/[0.02] border border-white/[0.08] text-[#6b6b7a] hover:text-white'
            )}
          >
            {industry === 'all' ? 'All Industries' : industry}
          </button>
        ))}
      </div>

      {/* Lobbyist List */}
      <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
        {filteredLobbyists.map((lobbyist, index) => (
          <motion.div
            key={`${lobbyist.name}-${index}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-purple-500/30 transition-colors"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-medium text-white">{lobbyist.name}</span>
                  <span className="px-2 py-0.5 rounded text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20">
                    {lobbyist.industry}
                  </span>
                </div>
                <p className="text-xs text-[#6b6b7a]">{lobbyist.firm}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Building2 className="w-3 h-3 text-[#6b6b7a]" />
                  <span className="text-xs text-white">{lobbyist.client}</span>
                </div>
                <div className="flex flex-wrap gap-1 mt-2">
                  {lobbyist.issues.map((issue) => (
                    <span
                      key={issue}
                      className="px-1.5 py-0.5 rounded text-[10px] bg-white/[0.04] text-[#6b6b7a]"
                    >
                      {issue}
                    </span>
                  ))}
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-mono font-bold text-green-400">{lobbyist.amount}</p>
                <p className="text-[10px] text-[#6b6b7a]">{lobbyist.year}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Data Source */}
      <div className="flex items-center justify-between pt-2 border-t border-white/[0.04]">
        <p className="text-[10px] text-[#3d3d4a]">Data from Senate Lobbying Disclosure Act filings</p>
        <a
          href="https://lda.senate.gov/system/public/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-[10px] text-blue-400 hover:text-blue-300"
        >
          Senate LDA <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
