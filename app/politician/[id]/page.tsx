'use client';

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { SenatorPhoto } from '@/components/SenatorPhoto';
import {
  ArrowLeft,
  Download,
  AlertTriangle,
  TrendingUp,
  Vote,
  Calendar,
  Building2,
  DollarSign,
  Users,
  ExternalLink,
  Wallet,
  Link2,
  GraduationCap,
  Loader2,
  Twitter,
  Facebook,
  Youtube,
  Phone,
  Globe,
  MapPin,
} from 'lucide-react';
import { fetchSenators, Senator } from '@/lib/data';
import { cn, getPartyColor, getPartyBgClass, getPartyName } from '@/lib/utils';
import { TradeTimeline } from '@/components/TradeTimeline';
import { VotingRecordChart } from '@/components/VotingRecordChart';
import { FundingGroups } from '@/components/FundingGroups';
import { CompanyConnections } from '@/components/CompanyConnections';
import { BackgroundInfo } from '@/components/BackgroundInfo';
import { FECFundraising } from '@/components/FECFundraising';
import { BillsSponsored } from '@/components/BillsSponsored';
import { RealStockTrades } from '@/components/RealStockTrades';
import { WikipediaBio } from '@/components/WikipediaBio';
import { NewsSentiment } from '@/components/NewsSentiment';
import { IdeologyScore } from '@/components/IdeologyScore';
import { ConflictDetector } from '@/components/ConflictDetector';
import { WatchlistButton } from '@/components/WatchlistButton';
import { DarkMoneyTracker } from '@/components/DarkMoneyTracker';
import { CorruptionTimeline } from '@/components/CorruptionTimeline';
import { LobbyistConnections } from '@/components/LobbyistConnections';
import { VotingStreak } from '@/components/VotingStreak';
import { FileText, BookOpen, Newspaper, Scale, ShieldAlert, Flame, EyeOff, Clock, Briefcase } from 'lucide-react';

