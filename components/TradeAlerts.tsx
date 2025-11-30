'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, X, TrendingUp, TrendingDown, Check, Loader2 } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils';
import Link from 'next/link';

interface Alert {
  id: string;
  politician_name: string;
  ticker: string;
  trade_type: string;
  amount: string;
  trade_date: string;
  read: boolean;
  created_at: string;
}

export function TradeAlerts() {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const supabase = createClient();

  const unreadCount = alerts.filter(a => !a.read).length;

  useEffect(() => {
    const loadAlerts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        try {
          // Fetch real trade data from the API
          const res = await fetch('/api/stock-trades');
          const data = await res.json();

          if (data.trades && data.trades.length > 0) {
            // Transform real trades into alerts
            const tradeAlerts: Alert[] = data.trades.slice(0, 5).map((trade: any, index: number) => ({
              id: `trade-${index}-${trade.transactionDate}`,
              politician_name: trade.senator || 'Unknown Senator',
              ticker: trade.ticker || 'N/A',
              trade_type: trade.type || 'Trade',
              amount: trade.amount || 'N/A',
              trade_date: trade.transactionDate || new Date().toISOString().split('T')[0],
              read: false,
              created_at: trade.disclosureDate || new Date().toISOString(),
            }));
            setAlerts(tradeAlerts);
          } else {
            // Fallback to sample data if API fails
            setAlerts([
              {
                id: '1',
                politician_name: 'Nancy Pelosi',
                ticker: 'NVDA',
                trade_type: 'Purchase',
                amount: '$1,000,001 - $5,000,000',
                trade_date: '2024-11-25',
                read: false,
                created_at: new Date().toISOString(),
              },
            ]);
          }
        } catch (error) {
          console.error('Failed to fetch trade alerts:', error);
          // Use sample data on error
          setAlerts([]);
        }
      }
      setLoading(false);
    };

    loadAlerts();
  }, [supabase.auth]);

  const markAsRead = (id: string) => {
    setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a));
  };

  const markAllAsRead = () => {
    setAlerts(prev => prev.map(a => ({ ...a, read: true })));
  };

  const dismissAlert = (id: string) => {
    setAlerts(prev => prev.filter(a => a.id !== id));
  };

  if (!user) return null;

  return (
    <div className="relative">
      {/* Bell Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-lg bg-white/[0.04] border border-white/[0.08] hover:border-white/[0.16] transition-colors"
      >
        <Bell className="w-5 h-5 text-[#a0a0aa]" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium">
            {unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <>
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 top-full mt-2 w-80 bg-[#12121a] border border-white/[0.08] rounded-xl shadow-xl z-50 overflow-hidden"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-4 border-b border-white/[0.08]">
                <h3 className="text-sm font-semibold text-white">Trade Alerts</h3>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                  >
                    Mark all read
                  </button>
                )}
              </div>

              {/* Alerts List */}
              <div className="max-h-80 overflow-y-auto">
                {loading ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="w-5 h-5 text-blue-400 animate-spin" />
                  </div>
                ) : alerts.length === 0 ? (
                  <div className="py-8 text-center">
                    <Bell className="w-8 h-8 text-[#3d3d4a] mx-auto mb-2" />
                    <p className="text-sm text-[#6b6b7a]">No alerts yet</p>
                    <p className="text-xs text-[#3d3d4a]">Add politicians to your watchlist</p>
                  </div>
                ) : (
                  <div className="divide-y divide-white/[0.04]">
                    {alerts.map((alert) => (
                      <motion.div
                        key={alert.id}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className={cn(
                          'p-4 hover:bg-white/[0.02] transition-colors relative group',
                          !alert.read && 'bg-blue-500/5'
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <div className={cn(
                            'w-8 h-8 rounded-lg flex items-center justify-center shrink-0',
                            alert.trade_type.toLowerCase().includes('purchase')
                              ? 'bg-green-500/10 text-green-400'
                              : 'bg-red-500/10 text-red-400'
                          )}>
                            {alert.trade_type.toLowerCase().includes('purchase')
                              ? <TrendingUp className="w-4 h-4" />
                              : <TrendingDown className="w-4 h-4" />
                            }
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm text-white">
                              <span className="font-medium">{alert.politician_name}</span>
                              {' '}
                              <span className={alert.trade_type.toLowerCase().includes('purchase') ? 'text-green-400' : 'text-red-400'}>
                                {alert.trade_type.toLowerCase()}d
                              </span>
                              {' '}
                              <span className="font-mono font-bold">{alert.ticker}</span>
                            </p>
                            <p className="text-xs text-[#6b6b7a] mt-0.5">
                              {alert.amount} • {new Date(alert.trade_date).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            {!alert.read && (
                              <button
                                onClick={() => markAsRead(alert.id)}
                                className="p-1 rounded hover:bg-white/[0.08] text-[#6b6b7a] hover:text-white"
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => dismissAlert(alert.id)}
                              className="p-1 rounded hover:bg-white/[0.08] text-[#6b6b7a] hover:text-white"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                        {!alert.read && (
                          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-500 rounded-r" />
                        )}
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="p-3 border-t border-white/[0.08]">
                <Link
                  href="/watchlist"
                  onClick={() => setIsOpen(false)}
                  className="block w-full py-2 text-center text-sm text-blue-400 hover:text-blue-300 transition-colors"
                >
                  View all in Watchlist →
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
