import { NextResponse } from 'next/server';

// Senate Stock Watcher data from GitHub
const SENATE_TRADES_URL = 'https://raw.githubusercontent.com/timothycarambat/senate-stock-watcher-data/refs/heads/master/data/all_transactions.json';

export async function GET() {
  try {
    const res = await fetch(SENATE_TRADES_URL, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch stock trades' }, { status: 500 });
    }

    const trades = await res.json();

    // Get recent trades (last 100)
    const recentTrades = trades
      .slice(0, 100)
      .map((trade: any) => ({
        senator: trade.senator,
        ticker: trade.ticker,
        assetDescription: trade.asset_description,
        assetType: trade.asset_type,
        type: trade.type, // purchase, sale, exchange
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
    });
  } catch (error) {
    console.error('Stock trades API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock trades' }, { status: 500 });
  }
}
