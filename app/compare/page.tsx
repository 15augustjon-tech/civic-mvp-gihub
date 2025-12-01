'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeft,
  Users,
  Loader2,
  ChevronDown,
  Calendar,
  Building2,
  DollarSign,
  TrendingUp,
  AlertTriangle,
  CheckCircle2,
  XCircle,
} from 'lucide-react';
import { fetchSenators, Senator } from '@/lib/data';
import { cn } from '@/lib/utils';

// Helper functions defined outside component
function getPartyColor(party: string) {
  if (party === 'D') return 'bg-blue-500';
  if (party === 'R') return 'bg-red-500';
  return 'bg-purple-500';
}

function getPartyText(party: string) {
  if (party === 'D') return 'Democrat';
  if (party === 'R') return 'Republican';
  return 'Independent';
}

// SenatorSelector component moved outside
function SenatorSelector({
  senators,
  selected,
  onSelect,
  isOpen,
  setIsOpen,
  otherSenator,
  label
}: {
  senators: Senator[];
  selected: Senator | null;
  onSelect: (s: Senator) => void;
  isOpen: boolean;
  setIsOpen: (v: boolean) => void;
  otherSenator: Senator | null;
  label: string;
}) {
  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full p-4 rounded-xl border transition-all flex items-center gap-4',
          selected
            ? 'bg-white/[0.04] border-white/[0.08]'
            : 'bg-white/[0.02] border-white/[0.04] border-dashed'
        )}
      >
        {selected ? (
          <>
            <Image
              src={selected.photo}
              alt={selected.name}
              width={48}
              height={48}
              className="w-12 h-12 rounded-full object-cover border border-white/10"
              unoptimized
            />
            <div className="flex-1 text-left">
              <p className="font-medium text-white">{selected.name}</p>
              <p className="text-sm text-[#6b6b7a]">{selected.state} • {getPartyText(selected.party)}</p>
            </div>
          </>
        ) : (
          <div className="flex-1 text-left">
            <p className="text-[#6b6b7a]">Select {label}</p>
          </div>
        )}
        <ChevronDown className={cn('w-5 h-5 text-[#6b6b7a] transition-transform', isOpen && 'rotate-180')} />
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 max-h-80 overflow-auto rounded-xl bg-[#0a0a0f] border border-white/[0.08] shadow-xl">
          {senators
            .filter(s => s.id !== otherSenator?.id)
            .map(senator => (
              <button
                key={senator.id}
                onClick={() => {
                  onSelect(senator);
                  setIsOpen(false);
                }}
                className="w-full p-3 flex items-center gap-3 hover:bg-white/[0.04] transition-colors border-b border-white/[0.04] last:border-0"
              >
                <Image
                  src={senator.photo}
                  alt={senator.name}
                  width={40}
                  height={40}
                  className="w-10 h-10 rounded-full object-cover"
                  unoptimized
                />
                <div className="flex-1 text-left">
                  <p className="text-sm font-medium text-white">{senator.name}</p>
                  <p className="text-xs text-[#6b6b7a]">{senator.stateAbbr} • {senator.party}</p>
                </div>
              </button>
            ))}
        </div>
      )}
    </div>
  );
}

