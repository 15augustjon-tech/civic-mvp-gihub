'use client';

import { useState, useEffect, use } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import {
  MapPin,
  Users,
  ArrowLeft,
  Loader2,
  Building2,
  Calendar,
  Phone,
  Globe,
  ExternalLink
} from 'lucide-react';
import { fetchSenators, Senator } from '@/lib/data';
import { cn } from '@/lib/utils';

// State names mapping
const stateNames: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
};

export default function StatePage({ params }: { params: Promise<{ abbr: string }> }) {
  const { abbr } = use(params);
  const [senators, setSenators] = useState<Senator[]>([]);
  const [loading, setLoading] = useState(true);

  const stateAbbr = abbr.toUpperCase();
  const stateName = stateNames[stateAbbr] || stateAbbr;

  useEffect(() => {
    fetchSenators().then(data => {
      const stateSenators = data.filter(s => s.stateAbbr === stateAbbr);
      setSenators(stateSenators);
      setLoading(false);
    });
  }, [stateAbbr]);

  const getPartyColor = (party: string) => {
    if (party === 'D') return 'bg-blue-500';
    if (party === 'R') return 'bg-red-500';
    return 'bg-purple-500';
  };

  const getPartyBorder = (party: string) => {
    if (party === 'D') return 'border-blue-500/30 hover:border-blue-500/50';
    if (party === 'R') return 'border-red-500/30 hover:border-red-500/50';
    return 'border-purple-500/30 hover:border-purple-500/50';
  };

  return (
    <div className="min-h-screen bg-[#050508] bg-grid">
      {/* Header */}
      <div className="bg-mesh">
        <div className="max-w-4xl mx-auto px-6 pt-8 pb-12">
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
              <MapPin className="w-10 h-10 text-blue-400" />
              <h1 className="text-4xl md:text-5xl font-bold text-white">
                {stateName}
              </h1>
            </div>
            <p className="text-[#6b6b7a] text-lg">
              Your {senators.length} U.S. Senators
            </p>
            <div className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.04] border border-white/[0.08]">
              <Users className="w-4 h-4 text-blue-400" />
              <span className="text-sm text-[#a0a0aa]">
                Class {senators[0]?.stateRank === 'senior' ? 'I & II' : 'II & III'} Senators
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Senators Grid */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        {loading ? (
          <div className="text-center py-20">
            <Loader2 className="w-10 h-10 text-blue-400 animate-spin mx-auto mb-4" />
            <p className="text-[#6b6b7a]">Loading senators...</p>
          </div>
        ) : senators.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[#6b6b7a]">No senators found for {stateName}</p>
            <Link
              href="/"
              className="mt-4 inline-flex items-center gap-2 text-blue-400 hover:text-blue-300"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to all senators
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {senators.map((senator, index) => (
              <motion.div
                key={senator.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Link
                  href={`/politician/${senator.id}`}
                  className={cn(
                    'block p-6 rounded-2xl bg-white/[0.02] border transition-all group',
                    getPartyBorder(senator.party)
                  )}
                >
                  {/* Header */}
                  <div className="flex items-start gap-4 mb-6">
                    <div className="relative">
                      <img
                        src={senator.photo}
                        alt={senator.name}
                        className="w-24 h-24 rounded-xl object-cover border border-white/10"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = '/placeholder-senator.png';
                        }}
                      />
                      <div className={cn(
                        'absolute -bottom-2 -right-2 w-8 h-8 rounded-full flex items-center justify-center border-2 border-[#0a0a0f]',
                        getPartyColor(senator.party)
                      )}>
                        <span className="text-xs font-bold text-white">{senator.party}</span>
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs px-2 py-0.5 rounded-full bg-white/[0.06] text-[#6b6b7a] capitalize">
                          {senator.stateRank || 'Senator'}
                        </span>
                      </div>
                      <h2 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {senator.name}
                      </h2>
                      <p className="text-sm text-[#6b6b7a]">
                        {senator.party === 'D' ? 'Democrat' : senator.party === 'R' ? 'Republican' : 'Independent'}
                      </p>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center gap-2 mb-1">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-[#6b6b7a]">In Office Since</span>
                      </div>
                      <p className="text-lg font-mono text-white">{senator.since}</p>
                      <p className="text-xs text-[#6b6b7a]">{new Date().getFullYear() - senator.since} years</p>
                    </div>
                    <div className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
                      <div className="flex items-center gap-2 mb-1">
                        <Building2 className="w-4 h-4 text-purple-400" />
                        <span className="text-xs text-[#6b6b7a]">Term Ends</span>
                      </div>
                      <p className="text-lg font-mono text-white">
                        {senator.termEnd ? new Date(senator.termEnd).getFullYear() : 'N/A'}
                      </p>
                    </div>
                  </div>

                  {/* Contact */}
                  <div className="space-y-2">
                    {senator.phone && (
                      <div className="flex items-center gap-2 text-sm text-[#a0a0aa]">
                        <Phone className="w-4 h-4 text-[#6b6b7a]" />
                        <span>{senator.phone}</span>
                      </div>
                    )}
                    {senator.website && (
                      <div className="flex items-center gap-2 text-sm text-[#a0a0aa]">
                        <Globe className="w-4 h-4 text-[#6b6b7a]" />
                        <span className="truncate">{senator.website.replace('https://', '')}</span>
                        <ExternalLink className="w-3 h-3 text-[#6b6b7a]" />
                      </div>
                    )}
                  </div>

                  {/* View Profile CTA */}
                  <div className="mt-6 pt-4 border-t border-white/[0.04]">
                    <span className="text-sm text-blue-400 group-hover:text-blue-300 flex items-center gap-2">
                      View Full Dossier
                      <ExternalLink className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        )}

        {/* Compare Button */}
        {senators.length === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 text-center"
          >
            <Link
              href={`/compare?a=${senators[0].id}&b=${senators[1].id}`}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition-all"
            >
              <Users className="w-5 h-5" />
              Compare Your Senators Side-by-Side
            </Link>
          </motion.div>
        )}
      </div>

      {/* Other States */}
      <div className="max-w-4xl mx-auto px-6 py-8 border-t border-white/[0.04]">
        <h3 className="text-lg font-bold text-white mb-4">Other States</h3>
        <div className="flex flex-wrap gap-2">
          {Object.entries(stateNames)
            .filter(([abbr]) => abbr !== stateAbbr)
            .slice(0, 10)
            .map(([abbr, name]) => (
              <Link
                key={abbr}
                href={`/state/${abbr.toLowerCase()}`}
                className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-sm text-[#a0a0aa] hover:text-white hover:border-blue-500/30 transition-all"
              >
                {abbr}
              </Link>
            ))}
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg bg-white/[0.02] border border-white/[0.04] text-sm text-blue-400 hover:bg-blue-500/10 transition-all"
          >
            View All →
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 mt-8">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <p className="text-xs text-[#3d3d4a]">
            Data sourced from Congress.gov and @unitedstates/congress-legislators
          </p>
        </div>
      </footer>
    </div>
  );
}
