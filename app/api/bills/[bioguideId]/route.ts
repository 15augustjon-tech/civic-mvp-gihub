import { NextResponse } from 'next/server';

const API_KEY = process.env.CONGRESS_API_KEY;
const BASE = 'https://api.congress.gov/v3';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ bioguideId: string }> }
) {
  const { bioguideId } = await params;

  if (!API_KEY) {
    return NextResponse.json({ error: 'Congress API key not configured' }, { status: 500 });
  }

  try {
    // Get sponsored legislation
    const res = await fetch(
      `${BASE}/member/${bioguideId}/sponsored-legislation?api_key=${API_KEY}&limit=10`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Congress API error' }, { status: res.status });
    }

    const data = await res.json();
    const bills = data.sponsoredLegislation || [];

    // Format the bills
    const formattedBills = bills.map((bill: any) => ({
      number: bill.number,
      title: bill.title,
      type: bill.type,
      congress: bill.congress,
      introducedDate: bill.introducedDate,
      latestAction: bill.latestAction?.text || 'No action',
      latestActionDate: bill.latestAction?.actionDate || null,
      url: bill.url,
    }));

    return NextResponse.json({
      bills: formattedBills,
      total: bills.length,
    });
  } catch (error) {
    console.error('Congress API error:', error);
    return NextResponse.json({ error: 'Failed to fetch bills' }, { status: 500 });
  }
}
