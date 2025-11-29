'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Newspaper, ExternalLink, Loader2, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Article {
  title: string;
  url: string;
  source: string;
  date: string;
  image: string | null;
}

interface NewsSentimentProps {
  senatorName: string;
}

export function NewsSentiment({ senatorName }: NewsSentimentProps) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/news/${encodeURIComponent(senatorName)}`)
      .then(res => res.json())
      .then(data => {
        setArticles(data.articles || []);
        if (data.error) setError(data.error);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load news');
        setLoading(false);
      });
  }, [senatorName]);

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '';
    // GDELT returns dates like "20241115T120000Z"
    try {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      return new Date(`${year}-${month}-${day}`).toLocaleDateString();
    } catch {
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8">
        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
      </div>
    );
  }

  if (error || articles.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-6 text-center">
        <div className="w-10 h-10 rounded-full bg-purple-500/10 border border-purple-500/20 flex items-center justify-center mb-2">
          <Newspaper className="w-5 h-5 text-purple-400" />
        </div>
        <p className="text-sm text-[#6b6b7a]">No recent news found</p>
        <p className="text-xs text-[#3d3d4a] mt-1">{error || 'Try again later'}</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {/* News Count */}
      <div className="flex items-center justify-between pb-2 border-b border-white/[0.04]">
        <span className="text-xs text-[#6b6b7a]">Recent Coverage</span>
        <span className="text-xs font-mono text-white">{articles.length} articles</span>
      </div>

      {/* Article List */}
      <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
        {articles.slice(0, 5).map((article, index) => (
          <motion.a
            key={`${article.url}-${index}`}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="block p-3 rounded-lg bg-white/[0.02] border border-white/[0.04] hover:border-purple-500/30 transition-colors group"
          >
            <h4 className="text-sm text-white group-hover:text-purple-400 transition-colors line-clamp-2 mb-1">
              {article.title}
            </h4>
            <div className="flex items-center justify-between text-xs text-[#6b6b7a]">
              <span className="truncate max-w-[150px]">{article.source}</span>
              <span>{formatDate(article.date)}</span>
            </div>
          </motion.a>
        ))}
      </div>

      {/* Data Source */}
      <p className="text-xs text-[#3d3d4a] text-center pt-2">
        News via GDELT Project
      </p>
    </div>
  );
}
