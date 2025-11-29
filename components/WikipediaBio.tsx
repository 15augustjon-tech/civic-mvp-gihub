'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { BookOpen, ExternalLink, Loader2 } from 'lucide-react';

interface WikipediaBioProps {
  senatorName: string;
}

export function WikipediaBio({ senatorName }: WikipediaBioProps) {
  const [data, setData] = useState<{
    title: string;
    summary: string;
    thumbnail: string | null;
    url: string;
  } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/wikipedia/${encodeURIComponent(senatorName)}`)
      .then(res => res.json())
      .then(result => {
        if (result.summary) {
          setData(result);
        }
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [senatorName]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-10 h-10 rounded-full bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-2">
          <BookOpen className="w-5 h-5 text-blue-400" />
        </div>
        <p className="text-sm text-[#6b6b7a]">Wikipedia summary unavailable</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-3"
    >
      <p className="text-sm text-[#a0a0aa] leading-relaxed">
        {data.summary}
      </p>
      <a
        href={data.url}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 text-xs text-blue-400 hover:text-blue-300 transition-colors"
      >
        Read full biography on Wikipedia
        <ExternalLink className="w-3 h-3" />
      </a>
    </motion.div>
  );
}
