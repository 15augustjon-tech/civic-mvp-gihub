'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { AlertTriangle, Shield, Activity, Eye, Loader2, Trophy, Users, MapPin } from 'lucide-react';
import Link from 'next/link';
import { fetchSenators, getTotalStats, Senator } from '@/lib/data';
import { PoliticianCard } from '@/components/PoliticianCard';
import { SearchCommand } from '@/components/SearchCommand';
import { StatsTicker } from '@/components/StatsTicker';
import { TradeTicker } from '@/components/TradeTicker';
import { ConflictRadar } from '@/components/ConflictRadar';
import { USAMap } from '@/components/USAMap';
import { ExecutiveBranch } from '@/components/ExecutiveBranch';
import { BillTracker } from '@/components/BillTracker';
import { StockWinners } from '@/components/StockWinners';
import { FilterControls, FilterState } from '@/components/FilterControls';
import { AuthHeader } from '@/components/AuthHeader';
import { DataSources } from '@/components/DataSources';

export default function Home() {
  const [senators, setSenators] = useState<Senator[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch real senators on mount
  useEffect(() => {
    fetchSenators().then(data => {
      setSenators(data);
      setLoading(false);
    });
  }, []);

  const stats = {
    totalSenators: senators.length,
    totalTrades: senators.reduce((acc, s) => acc + s.stockTrades, 0),
    totalConflicts: senators.reduce((acc, s) => acc + s.conflicts.length, 0),
    avgAttendance: senators.length > 0
      ? Math.round(senators.reduce((acc, s) => acc + s.attendance, 0) / senators.length)
      : 0,
  };
  const [filters, setFilters] = useState<FilterState>({
    party: 'all',
    hasConflicts: null,
    sortBy: 'trades',
    state: 'All States',
  });

  // Filter and sort senators based on current filters
  const filteredSenators = useMemo(() => {
    let result = [...senators];

    // Filter by party
    if (filters.party !== 'all') {
      result = result.filter(s => s.party === filters.party);
    }

    // Filter by conflicts
    if (filters.hasConflicts !== null) {
      result = result.filter(s =>
        filters.hasConflicts ? s.conflicts.length > 0 : s.conflicts.length === 0
      );
    }

    // Filter by state
    if (filters.state !== 'All States') {
      result = result.filter(s => s.state === filters.state);
    }

    // Sort
    switch (filters.sortBy) {
      case 'trades':
        result.sort((a, b) => b.stockTrades - a.stockTrades);
        break;
      case 'conflicts':
        result.sort((a, b) => b.conflicts.length - a.conflicts.length);
        break;
      case 'years':
        result.sort((a, b) => a.since - b.since); // Lower since = more years
        break;
      case 'netWorth':
        result.sort((a, b) => {
          const aVal = parseFloat(a.netWorth.replace(/[^0-9.-]/g, '')) || 0;
          const bVal = parseFloat(b.netWorth.replace(/[^0-9.-]/g, '')) || 0;
          return bVal - aVal;
        });
        break;
      case 'name':
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return result;
  }, [senators, filters]);

  const senatorsWithConflicts = senators.filter((s) => s.conflicts.length > 0);

  return (
    <div className="min-h-screen bg-[#050508] bg-grid">
      {/* Auth Header */}
      <div className="fixed top-4 right-6 z-50">
        <AuthHeader />
      </div>

      {/* Hero Section */}
      <div className="bg-mesh">
        <div className="max-w-7xl mx-auto px-6 pt-16 pb-8">
          {/* Top badge */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex justify-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 backdrop-blur-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse-live" />
              <span className="text-xs font-medium text-blue-400 tracking-wide">
                LIVE SURVEILLANCE FEED • UPDATED DAILY
              </span>
            </div>
          </motion.div>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-center mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-4 tracking-tight">
              CIVIC <span className="text-blue-400">FORUM</span>
            </h1>
            <p className="text-xl md:text-2xl text-[#6b6b7a] font-light">
              They work for you. <span className="text-white font-medium">Know your employees.</span>
            </p>
            <p className="text-sm text-[#3d3d4a] mt-2 font-mono">
              [ ONE CLICK = INSTANT DOSSIER ON ANY US SENATOR ]
            </p>
          </motion.div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <SearchCommand />
          </motion.div>

          {/* Quick Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="flex justify-center gap-3 mb-12"
          >
            <Link
              href="/leaderboard"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 hover:bg-yellow-500/20 transition-colors text-sm font-medium"
            >
              <Trophy className="w-4 h-4" />
              Leaderboard
            </Link>
            <Link
              href="/compare"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-purple-500/10 border border-purple-500/20 text-purple-400 hover:bg-purple-500/20 transition-colors text-sm font-medium"
            >
              <Users className="w-4 h-4" />
              Compare Senators
            </Link>
            <Link
              href="/state/ca"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500/10 border border-green-500/20 text-green-400 hover:bg-green-500/20 transition-colors text-sm font-medium"
            >
              <MapPin className="w-4 h-4" />
              Find Your State
            </Link>
          </motion.div>

          {/* Quick stats cards */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mb-8"
          >
            <QuickStatCard
              icon={<Eye className="w-5 h-5" />}
              label="Under Watch"
              value={stats.totalSenators.toString()}
              color="blue"
            />
            <QuickStatCard
              icon={<Activity className="w-5 h-5" />}
              label="2024 Trades"
              value={stats.totalTrades.toString()}
              color="green"
            />
            <QuickStatCard
              icon={<AlertTriangle className="w-5 h-5" />}
              label="Conflicts"
              value={stats.totalConflicts.toString()}
              color="amber"
            />
            <QuickStatCard
              icon={<Shield className="w-5 h-5" />}
              label="Clean Record"
              value={(stats.totalSenators - senatorsWithConflicts.length).toString()}
              color="purple"
            />
          </motion.div>
        </div>
      </div>

      {/* Trade Ticker */}
      <TradeTicker />

      {/* Stats Ticker */}
      <StatsTicker />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* Executive Branch Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="mb-12"
        >
          <ExecutiveBranch />
        </motion.div>

        {/* USA Map */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mb-12"
        >
          <USAMap />
        </motion.div>

        {/* Stock Winners & Bill Tracker Row */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.42 }}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12"
        >
          <StockWinners />
          <BillTracker />
        </motion.div>

        {/* Conflict Radar Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.45 }}
          className="mb-12"
        >
          <ConflictRadar />
        </motion.div>

        {/* Filter Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.48 }}
          className="mb-8"
        >
          <FilterControls onFilterChange={setFilters} />
        </motion.div>

        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h2 className="text-2xl font-bold text-white">All Senators</h2>
            <p className="text-sm text-[#6b6b7a]">
              {filteredSenators.length === senators.length
                ? 'Sorted by potential conflicts and trading activity'
                : `Showing ${filteredSenators.length} of ${senators.length} senators`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {senatorsWithConflicts.length > 0 && (
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                <span className="text-sm text-amber-400 font-medium">
                  {senatorsWithConflicts.length} with conflicts
                </span>
              </div>
            )}
          </div>
        </motion.div>

        {/* Bento Grid of Politicians */}
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-[#6b6b7a]">Loading senators from Congress...</p>
            <p className="text-xs text-[#3d3d4a] mt-2">Fetching data from official government sources</p>
          </div>
        ) : filteredSenators.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredSenators.map((senator, index) => (
              <PoliticianCard key={senator.id} senator={senator} index={index} />
            ))}
          </div>
        ) : senators.length > 0 ? (
          <div className="text-center py-12">
            <p className="text-[#6b6b7a]">No senators match your filters</p>
            <button
              onClick={() => setFilters({ party: 'all', hasConflicts: null, sortBy: 'trades', state: 'All States' })}
              className="mt-4 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm"
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-[#6b6b7a]">Failed to load senators. Please refresh the page.</p>
          </div>
        )}
      </div>

      {/* Data Sources Section */}
      <div className="max-w-7xl mx-auto px-6 pb-12">
        <DataSources />
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="text-center md:text-left">
              <div className="text-lg font-bold text-white mb-1">CIVIC FORUM</div>
              <p className="text-sm text-[#6b6b7a]">
                Government transparency through public data
              </p>
            </div>
            <div className="text-center md:text-right">
              <p className="text-xs text-[#3d3d4a] mb-2">
                Data sourced from Congress.gov, FEC.gov, and Senate Financial Disclosures
              </p>
              <p className="text-xs text-[#3d3d4a]">
                Open source • Not affiliated with any government entity
              </p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-white/[0.04] text-center">
            <p className="text-[10px] text-[#3d3d4a] font-mono uppercase tracking-wider">
              // SURVEILLANCE TERMINAL v1.0 • ALL DATA IS PUBLIC RECORD //
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function QuickStatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: 'blue' | 'green' | 'amber' | 'purple';
}) {
  const colorClasses = {
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    amber: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  };

  const iconColorClasses = {
    blue: 'text-blue-400',
    green: 'text-green-400',
    amber: 'text-amber-400',
    purple: 'text-purple-400',
  };

  return (
    <div
      className={`p-4 rounded-xl border backdrop-blur-sm transition-all hover:scale-[1.02] ${colorClasses[color]}`}
    >
      <div className={`mb-2 ${iconColorClasses[color]}`}>{icon}</div>
      <div className="text-2xl font-bold font-mono text-white">{value}</div>
      <div className="text-xs text-[#6b6b7a] uppercase tracking-wide">{label}</div>
    </div>
  );
}
