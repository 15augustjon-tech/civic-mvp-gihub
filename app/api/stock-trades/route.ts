import { NextResponse } from 'next/server';

// Fallback realistic stock trade data based on public disclosures
// Note: Only current U.S. Senators included - data is illustrative based on public reporting patterns
const fallbackTrades = [
  { senator: 'Tommy Tuberville', ticker: 'NVDA', asset_description: 'NVIDIA Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-11-15', disclosure_date: '2024-11-20', owner: 'Self' },
  { senator: 'Tommy Tuberville', ticker: 'AAPL', asset_description: 'Apple Inc.', asset_type: 'Stock', type: 'Sale', amount: '$1,001 - $15,000', transaction_date: '2024-11-14', disclosure_date: '2024-11-19', owner: 'Self' },
  { senator: 'Tommy Tuberville', ticker: 'MSFT', asset_description: 'Microsoft Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-11-10', disclosure_date: '2024-11-15', owner: 'Self' },
  { senator: 'Tommy Tuberville', ticker: 'GOOGL', asset_description: 'Alphabet Inc.', asset_type: 'Stock', type: 'Purchase', amount: '$50,001 - $100,000', transaction_date: '2024-11-08', disclosure_date: '2024-11-13', owner: 'Self' },
  { senator: 'Tommy Tuberville', ticker: 'TSLA', asset_description: 'Tesla Inc.', asset_type: 'Stock', type: 'Sale', amount: '$15,001 - $50,000', transaction_date: '2024-11-05', disclosure_date: '2024-11-10', owner: 'Self' },
  { senator: 'Markwayne Mullin', ticker: 'XOM', asset_description: 'Exxon Mobil Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$50,001 - $100,000', transaction_date: '2024-11-12', disclosure_date: '2024-11-17', owner: 'Self' },
  { senator: 'Markwayne Mullin', ticker: 'CVX', asset_description: 'Chevron Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-11-11', disclosure_date: '2024-11-16', owner: 'Spouse' },
  { senator: 'Markwayne Mullin', ticker: 'OXY', asset_description: 'Occidental Petroleum', asset_type: 'Stock', type: 'Sale', amount: '$1,001 - $15,000', transaction_date: '2024-11-09', disclosure_date: '2024-11-14', owner: 'Self' },
  { senator: 'John Hoeven', ticker: 'BA', asset_description: 'Boeing Company', asset_type: 'Stock', type: 'Purchase', amount: '$100,001 - $250,000', transaction_date: '2024-11-08', disclosure_date: '2024-11-13', owner: 'Self' },
  { senator: 'Bill Hagerty', ticker: 'LMT', asset_description: 'Lockheed Martin', asset_type: 'Stock', type: 'Purchase', amount: '$50,001 - $100,000', transaction_date: '2024-11-06', disclosure_date: '2024-11-11', owner: 'Self' },
  { senator: 'Rick Scott', ticker: 'HII', asset_description: 'Huntington Ingalls Industries', asset_type: 'Stock', type: 'Sale', amount: '$50,001 - $100,000', transaction_date: '2024-11-04', disclosure_date: '2024-11-09', owner: 'Self' },
  { senator: 'Mitt Romney', ticker: 'AMZN', asset_description: 'Amazon.com Inc.', asset_type: 'Stock', type: 'Sale', amount: '$250,001 - $500,000', transaction_date: '2024-11-03', disclosure_date: '2024-11-08', owner: 'Spouse' },
  { senator: 'Cynthia Lummis', ticker: 'META', asset_description: 'Meta Platforms Inc.', asset_type: 'Stock', type: 'Purchase', amount: '$100,001 - $250,000', transaction_date: '2024-11-01', disclosure_date: '2024-11-06', owner: 'Self' },
  { senator: 'Tim Scott', ticker: 'V', asset_description: 'Visa Inc.', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-10-30', disclosure_date: '2024-11-04', owner: 'Self' },
  { senator: 'Rand Paul', ticker: 'MRNA', asset_description: 'Moderna Inc.', asset_type: 'Stock', type: 'Sale', amount: '$1,001 - $15,000', transaction_date: '2024-10-28', disclosure_date: '2024-11-02', owner: 'Spouse' },
  { senator: 'Roger Marshall', ticker: 'PFE', asset_description: 'Pfizer Inc.', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-10-25', disclosure_date: '2024-10-30', owner: 'Self' },
  { senator: 'John Hickenlooper', ticker: 'PSX', asset_description: 'Phillips 66', asset_type: 'Stock', type: 'Sale', amount: '$15,001 - $50,000', transaction_date: '2024-10-22', disclosure_date: '2024-10-27', owner: 'Self' },
  { senator: 'Mark Kelly', ticker: 'RTX', asset_description: 'RTX Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$1,001 - $15,000', transaction_date: '2024-10-20', disclosure_date: '2024-10-25', owner: 'Self' },
  { senator: 'Gary Peters', ticker: 'F', asset_description: 'Ford Motor Company', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-10-18', disclosure_date: '2024-10-23', owner: 'Self' },
  { senator: 'Sheldon Whitehouse', ticker: 'NEE', asset_description: 'NextEra Energy', asset_type: 'Stock', type: 'Purchase', amount: '$50,001 - $100,000', transaction_date: '2024-10-15', disclosure_date: '2024-10-20', owner: 'Self' },
  { senator: 'Ron Wyden', ticker: 'INTC', asset_description: 'Intel Corporation', asset_type: 'Stock', type: 'Sale', amount: '$15,001 - $50,000', transaction_date: '2024-10-12', disclosure_date: '2024-10-17', owner: 'Self' },
  { senator: 'Dan Sullivan', ticker: 'APA', asset_description: 'APA Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$50,001 - $100,000', transaction_date: '2024-10-10', disclosure_date: '2024-10-15', owner: 'Self' },
  { senator: 'Ted Cruz', ticker: 'OXY', asset_description: 'Occidental Petroleum', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-10-08', disclosure_date: '2024-10-13', owner: 'Self' },
  { senator: 'Josh Hawley', ticker: 'JPM', asset_description: 'JPMorgan Chase & Co.', asset_type: 'Stock', type: 'Sale', amount: '$1,001 - $15,000', transaction_date: '2024-10-05', disclosure_date: '2024-10-10', owner: 'Spouse' },
  { senator: 'Pete Ricketts', ticker: 'BRK.B', asset_description: 'Berkshire Hathaway Inc.', asset_type: 'Stock', type: 'Purchase', amount: '$250,001 - $500,000', transaction_date: '2024-10-03', disclosure_date: '2024-10-08', owner: 'Self' },
];

// Try to fetch from Senate Stock Watcher GitHub data
const SENATE_TRADES_URLS = [
  'https://raw.githubusercontent.com/timothycarambat/senate-stock-watcher-data/master/data/all_transactions.json',
  'https://senate-stock-watcher-data.s3.amazonaws.com/all_transactions.json',
];

export async function GET() {
  // Try external sources first
  for (const url of SENATE_TRADES_URLS) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000), // 5 second timeout
      });

      if (res.ok) {
        const trades = await res.json();
        const recentTrades = trades
          .slice(0, 100)
          .map((trade: any) => ({
            senator: trade.senator,
            ticker: trade.ticker,
            assetDescription: trade.asset_description,
            assetType: trade.asset_type,
            type: trade.type,
            amount: trade.amount,
            transactionDate: trade.transaction_date,
            disclosureDate: trade.disclosure_date,
            ptrLink: trade.ptr_link,
            owner: trade.owner,
          }));

        return NextResponse.json({
          trades: recentTrades,
          total: trades.length,
          lastUpdated: new Date().toISOString(),
          source: 'live',
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
    }
  }

  // Fallback to realistic mock data
  const formattedTrades = fallbackTrades.map((trade) => ({
    senator: trade.senator,
    ticker: trade.ticker,
    assetDescription: trade.asset_description,
    assetType: trade.asset_type,
    type: trade.type,
    amount: trade.amount,
    transactionDate: trade.transaction_date,
    disclosureDate: trade.disclosure_date,
    owner: trade.owner,
  }));

  return NextResponse.json({
    trades: formattedTrades,
    total: fallbackTrades.length,
    lastUpdated: new Date().toISOString(),
    source: 'fallback',
  });
}
