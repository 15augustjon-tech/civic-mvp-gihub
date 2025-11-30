'use client';

import { motion } from 'framer-motion';
import { AlertTriangle, TrendingUp, DollarSign, Vote, FileText, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimelineEvent {
  date: string;
  type: 'trade' | 'vote' | 'donation' | 'bill' | 'scandal';
  title: string;
  description: string;
  severity?: 'high' | 'medium' | 'low';
  connection?: string;
}

interface CorruptionTimelineProps {
  events?: TimelineEvent[];
  senatorName?: string;
  stockTrades?: number;
  party?: 'R' | 'D' | 'I';
}

// Generate timeline events based on senator data
function generateTimelineEvents(senatorName: string, stockTrades: number, party: 'R' | 'D' | 'I'): TimelineEvent[] {
  const hash = senatorName.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const events: TimelineEvent[] = [];

  // Sample tickers and amounts
  const tickers = ['NVDA', 'AAPL', 'MSFT', 'GOOGL', 'META', 'AMZN', 'JPM', 'XOM', 'LMT', 'PFE'];
  const amounts = ['$50K-$100K', '$100K-$250K', '$250K-$500K', '$500K-$1M', '$1M-$5M'];
  const committees = ['Commerce', 'Finance', 'Armed Services', 'Energy', 'Banking', 'Health'];

  // Generate trade events
  const numTrades = Math.min(stockTrades, 3) || (hash % 3) + 1;
  for (let i = 0; i < numTrades; i++) {
    const ticker = tickers[(hash + i) % tickers.length];
    const amount = amounts[(hash + i) % amounts.length];
    const isBuy = (hash + i) % 2 === 0;
    const day = 25 - (i * 5);
    const severity = amount.includes('$500K') || amount.includes('$1M') ? 'high' : (amount.includes('$250K') ? 'medium' : undefined);

    events.push({
      date: `2024-11-${day < 10 ? '0' + day : day}`,
      type: 'trade',
      title: `${isBuy ? 'Purchased' : 'Sold'} ${amount} in ${ticker}`,
      description: `Stock ${isBuy ? 'purchase' : 'sale'} disclosed in periodic transaction report`,
      severity,
      connection: severity ? `${committees[(hash + i) % committees.length]} Committee Member` : undefined,
    });
  }

  // Generate donation event
  const pacAmount = ((hash % 50) + 10) * 1000;
  events.push({
    date: '2024-11-10',
    type: 'donation',
    title: `Received $${(pacAmount).toLocaleString()} from Industry PAC`,
    description: `${party === 'R' ? 'Business' : 'Labor'} PAC contribution`,
    connection: party === 'R' ? 'Chamber of Commerce' : 'AFL-CIO',
  });

  // Generate vote event
  events.push({
    date: '2024-11-08',
    type: 'vote',
    title: `Voted ${(hash % 2 === 0) ? 'YEA' : 'NAY'} on Key Legislation`,
    description: 'Legislative vote on committee-related bill',
    severity: 'medium',
    connection: stockTrades > 20 ? 'Potential conflict with stock holdings' : undefined,
  });

  // Generate bill event
  events.push({
    date: '2024-10-25',
    type: 'bill',
    title: `Co-sponsored S.${hash % 9000 + 1000}`,
    description: `${party === 'R' ? 'Tax reform' : 'Consumer protection'} legislation`,
  });

  return events.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function CorruptionTimeline({ events, senatorName, stockTrades = 0, party = 'D' }: CorruptionTimelineProps) {
  const getEventIcon = (type: string) => {
    switch (type) {
      case 'trade': return <TrendingUp className="w-4 h-4" />;
      case 'vote': return <Vote className="w-4 h-4" />;
      case 'donation': return <DollarSign className="w-4 h-4" />;
      case 'bill': return <FileText className="w-4 h-4" />;
      case 'scandal': return <AlertTriangle className="w-4 h-4" />;
      default: return <Calendar className="w-4 h-4" />;
    }
  };

  const getEventColor = (type: string, severity?: string) => {
    if (severity === 'high') return 'bg-red-500/10 border-red-500/30 text-red-400';
    if (severity === 'medium') return 'bg-amber-500/10 border-amber-500/30 text-amber-400';

    switch (type) {
      case 'trade': return 'bg-blue-500/10 border-blue-500/30 text-blue-400';
      case 'vote': return 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400';
      case 'donation': return 'bg-green-500/10 border-green-500/30 text-green-400';
      case 'bill': return 'bg-purple-500/10 border-purple-500/30 text-purple-400';
      case 'scandal': return 'bg-red-500/10 border-red-500/30 text-red-400';
      default: return 'bg-white/[0.04] border-white/[0.08] text-[#6b6b7a]';
    }
  };

  // Generate timeline data based on senator info or use provided events
  const sampleEvents: TimelineEvent[] = events && events.length > 0
    ? events
    : senatorName
      ? generateTimelineEvents(senatorName, stockTrades, party)
      : [
          {
            date: '2024-11-15',
            type: 'trade',
            title: 'Purchased $500K in NVDA',
            description: 'Large NVIDIA purchase before AI chip legislation vote',
            severity: 'high',
            connection: 'Commerce Committee Member',
          },
          {
            date: '2024-11-10',
            type: 'donation',
            title: 'Received $50K from Tech PAC',
            description: 'Technology Industry PAC contribution',
            connection: 'Silicon Valley Leadership Group',
          },
          {
            date: '2024-11-08',
            type: 'vote',
            title: 'Voted YEA on CHIPS Act Extension',
            description: 'Supported semiconductor industry funding',
            severity: 'medium',
            connection: 'Potential conflict with NVDA holding',
          },
          {
            date: '2024-10-25',
            type: 'bill',
            title: 'Co-sponsored S.2847',
            description: 'Technology investment tax credits bill',
          },
        ];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-[#6b6b7a] uppercase tracking-wide">Activity Timeline</p>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-red-500" />
          <span className="text-[10px] text-[#6b6b7a]">Potential Conflicts</span>
        </div>
      </div>

      {/* Timeline */}
      <div className="relative">
        {/* Vertical line */}
        <div className="absolute left-4 top-0 bottom-0 w-px bg-gradient-to-b from-white/[0.08] via-white/[0.04] to-transparent" />

        {/* Events */}
        <div className="space-y-4">
          {sampleEvents.map((event, index) => (
            <motion.div
              key={`${event.date}-${index}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="relative pl-10"
            >
              {/* Icon */}
              <div className={cn(
                'absolute left-0 w-8 h-8 rounded-lg border flex items-center justify-center',
                getEventColor(event.type, event.severity)
              )}>
                {getEventIcon(event.type)}
              </div>

              {/* Content */}
              <div className={cn(
                'p-3 rounded-lg border transition-colors',
                event.severity === 'high'
                  ? 'bg-red-500/5 border-red-500/20 hover:border-red-500/40'
                  : event.severity === 'medium'
                  ? 'bg-amber-500/5 border-amber-500/20 hover:border-amber-500/40'
                  : 'bg-white/[0.02] border-white/[0.04] hover:border-white/[0.08]'
              )}>
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="text-sm font-medium text-white">{event.title}</p>
                  <span className="text-[10px] text-[#6b6b7a] shrink-0">
                    {new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                <p className="text-xs text-[#a0a0aa]">{event.description}</p>
                {event.connection && (
                  <div className="flex items-center gap-1 mt-2 px-2 py-1 rounded bg-white/[0.02] border border-white/[0.04] w-fit">
                    <AlertTriangle className="w-3 h-3 text-amber-400" />
                    <span className="text-[10px] text-amber-400">{event.connection}</span>
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-3 pt-2 border-t border-white/[0.04]">
        {['trade', 'vote', 'donation', 'bill'].map((type) => (
          <div key={type} className="flex items-center gap-1.5">
            <div className={cn('w-4 h-4 rounded flex items-center justify-center', getEventColor(type))}>
              {getEventIcon(type)}
            </div>
            <span className="text-[10px] text-[#6b6b7a] capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
