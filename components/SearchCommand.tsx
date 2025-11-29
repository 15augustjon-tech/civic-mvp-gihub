'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Command, User, MapPin, Loader2 } from 'lucide-react';
import { fetchSenators, Senator } from '@/lib/data';
import { cn, getPartyColor } from '@/lib/utils';
import Link from 'next/link';
import Image from 'next/image';

export function SearchCommand() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [senators, setSenators] = useState<Senator[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch senators on mount
  useEffect(() => {
    fetchSenators().then(data => {
      setSenators(data);
      setLoading(false);
    });
  }, []);

  const filtered = useMemo(() => {
    if (!query) return [];
    return senators.filter(
      (s) =>
        s.name.toLowerCase().includes(query.toLowerCase()) ||
        s.state.toLowerCase().includes(query.toLowerCase())
    );
  }, [query, senators]);

  // Handle CMD+K shortcut
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
      e.preventDefault();
      setIsOpen(true);
      setIsFocused(true);
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
      setIsFocused(false);
      setQuery('');
    }
  }, []);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  const handleFocus = () => {
    setIsFocused(true);
    setIsOpen(true);
  };

  const handleBlur = () => {
    // Delay to allow clicking on results
    setTimeout(() => {
      setIsFocused(false);
      if (!query) {
        setIsOpen(false);
      }
    }, 200);
  };

  return (
    <div className="relative w-full max-w-xl">
      <div
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-xl',
          'bg-[#0a0a0f]/80 backdrop-blur-xl',
          'border transition-all duration-300',
          isFocused
            ? 'border-blue-500/40 shadow-[0_0_30px_rgba(59,130,246,0.1)]'
            : 'border-white/[0.06] hover:border-white/[0.1]'
        )}
      >
        <Search className={cn('w-5 h-5 transition-colors', isFocused ? 'text-blue-400' : 'text-[#6b6b7a]')} />
        <input
          type="text"
          placeholder="Search senators by name or state..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1 bg-transparent text-white placeholder:text-[#6b6b7a] outline-none text-sm"
        />
        <div className="flex items-center gap-1 px-2 py-1 rounded bg-white/[0.05] text-[#6b6b7a] text-xs font-mono">
          <Command className="w-3 h-3" />
          <span>K</span>
        </div>
      </div>

      {/* Results dropdown */}
      <AnimatePresence>
        {isOpen && (isFocused || query) && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 rounded-xl bg-[#0a0a0f] border border-white/[0.06] overflow-hidden shadow-2xl z-50"
          >
            {loading ? (
              <div className="px-4 py-8 text-center">
                <Loader2 className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-2" />
                <p className="text-sm text-[#6b6b7a]">Loading senators...</p>
              </div>
            ) : query && filtered.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <User className="w-8 h-8 text-[#3d3d4a] mx-auto mb-2" />
                <p className="text-sm text-[#6b6b7a]">No senators found</p>
                <p className="text-xs text-[#3d3d4a] mt-1">Try searching by name or state</p>
              </div>
            ) : query && filtered.length > 0 ? (
              <div className="max-h-[320px] overflow-y-auto">
                {filtered.map((senator, index) => (
                  <Link
                    key={senator.id}
                    href={`/politician/${senator.id}`}
                    onClick={() => {
                      setQuery('');
                      setIsOpen(false);
                    }}
                  >
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="flex items-center gap-3 px-4 py-3 hover:bg-white/[0.03] transition-colors border-b border-white/[0.03] last:border-0"
                    >
                      <div
                        className="w-10 h-10 rounded-full overflow-hidden shrink-0"
                        style={{
                          boxShadow: `0 0 0 2px ${getPartyColor(senator.party)}`,
                        }}
                      >
                        <Image
                          src={senator.photo}
                          alt={senator.name}
                          width={40}
                          height={40}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-white truncate">{senator.name}</div>
                        <div className="flex items-center gap-2 text-xs text-[#6b6b7a]">
                          <MapPin className="w-3 h-3" />
                          <span>{senator.state}</span>
                          <span>•</span>
                          <span
                            className={cn(
                              senator.party === 'R'
                                ? 'text-red-400'
                                : senator.party === 'D'
                                ? 'text-blue-400'
                                : 'text-purple-400'
                            )}
                          >
                            {senator.party}
                          </span>
                        </div>
                      </div>
                      {senator.conflicts.length > 0 && (
                        <div className="px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 text-xs font-mono">
                          {senator.conflicts.length} alerts
                        </div>
                      )}
                    </motion.div>
                  </Link>
                ))}
              </div>
            ) : senators.length > 0 ? (
              <div className="px-4 py-6">
                <p className="text-xs text-[#6b6b7a] uppercase tracking-wide mb-3">Quick Access</p>
                <div className="grid grid-cols-2 gap-2">
                  {senators.slice(0, 4).map((senator) => (
                    <Link
                      key={senator.id}
                      href={`/politician/${senator.id}`}
                      onClick={() => setIsOpen(false)}
                      className="flex items-center gap-2 p-2 rounded-lg hover:bg-white/[0.03] transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full overflow-hidden"
                        style={{
                          boxShadow: `0 0 0 1.5px ${getPartyColor(senator.party)}`,
                        }}
                      >
                        <Image
                          src={senator.photo}
                          alt={senator.name}
                          width={32}
                          height={32}
                          className="w-full h-full object-cover"
                          unoptimized
                        />
                      </div>
                      <span className="text-xs text-white truncate">{senator.lastName}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
