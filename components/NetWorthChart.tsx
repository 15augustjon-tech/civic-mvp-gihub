'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { DollarSign, TrendingUp, TrendingDown, Loader2, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NetWorthDataPoint {
  year: number;
  netWorth: number;
  assetsMin: number;
  assetsMax: number;
  liabilitiesMin: number;
  liabilitiesMax: number;
}

interface NetWorthChartProps {
  bioguideId: string;
  currentNetWorth?: string;
}

// Helper functions
function formatCurrency(value: number) {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value}`;
}

function formatFullCurrency(value: number) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

// CustomTooltip component moved outside
interface TooltipPayload {
  payload: NetWorthDataPoint;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: TooltipPayload[];
  label?: string;
}

function CustomTooltip({ active, payload, label }: CustomTooltipProps) {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-[#0a0a0f] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-[#6b6b7a] mb-2">{label}</p>
        <p className="text-lg font-bold text-white mb-1">
          {formatFullCurrency(dataPoint.netWorth)}
        </p>
        <div className="text-xs text-[#6b6b7a] space-y-1">
          <p>Assets: {formatCurrency(dataPoint.assetsMin)} - {formatCurrency(dataPoint.assetsMax)}</p>
          <p>Liabilities: {formatCurrency(dataPoint.liabilitiesMin)} - {formatCurrency(dataPoint.liabilitiesMax)}</p>
        </div>
      </div>
    );
  }
  return null;
}

export function NetWorthChart({ bioguideId, currentNetWorth }: NetWorthChartProps) {
  const [data, setData] = useState<NetWorthDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/historical/${bioguideId}`)
      .then(res => res.json())
      .then(result => {
        setData(result.netWorth || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load historical data');
        setLoading(false);
      });
  }, [bioguideId]);

  // Calculate growth
  const firstValue = data[0]?.netWorth || 0;
  const lastValue = data[data.length - 1]?.netWorth || 0;
  const totalGrowth = firstValue > 0 ? ((lastValue - firstValue) / firstValue) * 100 : 0;
  const isPositiveGrowth = totalGrowth >= 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-emerald-400 animate-spin" />
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <DollarSign className="w-10 h-10 text-[#3d3d4a] mb-3" />
        <p className="text-sm text-[#6b6b7a]">Net worth data unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-emerald-500/5 border border-emerald-500/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-emerald-400" />
            <span className="text-xs text-emerald-400/70">Current Est.</span>
          </div>
          <p className="text-xl font-bold text-emerald-400">
            {currentNetWorth || formatCurrency(lastValue)}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-4 rounded-xl border",
            isPositiveGrowth
              ? "bg-green-500/5 border-green-500/10"
              : "bg-red-500/5 border-red-500/10"
          )}
        >
          <div className="flex items-center gap-2 mb-2">
            {isPositiveGrowth ? (
              <TrendingUp className="w-4 h-4 text-green-400" />
            ) : (
              <TrendingDown className="w-4 h-4 text-red-400" />
            )}
            <span className={cn(
              "text-xs",
              isPositiveGrowth ? "text-green-400/70" : "text-red-400/70"
            )}>
              6-Year Change
            </span>
          </div>
          <p className={cn(
            "text-xl font-bold",
            isPositiveGrowth ? "text-green-400" : "text-red-400"
          )}>
            {isPositiveGrowth ? '+' : ''}{totalGrowth.toFixed(1)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-4 rounded-xl bg-blue-500/5 border border-blue-500/10"
        >
          <div className="flex items-center gap-2 mb-2">
            <DollarSign className="w-4 h-4 text-blue-400" />
            <span className="text-xs text-blue-400/70">Growth</span>
          </div>
          <p className="text-xl font-bold text-blue-400">
            {formatCurrency(Math.abs(lastValue - firstValue))}
          </p>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="h-64 mt-4"
      >
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <defs>
              <linearGradient id="netWorthGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1a1a24"
              vertical={false}
            />
            <XAxis
              dataKey="year"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b6b7a', fontSize: 12 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b6b7a', fontSize: 12 }}
              tickFormatter={formatCurrency}
              width={60}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="netWorth"
              stroke="#10b981"
              strokeWidth={2}
              fillOpacity={1}
              fill="url(#netWorthGradient)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/5 border border-amber-500/10">
        <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
        <p className="text-xs text-amber-400/80">
          Net worth estimates based on annual financial disclosure filings.
          Actual values may vary due to reporting ranges and market fluctuations.
        </p>
      </div>
    </div>
  );
}
