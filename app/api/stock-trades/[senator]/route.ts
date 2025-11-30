import { NextResponse } from 'next/server';

// Fallback trade data mapped by senator
const fallbackTradesBySenator: Record<string, any[]> = {
  'Tuberville': [
    { ticker: 'NVDA', asset_description: 'NVIDIA Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-11-15', disclosure_date: '2024-11-20', owner: 'Self' },
    { ticker: 'AAPL', asset_description: 'Apple Inc.', asset_type: 'Stock', type: 'Sale', amount: '$1,001 - $15,000', transaction_date: '2024-11-14', disclosure_date: '2024-11-19', owner: 'Self' },
    { ticker: 'MSFT', asset_description: 'Microsoft Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-11-10', disclosure_date: '2024-11-15', owner: 'Self' },
  ],
  'Pelosi': [
    { ticker: 'RBLX', asset_description: 'Roblox Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$500,001 - $1,000,000', transaction_date: '2024-10-30', disclosure_date: '2024-11-04', owner: 'Spouse' },
    { ticker: 'CRM', asset_description: 'Salesforce Inc.', asset_type: 'Stock', type: 'Sale', amount: '$250,001 - $500,000', transaction_date: '2024-10-28', disclosure_date: '2024-11-02', owner: 'Spouse' },
    { ticker: 'DIS', asset_description: 'Walt Disney Company', asset_type: 'Stock', type: 'Purchase', amount: '$100,001 - $250,000', transaction_date: '2024-10-25', disclosure_date: '2024-10-30', owner: 'Spouse' },
  ],
  'Mullin': [
    { ticker: 'XOM', asset_description: 'Exxon Mobil Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$50,001 - $100,000', transaction_date: '2024-11-12', disclosure_date: '2024-11-17', owner: 'Self' },
    { ticker: 'CVX', asset_description: 'Chevron Corporation', asset_type: 'Stock', type: 'Purchase', amount: '$15,001 - $50,000', transaction_date: '2024-11-11', disclosure_date: '2024-11-16', owner: 'Spouse' },
  ],
  'Perdue': [
    { ticker: 'BA', asset_description: 'Boeing Company', asset_type: 'Stock', type: 'Purchase', amount: '$100,001 - $250,000', transaction_date: '2024-11-08', disclosure_date: '2024-11-13', owner: 'Self' },
    { ticker: 'LMT', asset_description: 'Lockheed Martin', asset_type: 'Stock', type: 'Purchase', amount: '$50,001 - $100,000', transaction_date: '2024-11-06', disclosure_date: '2024-11-11', owner: 'Self' },
  ],
  'Ricketts': [
    { ticker: 'BRK.B', asset_description: 'Berkshire Hathaway Inc.', asset_type: 'Stock', type: 'Purchase', amount: '$250,001 - $500,000', transaction_date: '2024-10-03', disclosure_date: '2024-10-08', owner: 'Self' },
  ],
};

// Try to fetch from Senate Stock Watcher GitHub data
const SENATE_TRADES_URLS = [
  'https://raw.githubusercontent.com/timothycarambat/senate-stock-watcher-data/master/data/all_transactions.json',
  'https://senate-stock-watcher-data.s3.amazonaws.com/all_transactions.json',
];

export async function GET(
  request: Request,
  { params }: { params: Promise<{ senator: string }> }
) {
  const { senator } = await params;
  const senatorName = decodeURIComponent(senator);

  // Try external sources first
  for (const url of SENATE_TRADES_URLS) {
    try {
      const res = await fetch(url, {
        next: { revalidate: 3600 },
        signal: AbortSignal.timeout(5000),
      });

      if (res.ok) {
        const allTrades = await res.json();

        // Filter trades for this senator (case-insensitive partial match)
        const senatorTrades = allTrades.filter((trade: any) => {
          const tradeSenator = trade.senator?.toLowerCase() || '';
          const searchName = senatorName.toLowerCase();
          return tradeSenator.includes(searchName) || searchName.includes(tradeSenator.split(' ').pop() || '');
        });

        const formattedTrades = senatorTrades.map((trade: any) => ({
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

        const purchases = senatorTrades.filter((t: any) => t.type?.toLowerCase().includes('purchase')).length;
        const sales = senatorTrades.filter((t: any) => t.type?.toLowerCase().includes('sale')).length;

        return NextResponse.json({
          trades: formattedTrades,
          stats: {
            total: senatorTrades.length,
            purchases,
            sales,
          },
          source: 'live',
        });
      }
    } catch (error) {
      console.warn(`Failed to fetch from ${url}:`, error);
    }
  }

  // Fallback to mock data for this senator
  const lastName = senatorName.split(' ').pop() || senatorName;
  const fallbackTrades = fallbackTradesBySenator[lastName] || [];

  const formattedTrades = fallbackTrades.map((trade) => ({
    ticker: trade.ticker,
    assetDescription: trade.asset_description,
    assetType: trade.asset_type,
    type: trade.type,
    amount: trade.amount,
    transactionDate: trade.transaction_date,
    disclosureDate: trade.disclosure_date,
    owner: trade.owner,
  }));

  const purchases = fallbackTrades.filter((t) => t.type?.toLowerCase().includes('purchase')).length;
  const sales = fallbackTrades.filter((t) => t.type?.toLowerCase().includes('sale')).length;

  return NextResponse.json({
    trades: formattedTrades,
    stats: {
      total: fallbackTrades.length,
      purchases,
      sales,
    },
    source: 'fallback',
  });
}
