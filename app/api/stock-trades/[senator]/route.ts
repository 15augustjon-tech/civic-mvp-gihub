import { NextResponse } from 'next/server';

// Senate Stock Watcher data from GitHub
const SENATE_TRADES_URL = 'https://raw.githubusercontent.com/timothycarambat/senate-stock-watcher-data/refs/heads/master/data/all_transactions.json';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ senator: string }> }
) {
  const { senator } = await params;
  const senatorName = decodeURIComponent(senator);

  try {
    const res = await fetch(SENATE_TRADES_URL, {
      next: { revalidate: 3600 }
    });

    if (!res.ok) {
      return NextResponse.json({ error: 'Failed to fetch stock trades' }, { status: 500 });
    }

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

    // Calculate stats
    const purchases = senatorTrades.filter((t: any) => t.type?.toLowerCase().includes('purchase')).length;
    const sales = senatorTrades.filter((t: any) => t.type?.toLowerCase().includes('sale')).length;

    return NextResponse.json({
      trades: formattedTrades,
      stats: {
        total: senatorTrades.length,
        purchases,
        sales,
      },
    });
  } catch (error) {
    console.error('Stock trades API error:', error);
    return NextResponse.json({ error: 'Failed to fetch stock trades' }, { status: 500 });
  }
}
