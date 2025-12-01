'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { TrendingUp, TrendingDown, Loader2, BarChart3, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TradingDataPoint {
  month: string;
  senatorReturn: number;
  sp500Return: number;
  tradeCount: number;
}

interface TradingPerformanceChartProps {
  bioguideId: string;
}

// CustomTooltip component moved outside
interface TradingTooltipPayload {
  payload: TradingDataPoint;
}

interface TradingTooltipProps {
  active?: boolean;
  payload?: TradingTooltipPayload[];
  label?: string;
}

function TradingCustomTooltip({ active, payload, label }: TradingTooltipProps) {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-[#0a0a0f] border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="text-xs text-[#6b6b7a] mb-2">{label}</p>
        <div className="space-y-1">
          <p className="text-sm">
            <span className="text-blue-400">Senator: </span>
            <span className={cn(
              "font-mono font-bold",
              dataPoint.senatorReturn >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {dataPoint.senatorReturn >= 0 ? '+' : ''}{dataPoint.senatorReturn.toFixed(1)}%
            </span>
          </p>
          <p className="text-sm">
            <span className="text-amber-400">S&P 500: </span>
            <span className={cn(
              "font-mono font-bold",
              dataPoint.sp500Return >= 0 ? "text-green-400" : "text-red-400"
            )}>
              {dataPoint.sp500Return >= 0 ? '+' : ''}{dataPoint.sp500Return.toFixed(1)}%
            </span>
          </p>
          <p className="text-xs text-[#6b6b7a] mt-2">
            {dataPoint.tradeCount} trades this month
          </p>
        </div>
      </div>
    );
  }
  return null;
}

export function TradingPerformanceChart({ bioguideId }: TradingPerformanceChartProps) {
  const [data, setData] = useState<TradingDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/historical/${bioguideId}`)
      .then(res => res.json())
      .then(result => {
        setData(result.tradingPerformance || []);
        setLoading(false);
      })
      .catch(() => {
        setError('Failed to load trading data');
        setLoading(false);
      });
  }, [bioguideId]);

  // Calculate cumulative returns
  const calculateCumulativeReturns = () => {
    if (data.length === 0) return { senator: 0, sp500: 0 };

    let senatorCumulative = 1;
    let sp500Cumulative = 1;

    data.forEach(point => {
      senatorCumulative *= (1 + point.senatorReturn / 100);
      sp500Cumulative *= (1 + point.sp500Return / 100);
    });

    return {
      senator: ((senatorCumulative - 1) * 100),
      sp500: ((sp500Cumulative - 1) * 100),
    };
  };

  const cumulativeReturns = calculateCumulativeReturns();
  const outperformance = cumulativeReturns.senator - cumulativeReturns.sp500;
  const isOutperforming = outperformance > 0;

  const totalTrades = data.reduce((sum, d) => sum + d.tradeCount, 0);
  const avgMonthlyReturn = data.length > 0
    ? data.reduce((sum, d) => sum + d.senatorReturn, 0) / data.length
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-6 h-6 text-blue-400 animate-spin" />
      </div>
    );
  }

  if (error || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <BarChart3 className="w-10 h-10 text-[#3d3d4a] mb-3" />
        <p className="text-sm text-[#6b6b7a]">Trading performance data unavailable</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 rounded-xl bg-blue-500/5 border border-blue-500/10"
        >
          <span className="text-xs text-blue-400/70">Senator Return</span>
          <p className={cn(
            "text-lg font-bold mt-1",
            cumulativeReturns.senator >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {cumulativeReturns.senator >= 0 ? '+' : ''}{cumulativeReturns.senator.toFixed(1)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10"
        >
          <span className="text-xs text-amber-400/70">S&P 500</span>
          <p className={cn(
            "text-lg font-bold mt-1",
            cumulativeReturns.sp500 >= 0 ? "text-green-400" : "text-red-400"
          )}>
            {cumulativeReturns.sp500 >= 0 ? '+' : ''}{cumulativeReturns.sp500.toFixed(1)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            "p-3 rounded-xl border",
            isOutperforming
              ? "bg-emerald-500/5 border-emerald-500/10"
              : "bg-red-500/5 border-red-500/10"
          )}
        >
          <div className="flex items-center gap-1">
            {isOutperforming ? (
              <TrendingUp className="w-3 h-3 text-emerald-400" />
            ) : (
              <TrendingDown className="w-3 h-3 text-red-400" />
            )}
            <span className={cn(
              "text-xs",
              isOutperforming ? "text-emerald-400/70" : "text-red-400/70"
            )}>
              vs Market
            </span>
          </div>
          <p className={cn(
            "text-lg font-bold mt-1",
            isOutperforming ? "text-emerald-400" : "text-red-400"
          )}>
            {outperformance >= 0 ? '+' : ''}{outperformance.toFixed(1)}%
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="p-3 rounded-xl bg-purple-500/5 border border-purple-500/10"
        >
          <span className="text-xs text-purple-400/70">Total Trades</span>
          <p className="text-lg font-bold text-purple-400 mt-1">
            {totalTrades}
          </p>
        </motion.div>
      </div>

      {/* Chart */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="h-64 mt-4"
      >
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          >
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#1a1a24"
              vertical={false}
            />
            <XAxis
              dataKey="month"
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b6b7a', fontSize: 11 }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: '#6b6b7a', fontSize: 11 }}
              tickFormatter={(value) => `${value}%`}
              width={45}
            />
            <Tooltip content={<TradingCustomTooltip />} />
            <Legend
              wrapperStyle={{ paddingTop: '10px' }}
              formatter={(value) => (
                <span className="text-xs text-[#6b6b7a]">{value}</span>
              )}
            />
            <Line
              type="monotone"
              dataKey="senatorReturn"
              name="Senator"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ r: 3, fill: '#3b82f6' }}
              activeDot={{ r: 5, fill: '#3b82f6' }}
            />
            <Line
              type="monotone"
              dataKey="sp500Return"
              name="S&P 500"
              stroke="#f59e0b"
              strokeWidth={2}
              dot={{ r: 3, fill: '#f59e0b' }}
              activeDot={{ r: 5, fill: '#f59e0b' }}
              strokeDasharray="5 5"
            />
          </LineChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Performance Analysis */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className={cn(
          "p-3 rounded-lg border",
          isOutperforming
            ? "bg-emerald-500/5 border-emerald-500/10"
            : "bg-amber-500/5 border-amber-500/10"
        )}
      >
        <div className="flex items-start gap-2">
          <Info className={cn(
            "w-4 h-4 shrink-0 mt-0.5",
            isOutperforming ? "text-emerald-400" : "text-amber-400"
          )} />
          <div>
            <p className={cn(
              "text-sm font-medium",
              isOutperforming ? "text-emerald-400" : "text-amber-400"
            )}>
              {isOutperforming
                ? `Outperforming the market by ${outperformance.toFixed(1)}%`
                : `Underperforming the market by ${Math.abs(outperformance).toFixed(1)}%`
              }
            </p>
            <p className="text-xs text-[#6b6b7a] mt-1">
              Based on {data.length} months of trading data with {totalTrades} disclosed trades.
              Average monthly return: {avgMonthlyReturn >= 0 ? '+' : ''}{avgMonthlyReturn.toFixed(2)}%
            </p>
          </div>
        </div>
      </motion.div>

      {/* Disclaimer */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]">
        <Info className="w-4 h-4 text-[#6b6b7a] shrink-0 mt-0.5" />
        <p className="text-xs text-[#6b6b7a]">
          Performance estimates based on disclosed trade timing and public market data.
          Actual returns may differ due to undisclosed holdings and transaction costs.
        </p>
      </div>
    </div>
  );
}
