'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Filter, X, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface FilterControlsProps {
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  party: 'all' | 'R' | 'D' | 'I';
  hasConflicts: boolean | null;
  sortBy: 'name' | 'trades' | 'netWorth' | 'conflicts';
  state: string;
}

const states = [
  'All States', 'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado',
  'Connecticut', 'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois',
  'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana',
  'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York',
  'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon', 'Pennsylvania',
  'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
  'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming'
];

export function FilterControls({ onFilterChange }: FilterControlsProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    party: 'all',
    hasConflicts: null,
    sortBy: 'trades',
    state: 'All States',
  });

  const updateFilter = (key: keyof FilterState, value: FilterState[keyof FilterState]) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const defaultFilters: FilterState = {
      party: 'all',
      hasConflicts: null,
      sortBy: 'trades',
      state: 'All States',
    };
    setFilters(defaultFilters);
    onFilterChange(defaultFilters);
  };

  const hasActiveFilters = filters.party !== 'all' || filters.hasConflicts !== null || filters.state !== 'All States';

  return (
    <div className="relative overflow-hidden rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-4">
      {/* Header */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
            <Filter className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white">Filter & Sort</h3>
            {hasActiveFilters && (
              <p className="text-xs text-blue-400">Filters active</p>
            )}
          </div>
        </div>
        <ChevronDown className={cn(
          'w-5 h-5 text-[#6b6b7a] transition-transform',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {/* Expanded Filters */}
      <motion.div
        initial={false}
        animate={{ height: isExpanded ? 'auto' : 0, opacity: isExpanded ? 1 : 0 }}
        className="overflow-hidden"
      >
        <div className="pt-4 space-y-4">
          {/* Party Filter */}
          <div>
            <label className="text-xs text-[#6b6b7a] uppercase tracking-wide block mb-2">Party</label>
            <div className="flex gap-2">
              {[
                { value: 'all', label: 'All', color: 'bg-white/10 border-white/20 text-white' },
                { value: 'R', label: 'Republican', color: 'bg-red-500/10 border-red-500/20 text-red-400' },
                { value: 'D', label: 'Democrat', color: 'bg-blue-500/10 border-blue-500/20 text-blue-400' },
                { value: 'I', label: 'Independent', color: 'bg-purple-500/10 border-purple-500/20 text-purple-400' },
              ].map(({ value, label, color }) => (
                <button
                  key={value}
                  onClick={() => updateFilter('party', value as FilterState['party'])}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                    filters.party === value ? color : 'bg-transparent border-white/[0.06] text-[#6b6b7a] hover:border-white/20'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Conflict Filter */}
          <div>
            <label className="text-xs text-[#6b6b7a] uppercase tracking-wide block mb-2">Conflicts</label>
            <div className="flex gap-2">
              {[
                { value: null, label: 'All' },
                { value: true, label: 'With Conflicts' },
                { value: false, label: 'Clean Record' },
              ].map(({ value, label }) => (
                <button
                  key={String(value)}
                  onClick={() => updateFilter('hasConflicts', value)}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                    filters.hasConflicts === value
                      ? 'bg-amber-500/10 border-amber-500/20 text-amber-400'
                      : 'bg-transparent border-white/[0.06] text-[#6b6b7a] hover:border-white/20'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-xs text-[#6b6b7a] uppercase tracking-wide block mb-2">Sort By</label>
            <div className="flex gap-2 flex-wrap">
              {[
                { value: 'trades', label: 'Most Trades' },
                { value: 'conflicts', label: 'Most Conflicts' },
                { value: 'netWorth', label: 'Net Worth' },
                { value: 'name', label: 'Name' },
              ].map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => updateFilter('sortBy', value as FilterState['sortBy'])}
                  className={cn(
                    'px-3 py-1.5 rounded-lg border text-xs font-medium transition-all',
                    filters.sortBy === value
                      ? 'bg-green-500/10 border-green-500/20 text-green-400'
                      : 'bg-transparent border-white/[0.06] text-[#6b6b7a] hover:border-white/20'
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* State Filter */}
          <div>
            <label className="text-xs text-[#6b6b7a] uppercase tracking-wide block mb-2">State</label>
            <select
              value={filters.state}
              onChange={(e) => updateFilter('state', e.target.value)}
              className="w-full px-3 py-2 rounded-lg bg-[#1a1a24] border border-white/[0.06] text-sm text-white focus:outline-none focus:border-blue-500/50"
            >
              {states.map(state => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          </div>

          {/* Clear Filters */}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-medium hover:bg-red-500/20 transition-colors"
            >
              <X className="w-3 h-3" />
              Clear All Filters
            </button>
          )}
        </div>
      </motion.div>
    </div>
  );
}