function CompareContent() {
  const searchParams = useSearchParams();
  const [senators, setSenators] = useState<Senator[]>([]);
  const [loading, setLoading] = useState(true);
  const [senatorA, setSenatorA] = useState<Senator | null>(null);
  const [senatorB, setSenatorB] = useState<Senator | null>(null);
  const [dropdownA, setDropdownA] = useState(false);
  const [dropdownB, setDropdownB] = useState(false);

  useEffect(() => {
    fetchSenators()
      .then(data => {
        setSenators(data);
        setLoading(false);

        // Check URL params for pre-selected senators
        const aId = searchParams.get('a');
        const bId = searchParams.get('b');

        if (aId) {
          const found = data.find(s => s.id === aId || s.bioguideId.toLowerCase() === aId.toLowerCase());
          if (found) setSenatorA(found);
        }
        if (bId) {
          const found = data.find(s => s.id === bId || s.bioguideId.toLowerCase() === bId.toLowerCase());
          if (found) setSenatorB(found);
        }
      })
      .catch(error => {
        console.error('Failed to fetch senators:', error);
        setLoading(false);
      });
  }, [searchParams]);

  const compareValue = (a: number, b: number, higherIsBetter = true) => {
    if (a === b) return { a: 'neutral', b: 'neutral' };
    if (higherIsBetter) {
      return { a: a > b ? 'better' : 'worse', b: b > a ? 'better' : 'worse' };
    }
    return { a: a < b ? 'better' : 'worse', b: b < a ? 'better' : 'worse' };
  };

  const currentYear = new Date().getFullYear();

  return (
    <div className="min-h-screen bg-[#050508] bg-grid">
      {/* Header */}
      <div className="bg-mesh">
        <div className="max-w-5xl mx-auto px-6 pt-8 pb-12">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-[#6b6b7a] hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">Back to Dashboard</span>
          </Link>

          {/* Title */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="inline-flex items-center gap-3 mb-4">
              <Users className="w-10 h-10 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                COMPARE
              </h1>
            </div>
            <p className="text-[#6b6b7a] text-lg">
              Side-by-side comparison of any two senators
            </p>
          </motion.div>
        </div>
      </div>

      {/* Senator Selectors */}
      <div className="max-w-5xl mx-auto px-6 -mt-6">
        {loading ? (
          <div className="text-center py-10">
            <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto" />
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <SenatorSelector
              senators={senators}
              selected={senatorA}
              onSelect={setSenatorA}
              isOpen={dropdownA}
              setIsOpen={setDropdownA}
              otherSenator={senatorB}
              label="Senator A"
            />
            <SenatorSelector
              senators={senators}
              selected={senatorB}
              onSelect={setSenatorB}
              isOpen={dropdownB}
              setIsOpen={setDropdownB}
              otherSenator={senatorA}
              label="Senator B"
            />
          </motion.div>
        )}
      </div>

      {/* Comparison */}
      {senatorA && senatorB && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="max-w-5xl mx-auto px-6 py-8"
        >
          {/* Photos */}
          <div className="flex justify-center items-center gap-8 mb-12">
            <Link href={`/politician/${senatorA.id}`} className="text-center group">
              <div className="relative inline-block">
                <Image
                  src={senatorA.photo}
                  alt={senatorA.name}
                  width={128}
                  height={128}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/10 group-hover:border-blue-500/50 transition-colors"
                  unoptimized
                />
                <div className={cn(
                  'absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#050508]',
                  getPartyColor(senatorA.party)
                )}>
                  <span className="text-sm font-bold text-white">{senatorA.party}</span>
                </div>
              </div>
              <p className="mt-3 font-medium text-white group-hover:text-blue-400 transition-colors">{senatorA.name}</p>
              <p className="text-sm text-[#6b6b7a]">{senatorA.state}</p>
            </Link>

            <div className="text-4xl font-bold text-[#3d3d4a]">VS</div>

            <Link href={`/politician/${senatorB.id}`} className="text-center group">
              <div className="relative inline-block">
                <Image
                  src={senatorB.photo}
                  alt={senatorB.name}
                  width={128}
                  height={128}
                  className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4 border-white/10 group-hover:border-blue-500/50 transition-colors"
                  unoptimized
                />
                <div className={cn(
                  'absolute -bottom-2 -right-2 w-10 h-10 rounded-full flex items-center justify-center border-4 border-[#050508]',
                  getPartyColor(senatorB.party)
                )}>
                  <span className="text-sm font-bold text-white">{senatorB.party}</span>
                </div>
              </div>
              <p className="mt-3 font-medium text-white group-hover:text-blue-400 transition-colors">{senatorB.name}</p>
              <p className="text-sm text-[#6b6b7a]">{senatorB.state}</p>
            </Link>
          </div>

          {/* Comparison Table */}
          <div className="space-y-4">
            {/* Years in Office */}
            {(() => {
              const yearsA = currentYear - senatorA.since;
              const yearsB = currentYear - senatorB.since;
              const comp = compareValue(yearsA, yearsB);
              return (
                <ComparisonRow
                  label="Years in Office"
                  icon={<Calendar className="w-4 h-4" />}
                  valueA={`${yearsA} years`}
                  valueB={`${yearsB} years`}
                  statusA={comp.a}
                  statusB={comp.b}
                />
              );
            })()}

            {/* Stock Trades */}
            {(() => {
              const comp = compareValue(senatorA.stockTrades, senatorB.stockTrades, false);
              return (
                <ComparisonRow
                  label="Stock Trades (2024)"
                  icon={<TrendingUp className="w-4 h-4" />}
                  valueA={senatorA.stockTrades.toString()}
                  valueB={senatorB.stockTrades.toString()}
                  statusA={comp.a}
                  statusB={comp.b}
                  note="Fewer is generally better for ethics"
                />
              );
            })()}

            {/* Conflicts */}
            {(() => {
              const comp = compareValue(senatorA.conflicts.length, senatorB.conflicts.length, false);
              return (
                <ComparisonRow
                  label="Potential Conflicts"
                  icon={<AlertTriangle className="w-4 h-4" />}
                  valueA={senatorA.conflicts.length.toString()}
                  valueB={senatorB.conflicts.length.toString()}
                  statusA={comp.a}
                  statusB={comp.b}
                  warning
                />
              );
            })()}

            {/* Committees */}
            <ComparisonRow
              label="Committee Assignments"
              icon={<Building2 className="w-4 h-4" />}
              valueA={senatorA.committees.length > 0 ? senatorA.committees.slice(0, 2).join(', ') : 'Loading...'}
              valueB={senatorB.committees.length > 0 ? senatorB.committees.slice(0, 2).join(', ') : 'Loading...'}
              statusA="neutral"
              statusB="neutral"
            />

            {/* Net Worth */}
            <ComparisonRow
              label="Net Worth"
              icon={<DollarSign className="w-4 h-4" />}
              valueA={senatorA.netWorth}
              valueB={senatorB.netWorth}
              statusA="neutral"
              statusB="neutral"
            />
          </div>

          {/* Quick Links */}
          <div className="mt-12 grid grid-cols-2 gap-4">
            <Link
              href={`/politician/${senatorA.id}`}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/30 transition-all text-center"
            >
              <p className="text-sm text-[#6b6b7a]">View Full Profile</p>
              <p className="text-white font-medium">{senatorA.name}</p>
            </Link>
            <Link
              href={`/politician/${senatorB.id}`}
              className="p-4 rounded-xl bg-white/[0.02] border border-white/[0.04] hover:border-blue-500/30 transition-all text-center"
            >
              <p className="text-sm text-[#6b6b7a]">View Full Profile</p>
              <p className="text-white font-medium">{senatorB.name}</p>
            </Link>
          </div>
        </motion.div>
      )}

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 mt-8">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-xs text-[#3d3d4a]">
            Data sourced from Congress.gov and @unitedstates/congress-legislators
          </p>
        </div>
      </footer>
    </div>
  );
}

function ComparisonRow({
  label,
  icon,
  valueA,
  valueB,
  statusA,
  statusB,
  note,
  warning
}: {
  label: string;
  icon: React.ReactNode;
  valueA: string;
  valueB: string;
  statusA: string;
  statusB: string;
  note?: string;
  warning?: boolean;
}) {
  const getStatusIcon = (status: string) => {
    if (status === 'better') return <CheckCircle2 className="w-4 h-4 text-green-400" />;
    if (status === 'worse') return <XCircle className="w-4 h-4 text-red-400" />;
    return null;
  };

  const getStatusBg = (status: string) => {
    if (status === 'better') return 'bg-green-500/10 border-green-500/20';
    if (status === 'worse') return 'bg-red-500/10 border-red-500/20';
    return 'bg-white/[0.02] border-white/[0.04]';
  };

  return (
    <div className="rounded-xl bg-white/[0.02] border border-white/[0.04] overflow-hidden">
      <div className="flex items-center justify-center gap-2 py-3 border-b border-white/[0.04]">
        <span className="text-[#6b6b7a]">{icon}</span>
        <span className="text-sm font-medium text-white">{label}</span>
        {warning && <AlertTriangle className="w-4 h-4 text-amber-400" />}
      </div>
      <div className="grid grid-cols-2">
        <div className={cn('p-4 text-center border-r border-white/[0.04]', getStatusBg(statusA))}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-mono text-white">{valueA}</span>
            {getStatusIcon(statusA)}
          </div>
        </div>
        <div className={cn('p-4 text-center', getStatusBg(statusB))}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-lg font-mono text-white">{valueB}</span>
            {getStatusIcon(statusB)}
          </div>
        </div>
      </div>
      {note && (
        <div className="px-4 py-2 border-t border-white/[0.04] text-center">
          <p className="text-xs text-[#6b6b7a]">{note}</p>
        </div>
      )}
    </div>
  );
}

export default function ComparePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#050508] flex items-center justify-center">
        <Loader2 className="w-10 h-10 text-blue-400 animate-spin" />
      </div>
    }>
      <CompareContent />
    </Suspense>
  );
}