export default function PoliticianProfile() {
  const params = useParams();
  const [senator, setSenator] = useState<Senator | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSenators().then(senators => {
      const found = senators.find(s =>
        s.id === (params.id as string).toLowerCase() ||
        s.bioguideId.toLowerCase() === (params.id as string).toLowerCase()
      );
      setSenator(found || null);
      setLoading(false);
    });
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#050508] bg-grid flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-blue-400 animate-spin mx-auto mb-4" />
          <p className="text-[#6b6b7a]">Loading dossier...</p>
        </div>
      </div>
    );
  }

  if (!senator) {
    return (
      <div className="min-h-screen bg-[#050508] bg-grid flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-white mb-4">Senator Not Found</h1>
          <p className="text-[#6b6b7a] mb-8">The requested dossier does not exist.</p>
          <Link
            href="/"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Return to Command Center
          </Link>
        </div>
      </div>
    );
  }

  const partyColor = getPartyColor(senator.party);
  const hasConflicts = senator.conflicts.length > 0;
  const yearsInOffice = new Date().getFullYear() - senator.since;

  return (
    <div className="min-h-screen bg-[#050508] bg-grid">
      {/* Header */}
      <div className="border-b border-white/[0.04] bg-[#050508]/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link
            href="/"
            className="flex items-center gap-2 text-[#6b6b7a] hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm">All Senators</span>
          </Link>
          <div className="flex items-center gap-3">
            <span className="text-xs text-[#3d3d4a] font-mono">DOSSIER #{senator.id.toUpperCase()}</span>
            <WatchlistButton
              politicianId={senator.id}
              politicianName={senator.name}
              politicianParty={senator.party}
              politicianState={senator.state}
              politicianChamber="senate"
            />
            <button className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400 hover:bg-blue-500/20 transition-colors text-sm">
              <Download className="w-4 h-4" />
              Export Dossier
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="relative overflow-hidden rounded-2xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-8 mb-8"
        >
          {/* Background gradient */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 0% 0%, ${partyColor}20, transparent 50%)`,
            }}
          />

          <div className="relative flex flex-col md:flex-row gap-8">
            {/* Photo */}
            <div className="shrink-0">
              <div
                className="w-32 h-32 md:w-40 md:h-40 rounded-2xl overflow-hidden"
                style={{
                  boxShadow: `0 0 0 3px ${partyColor}, 0 0 40px ${partyColor}30`,
                }}
              >
                <SenatorPhoto
                  src={senator.photo}
                  alt={senator.name}
                  size={160}
                  party={senator.party}
                  className="w-full h-full"
                />
              </div>
            </div>

            {/* Info */}
            <div className="flex-1">
              <div className="flex flex-wrap items-start gap-3 mb-4">
                <h1 className="text-3xl md:text-4xl font-bold text-white">{senator.name}</h1>
                <div
                  className={cn(
                    'px-3 py-1 rounded-lg text-sm font-semibold border',
                    getPartyBgClass(senator.party)
                  )}
                >
                  {getPartyName(senator.party)}
                </div>
                {hasConflicts && (
                  <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <AlertTriangle className="w-4 h-4 text-amber-400" />
                    <span className="text-sm font-medium text-amber-400">
                      {senator.conflicts.length} Conflicts
                    </span>
                  </div>
                )}
              </div>

              <p className="text-lg text-[#6b6b7a] mb-4">
                {senator.state} • Serving since {senator.since} ({yearsInOffice} years)
              </p>

              {senator.bio && (
                <p className="text-sm text-[#6b6b7a] max-w-2xl leading-relaxed">{senator.bio}</p>
              )}

              {/* Contact & Social Links */}
              <div className="flex flex-wrap items-center gap-3 mt-4">
                {senator.website && (
                  <a
                    href={senator.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-[#6b6b7a] hover:text-white hover:border-blue-500/30 transition-colors"
                  >
                    <Globe className="w-4 h-4" />
                    <span>Website</span>
                  </a>
                )}
                {senator.phone && (
                  <a
                    href={`tel:${senator.phone}`}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-[#6b6b7a] hover:text-white hover:border-green-500/30 transition-colors"
                  >
                    <Phone className="w-4 h-4" />
                    <span>{senator.phone}</span>
                  </a>
                )}
                {senator.twitter && (
                  <a
                    href={`https://twitter.com/${senator.twitter}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-[#6b6b7a] hover:text-white hover:border-blue-400/30 transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                    <span>@{senator.twitter}</span>
                  </a>
                )}
                {senator.facebook && (
                  <a
                    href={`https://facebook.com/${senator.facebook}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-[#6b6b7a] hover:text-white hover:border-blue-600/30 transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                    <span>Facebook</span>
                  </a>
                )}
                {senator.youtube && (
                  <a
                    href={`https://youtube.com/${senator.youtube}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-[#6b6b7a] hover:text-white hover:border-red-500/30 transition-colors"
                  >
                    <Youtube className="w-4 h-4" />
                    <span>YouTube</span>
                  </a>
                )}
                {senator.office && (
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-[#6b6b7a]">
                    <MapPin className="w-4 h-4" />
                    <span className="max-w-[200px] truncate">{senator.office}</span>
                  </div>
                )}
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
                <QuickStat
                  icon={<DollarSign className="w-5 h-5" />}
                  label="Net Worth"
                  value={senator.netWorth}
                  change={senator.netWorthChange}
                />
                <QuickStat
                  icon={<TrendingUp className="w-5 h-5" />}
                  label="Stock Trades"
                  value={senator.stockTrades.toString()}
                  highlight={senator.stockTrades > 50}
                />
                <QuickStat
                  icon={<Vote className="w-5 h-5" />}
                  label="Party Votes"
                  value={`${senator.partyVotes}%`}
                />
                <QuickStat
                  icon={<Calendar className="w-5 h-5" />}
                  label="Attendance"
                  value={`${senator.attendance}%`}
                  warning={senator.attendance < 85}
                />
              </div>
            </div>
          </div>
        </motion.div>

        {/* Background Info - Education & Career */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05, duration: 0.5 }}
          className="mb-8"
        >
          <div className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Background</h3>
                <p className="text-xs text-[#6b6b7a]">Education & Career History</p>
              </div>
            </div>
            <BackgroundInfo
              education={senator.education}
              previousCareer={senator.previousCareer}
            />
          </div>
        </motion.div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* STOCK Act Trades - Spans 2 columns */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="lg:col-span-2 rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">STOCK Act Trades</h3>
                <p className="text-xs text-[#6b6b7a]">Real trading data from Senate disclosures</p>
              </div>
            </div>
            <RealStockTrades senatorName={senator.name} />
          </motion.div>

          {/* Voting Record */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <Vote className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Voting Record</h3>
                <p className="text-xs text-[#6b6b7a]">Recent legislative activity</p>
              </div>
            </div>
            <VotingRecordChart
              votes={senator.recentVotes || []}
              partyVotes={senator.partyVotes}
            />
          </motion.div>

          {/* Funding Groups */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Wallet className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Funding Groups</h3>
                <p className="text-xs text-[#6b6b7a]">PACs & Major Contributors</p>
              </div>
            </div>
            <FundingGroups groups={senator.fundingGroups || []} />
          </motion.div>

          {/* Company Connections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center">
                <Link2 className="w-5 h-5 text-blue-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Corporate Connections</h3>
                <p className="text-xs text-[#6b6b7a]">Business & Financial Ties</p>
              </div>
            </div>
            <CompanyConnections connections={senator.companyConnections || []} />
          </motion.div>

          {/* Committees */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Building2 className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Committees</h3>
                <p className="text-xs text-[#6b6b7a]">{senator.committees.length} assignments</p>
              </div>
            </div>
            {senator.committees.length > 0 ? (
              <div className="space-y-2">
                {senator.committees.map((committee, index) => (
                  <motion.div
                    key={committee}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.35 + index * 0.05 }}
                    className="p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-purple-500/30 transition-colors"
                  >
                    <span className="text-sm text-white">{committee}</span>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                  <Building2 className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm text-[#6b6b7a]">Committee data coming soon</p>
                <p className="text-xs text-[#3d3d4a] mt-1">Connect Congress.gov API for assignments</p>
              </div>
            )}
          </motion.div>

          {/* FEC Fundraising Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.32, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Campaign Finance</h3>
                <p className="text-xs text-[#6b6b7a]">FEC Fundraising Data</p>
              </div>
            </div>
            <FECFundraising fecId={senator.fec_id} />
          </motion.div>

          {/* Bills Sponsored */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.34, duration: 0.5 }}
            className="lg:col-span-2 rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                <FileText className="w-5 h-5 text-indigo-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Bills Sponsored</h3>
                <p className="text-xs text-[#6b6b7a]">Recent legislation</p>
              </div>
            </div>
            <BillsSponsored bioguideId={senator.bioguideId} />
          </motion.div>

          {/* Top Donors */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.36, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-green-500/10 border border-green-500/20 flex items-center justify-center">
                <Users className="w-5 h-5 text-green-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Top Donors</h3>
                <p className="text-xs text-[#6b6b7a]">Campaign contributions</p>
              </div>
            </div>
            {senator.topDonors.length > 0 ? (
              <div className="space-y-3">
                {senator.topDonors.map((donor, index) => (
                  <motion.div
                    key={donor.name}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-green-500/30 transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium text-white">{donor.name}</p>
                      <p className="text-xs text-[#6b6b7a]">{donor.industry}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-mono font-semibold text-green-400">{donor.amount}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-3">
                  <Users className="w-6 h-6 text-blue-400" />
                </div>
                <p className="text-sm text-[#6b6b7a]">Donor data coming soon</p>
                <p className="text-xs text-[#3d3d4a] mt-1">Connect FEC & OpenSecrets APIs</p>
              </div>
            )}
          </motion.div>

          {/* Conflict Detection (Algorithm) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <ShieldAlert className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Conflict Detection</h3>
                <p className="text-xs text-[#6b6b7a]">Automated corruption analysis</p>
              </div>
            </div>
            <ConflictDetector
              senatorName={senator.name}
              committees={senator.committees}
              stockTrades={senator.stockTrades}
              party={senator.party}
            />
          </motion.div>

          {/* Wikipedia Bio */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.42, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center">
                <BookOpen className="w-5 h-5 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Biography</h3>
                <p className="text-xs text-[#6b6b7a]">From Wikipedia</p>
              </div>
            </div>
            <WikipediaBio senatorName={senator.name} />
          </motion.div>

          {/* News Coverage */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.44, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Newspaper className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">News Coverage</h3>
                <p className="text-xs text-[#6b6b7a]">Recent media mentions</p>
              </div>
            </div>
            <NewsSentiment senatorName={senator.name} />
          </motion.div>

          {/* Ideology Score */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.46, duration: 0.5 }}
            className="lg:col-span-2 rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-violet-500/10 border border-violet-500/20 flex items-center justify-center">
                <Scale className="w-5 h-5 text-violet-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Political Ideology</h3>
                <p className="text-xs text-[#6b6b7a]">Liberal ↔ Conservative spectrum</p>
              </div>
            </div>
            <IdeologyScore partyVotes={senator.partyVotes || 85} party={senator.party} />
          </motion.div>

          {/* Voting Streak */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.48, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-orange-500/10 border border-orange-500/20 flex items-center justify-center">
                <Flame className="w-5 h-5 text-orange-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Voting Streak</h3>
                <p className="text-xs text-[#6b6b7a]">Attendance & consistency</p>
              </div>
            </div>
            <VotingStreak
              recentVotes={senator.recentVotes || []}
              attendance={senator.attendance}
            />
          </motion.div>

          {/* Dark Money Tracker */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                <EyeOff className="w-5 h-5 text-red-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Dark Money</h3>
                <p className="text-xs text-[#6b6b7a]">Undisclosed funding sources</p>
              </div>
            </div>
            <DarkMoneyTracker senatorName={senator.name} opensecrets_id={senator.opensecrets_id} />
          </motion.div>

          {/* Lobbyist Connections */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.52, duration: 0.5 }}
            className="lg:col-span-2 rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-purple-500/10 border border-purple-500/20 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-purple-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Lobbyist Connections</h3>
                <p className="text-xs text-[#6b6b7a]">Who's lobbying this senator</p>
              </div>
            </div>
            <LobbyistConnections senatorName={senator.name} state={senator.state} />
          </motion.div>

          {/* Corruption Timeline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.54, duration: 0.5 }}
            className="lg:col-span-3 rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06] p-6"
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-lg bg-amber-500/10 border border-amber-500/20 flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">Activity Timeline</h3>
                <p className="text-xs text-[#6b6b7a]">Cross-referenced trades, votes & donations</p>
              </div>
            </div>
            <CorruptionTimeline
                  senatorName={senator.name}
                  stockTrades={senator.stockTrades}
                  party={senator.party}
                />
          </motion.div>
        </div>

        {/* External Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
          className="mt-8 p-6 rounded-xl bg-[#0a0a0f]/80 backdrop-blur-xl border border-white/[0.06]"
        >
          <h3 className="text-lg font-semibold text-white mb-4">Official Sources</h3>
          <div className="flex flex-wrap gap-3">
            <ExternalLinkButton
              href={`https://www.congress.gov/member/${senator.bioguideId}`}
              label="Congress.gov Profile"
            />
            {senator.fec_id && (
              <ExternalLinkButton
                href={`https://www.fec.gov/data/candidate/${senator.fec_id}/`}
                label="FEC Filings"
              />
            )}
            {senator.opensecrets_id && (
              <ExternalLinkButton
                href={`https://www.opensecrets.org/members-of-congress/summary?cid=${senator.opensecrets_id}`}
                label="OpenSecrets Profile"
              />
            )}
            <ExternalLinkButton
              href={`https://efdsearch.senate.gov/search/`}
              label="Financial Disclosures"
            />
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="border-t border-white/[0.04] py-8 mt-12">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <p className="text-xs text-[#3d3d4a] font-mono">
            // ALL DATA IS PUBLIC RECORD • SOURCED FROM OFFICIAL GOVERNMENT DATABASES //
          </p>
        </div>
      </footer>
    </div>
  );
}

function QuickStat({
  icon,
  label,
  value,
  change,
  highlight = false,
  warning = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  change?: number;
  highlight?: boolean;
  warning?: boolean;
}) {
  return (
    <div
      className={cn(
        'p-4 rounded-lg border transition-colors',
        highlight
          ? 'bg-amber-500/10 border-amber-500/20'
          : warning
          ? 'bg-red-500/5 border-red-500/20'
          : 'bg-white/[0.02] border-white/[0.04]'
      )}
    >
      <div className={cn('mb-2', highlight ? 'text-amber-400' : warning ? 'text-red-400' : 'text-[#6b6b7a]')}>
        {icon}
      </div>
      <div className="flex items-baseline gap-2">
        <span
          className={cn(
            'text-xl font-bold font-mono',
            highlight ? 'text-amber-400' : warning ? 'text-red-400' : 'text-white'
          )}
        >
          {value}
        </span>
        {change !== undefined && (
          <span className={cn('text-xs font-mono', change > 0 ? 'text-green-400' : 'text-red-400')}>
            {change > 0 ? '+' : ''}
            {change}%
          </span>
        )}
      </div>
      <div className="text-xs text-[#6b6b7a] uppercase tracking-wide mt-1">{label}</div>
    </div>
  );
}

function ExternalLinkButton({ href, label }: { href: string; label: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center gap-2 px-4 py-2 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-[#6b6b7a] hover:text-white hover:border-blue-500/30 transition-colors"
    >
      {label}
      <ExternalLink className="w-3 h-3" />
    </a>
  );
}
