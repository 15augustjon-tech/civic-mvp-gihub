'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FileText, ExternalLink, Loader2, ChevronRight } from 'lucide-react';

interface Bill {
  number: string;
  title: string;
  type: string;
  congress: number;
  introducedDate: string;
  latestAction: string;
  latestActionDate: string | null;
  url: string;
}

interface BillsSponsoredProps {
  bioguideId: string;
}

export function BillsSponsored({ bioguideId }: BillsSponsoredProps) {
  const [bills, setBills] = useState<Bill[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/bills/${bioguideId}`)
      .then(res => res.json())
      .then(data => {
        if (data.error) {
          setError(data.error);
        } else {
          setBills(data.bills || []);
        }
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load bills');
        setLoading(false);
      });
  }, [bioguideId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
          <FileText className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-sm text-[#6b6b7a]">Unable to load bills</p>
        <p className="text-xs text-[#3d3d4a] mt-1">{error}</p>
      </div>
    );
  }

  if (bills.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-8 text-center">
        <div className="w-12 h-12 rounded-full bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-3">
          <FileText className="w-6 h-6 text-indigo-400" />
        </div>
        <p className="text-sm text-[#6b6b7a]">No sponsored legislation found</p>
        <p className="text-xs text-[#3d3d4a] mt-1">Check Congress.gov for full history</p>
      </div>
    );
  }

  const getBillTypeColor = (type: string) => {
    switch (type.toUpperCase()) {
      case 'S':
        return 'bg-blue-500/10 border-blue-500/20 text-blue-400';
      case 'SRES':
        return 'bg-purple-500/10 border-purple-500/20 text-purple-400';
      case 'SJRES':
        return 'bg-amber-500/10 border-amber-500/20 text-amber-400';
      default:
        return 'bg-gray-500/10 border-gray-500/20 text-gray-400';
    }
  };

  return (
    <div className="space-y-3">
      {bills.slice(0, 5).map((bill, index) => (
        <motion.a
          key={`${bill.type}-${bill.number}`}
          href={`https://www.congress.gov/bill/${bill.congress}th-congress/senate-bill/${bill.number}`}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, x: -10 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="block p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-indigo-500/30 transition-all group"
        >
          <div className="flex items-start gap-3">
            <div className={`px-2 py-0.5 rounded text-xs font-mono border ${getBillTypeColor(bill.type)}`}>
              {bill.type}.{bill.number}
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-sm text-white group-hover:text-indigo-400 transition-colors line-clamp-2">
                {bill.title}
              </h4>
              <p className="text-xs text-[#6b6b7a] mt-1">
                Introduced {new Date(bill.introducedDate).toLocaleDateString()}
              </p>
              <p className="text-xs text-[#3d3d4a] mt-1 line-clamp-1">
                {bill.latestAction}
              </p>
            </div>
            <ChevronRight className="w-4 h-4 text-[#3d3d4a] group-hover:text-indigo-400 transition-colors shrink-0" />
          </div>
        </motion.a>
      ))}

      {bills.length > 5 && (
        <a
          href={`https://www.congress.gov/member/${bioguideId}?q=%7B%22sponsorship%22%3A%22sponsored%22%7D`}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 py-3 text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
        >
          View all {bills.length}+ bills on Congress.gov
          <ExternalLink className="w-4 h-4" />
        </a>
      )}
    </div>
  );
}
