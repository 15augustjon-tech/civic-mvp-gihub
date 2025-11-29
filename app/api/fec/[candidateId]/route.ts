import { NextResponse } from 'next/server';

const API_KEY = process.env.FEC_API_KEY;
const BASE = 'https://api.open.fec.gov/v1';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ candidateId: string }> }
) {
  const { candidateId } = await params;

  if (!API_KEY) {
    return NextResponse.json({ error: 'FEC API key not configured' }, { status: 500 });
  }

  try {
    // Get candidate totals for 2024 cycle
    const res = await fetch(
      `${BASE}/candidate/${candidateId}/totals/?api_key=${API_KEY}&cycle=2024`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'FEC API error' }, { status: res.status });
    }

    const data = await res.json();
    const totals = data.results?.[0] || null;

    if (!totals) {
      return NextResponse.json({
        receipts: 0,
        disbursements: 0,
        cashOnHand: 0,
        debt: 0,
        individualContributions: 0,
        pacContributions: 0,
        cycle: 2024,
      });
    }

    return NextResponse.json({
      receipts: totals.receipts || 0,
      disbursements: totals.disbursements || 0,
      cashOnHand: totals.cash_on_hand_end_period || 0,
      debt: totals.debts_owed_by_committee || 0,
      individualContributions: totals.individual_contributions || 0,
      pacContributions: totals.other_political_committee_contributions || 0,
      cycle: 2024,
    });
  } catch (error) {
    console.error('FEC API error:', error);
    return NextResponse.json({ error: 'Failed to fetch FEC data' }, { status: 500 });
  }
}
