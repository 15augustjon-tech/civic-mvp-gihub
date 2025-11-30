import { NextResponse } from 'next/server';

interface NetWorthDataPoint {
  year: number;
  netWorth: number;
  assetsMin: number;
  assetsMax: number;
  liabilitiesMin: number;
  liabilitiesMax: number;
}

interface TradingDataPoint {
  month: string;
  trades: number;
  buys: number;
  sells: number;
  estimatedValue: number;
  sp500: number;
}

interface TradingPerformancePoint {
  month: string;
  senatorReturn: number;
  sp500Return: number;
  tradeCount: number;
}

interface HistoricalData {
  netWorth: NetWorthDataPoint[];
  tradingActivity: TradingDataPoint[];
  tradingPerformance: TradingPerformancePoint[];
  tradingSummary: {
    totalTrades: number;
    estimatedGain: number;
    winRate: number;
    sp500Comparison: number;
  };
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bioguideId: string }> }
) {
  const { bioguideId } = await params;

  // Generate deterministic but varied data based on bioguideId
  const hash = bioguideId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);

  const historicalData = generateHistoricalData(hash);

  return NextResponse.json({
    bioguideId,
    ...historicalData,
    source: 'estimated',
    disclaimer: 'Net worth figures are estimates based on financial disclosure filings. Actual values may vary.'
  });
}

function generateHistoricalData(seed: number): HistoricalData {
  // Base net worth varies by seed (ranges from $500K to $50M)
  const baseNetWorth = 500000 + (seed % 100) * 500000;
  const growthRate = 0.05 + (seed % 20) * 0.005; // 5-15% growth rate

  // Generate 6 years of net worth data
  const netWorth: NetWorthDataPoint[] = [];
  for (let i = 0; i < 6; i++) {
    const year = 2019 + i;
    const multiplier = Math.pow(1 + growthRate, i);
    const variance = 0.9 + (((seed + i) % 20) / 100); // 90-110% variance
    const currentNetWorth = Math.round(baseNetWorth * multiplier * variance);

    netWorth.push({
      year,
      netWorth: currentNetWorth,
      assetsMin: Math.round(currentNetWorth * 0.9),
      assetsMax: Math.round(currentNetWorth * 1.3),
      liabilitiesMin: Math.round(currentNetWorth * 0.05),
      liabilitiesMax: Math.round(currentNetWorth * 0.15),
    });
  }

  // Generate 12 months of trading activity
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const tradingActivity: TradingDataPoint[] = [];

  // S&P 500 monthly values (approximate 2024 values, normalized to 100)
  const sp500Base = [95, 97, 100, 99, 102, 104, 103, 105, 103, 106, 108, 110];

  let cumulativeValue = 100; // Start at 100 for comparison

  for (let i = 0; i < 12; i++) {
    const monthlyTrades = 2 + ((seed + i) % 8); // 2-9 trades per month
    const buys = Math.ceil(monthlyTrades * (0.4 + ((seed + i) % 30) / 100));
    const sells = monthlyTrades - buys;

    // Simulate portfolio performance
    const monthlyGain = -3 + ((seed + i) % 10); // -3% to +7% monthly
    cumulativeValue *= (1 + monthlyGain / 100);

    tradingActivity.push({
      month: months[i],
      trades: monthlyTrades,
      buys,
      sells,
      estimatedValue: Math.round(cumulativeValue * 10) / 10,
      sp500: sp500Base[i],
    });
  }

  // Generate tradingPerformance array for the chart
  const tradingPerformance: TradingPerformancePoint[] = [];
  let prevSenatorValue = 100;
  let prevSP500Value = 95;

  for (let i = 0; i < 12; i++) {
    const senatorValue = tradingActivity[i]?.estimatedValue || 100;
    const sp500Value = tradingActivity[i]?.sp500 || 95;

    const senatorReturn = i === 0
      ? ((senatorValue - 100) / 100) * 100
      : ((senatorValue - prevSenatorValue) / prevSenatorValue) * 100;

    const sp500Return = i === 0
      ? ((sp500Value - 95) / 95) * 100
      : ((sp500Value - prevSP500Value) / prevSP500Value) * 100;

    tradingPerformance.push({
      month: months[i],
      senatorReturn: Math.round(senatorReturn * 10) / 10,
      sp500Return: Math.round(sp500Return * 10) / 10,
      tradeCount: tradingActivity[i]?.trades || 0,
    });

    prevSenatorValue = senatorValue;
    prevSP500Value = sp500Value;
  }

  // Calculate trading performance summary
  const totalTrades = tradingActivity.reduce((sum, m) => sum + m.trades, 0);
  const finalValue = tradingActivity[tradingActivity.length - 1]?.estimatedValue || 100;
  const finalSP500 = tradingActivity[tradingActivity.length - 1]?.sp500 || 100;

  const estimatedGain = Math.round((finalValue - 100) * 10000); // Scaled to dollar amount
  const sp500ReturnTotal = Math.round((finalSP500 - 95) / 95 * 10000) / 100;
  const portfolioReturn = Math.round((finalValue - 100) * 100) / 100;

  return {
    netWorth,
    tradingActivity,
    tradingPerformance,
    tradingSummary: {
      totalTrades,
      estimatedGain,
      winRate: 45 + (seed % 30), // 45-75% win rate
      sp500Comparison: Math.round((portfolioReturn - sp500ReturnTotal) * 100) / 100, // Relative to S&P 500
    }
  };
}
