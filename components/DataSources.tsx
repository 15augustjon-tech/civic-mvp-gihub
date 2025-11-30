'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Database,
  ExternalLink,
  Shield,
  Info,
  ChevronDown,
  Building2,
  DollarSign,
  Vote,
  FileText,
  Users,
  TrendingUp,
  Newspaper,
  Scale
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface DataSource {
  name: string;
  description: string;
  url: string;
  icon: React.ReactNode;
  dataTypes: string[];
  updateFrequency: string;
  isOfficial: boolean;
}

const dataSources: DataSource[] = [
  {
    name: 'Congress.gov',
    description: 'Official source for congressional member information, photos, and legislative activity',
    url: 'https://www.congress.gov',
    icon: <Building2 className="w-4 h-4" />,
    dataTypes: ['Senator profiles', 'Official photos', 'Bills sponsored', 'Committee assignments'],
    updateFrequency: 'Real-time',
    isOfficial: true,
  },
  {
    name: 'United States Congress Legislators',
    description: 'Open-source database of all members of Congress with contact info and social media',
    url: 'https://github.com/unitedstates/congress-legislators',
    icon: <Users className="w-4 h-4" />,
    dataTypes: ['Biographical data', 'Term history', 'Contact information', 'Social media handles'],
    updateFrequency: 'Weekly',
    isOfficial: false,
  },
  {
    name: 'Federal Election Commission (FEC)',
    description: 'Official campaign finance data including contributions and expenditures',
    url: 'https://www.fec.gov',
    icon: <DollarSign className="w-4 h-4" />,
    dataTypes: ['Campaign contributions', 'Fundraising totals', 'PAC donations', 'Expenditure reports'],
    updateFrequency: 'Quarterly',
    isOfficial: true,
  },
  {
    name: 'Senate Stock Watcher',
    description: 'Tracks stock trades disclosed under the STOCK Act',
    url: 'https://senatestockwatcher.com',
    icon: <TrendingUp className="w-4 h-4" />,
    dataTypes: ['Stock purchases', 'Stock sales', 'Transaction amounts', 'Filing dates'],
    updateFrequency: 'As filed (45-day delay)',
    isOfficial: false,
  },
  {
    name: 'OpenSecrets',
    description: 'Nonpartisan research tracking money in politics',
    url: 'https://www.opensecrets.org',
    icon: <Scale className="w-4 h-4" />,
    dataTypes: ['Dark money tracking', 'Lobbying data', 'Industry contributions', 'Outside spending'],
    updateFrequency: 'Varies by dataset',
    isOfficial: false,
  },
  {
    name: 'Senate Lobbying Disclosure',
    description: 'Official lobbying registration and activity reports',
    url: 'https://lda.senate.gov',
    icon: <FileText className="w-4 h-4" />,
    dataTypes: ['Registered lobbyists', 'Lobbying expenditures', 'Client relationships', 'Issues lobbied'],
    updateFrequency: 'Quarterly',
    isOfficial: true,
  },
  {
    name: 'Wikipedia',
    description: 'Biographical summaries and career history',
    url: 'https://www.wikipedia.org',
    icon: <Info className="w-4 h-4" />,
    dataTypes: ['Biography', 'Education', 'Career history', 'Notable events'],
    updateFrequency: 'Community maintained',
    isOfficial: false,
  },
  {
    name: 'VoteView (UCLA)',
    description: 'Academic database of congressional voting patterns and ideology scores',
    url: 'https://voteview.com',
    icon: <Vote className="w-4 h-4" />,
    dataTypes: ['DW-NOMINATE scores', 'Voting patterns', 'Ideology metrics', 'Party unity'],
    updateFrequency: 'Per Congress session',
    isOfficial: false,
  },
  {
    name: 'GDELT Project',
    description: 'Global news monitoring and sentiment analysis',
    url: 'https://www.gdeltproject.org',
    icon: <Newspaper className="w-4 h-4" />,
    dataTypes: ['News mentions', 'Media sentiment', 'Coverage volume', 'Topic analysis'],
    updateFrequency: 'Real-time',
    isOfficial: false,
  },
];

export function DataSources() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between hover:bg-white/[0.02] transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
            <Database className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="text-left">
            <h3 className="text-sm font-semibold text-white">Data Sources & Privacy</h3>
            <p className="text-xs text-[#6b6b7a]">All data is from public government records</p>
          </div>
        </div>
        <ChevronDown className={cn(
          'w-5 h-5 text-[#6b6b7a] transition-transform',
          isExpanded && 'rotate-180'
        )} />
      </button>

      {/* Expandable Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="p-4 pt-0 space-y-4">
              {/* Privacy Notice */}
              <div className="p-3 rounded-lg bg-emerald-500/5 border border-emerald-500/10">
                <div className="flex items-start gap-2">
                  <Shield className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="text-xs text-emerald-400 font-medium mb-1">Privacy & Transparency</p>
                    <p className="text-[11px] text-[#a0a0aa] leading-relaxed">
                      All information displayed on Civic Forum comes from publicly available government
                      databases and official disclosures. We do not collect, store, or sell any personal
                      data about our users. Senator data is sourced from official congressional records
                      and legally required financial disclosures.
                    </p>
                  </div>
                </div>
              </div>

              {/* Sources Grid */}
              <div className="space-y-2">
                <p className="text-xs text-[#6b6b7a] uppercase tracking-wide">Data Sources ({dataSources.length})</p>
                <div className="grid gap-2">
                  {dataSources.map((source) => (
                    <a
                      key={source.name}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-white/[0.12] transition-colors"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                            source.isOfficial
                              ? 'bg-blue-500/10 text-blue-400'
                              : 'bg-white/[0.04] text-[#6b6b7a]'
                          )}>
                            {source.icon}
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-medium text-white">{source.name}</span>
                              {source.isOfficial && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-blue-500/10 text-blue-400 border border-blue-500/20 uppercase">
                                  Official
                                </span>
                              )}
                            </div>
                            <p className="text-[11px] text-[#6b6b7a] mt-0.5 line-clamp-2">{source.description}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                              {source.dataTypes.slice(0, 3).map((type) => (
                                <span
                                  key={type}
                                  className="px-1.5 py-0.5 rounded text-[9px] bg-white/[0.04] text-[#a0a0aa]"
                                >
                                  {type}
                                </span>
                              ))}
                              {source.dataTypes.length > 3 && (
                                <span className="px-1.5 py-0.5 rounded text-[9px] bg-white/[0.04] text-[#6b6b7a]">
                                  +{source.dataTypes.length - 3} more
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                        <ExternalLink className="w-4 h-4 text-[#3d3d4a] group-hover:text-[#6b6b7a] transition-colors shrink-0" />
                      </div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Footer Note */}
              <p className="text-[10px] text-[#3d3d4a] text-center pt-2 border-t border-white/[0.04]">
                Data accuracy depends on official filings. Updates may be delayed based on source refresh rates.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
