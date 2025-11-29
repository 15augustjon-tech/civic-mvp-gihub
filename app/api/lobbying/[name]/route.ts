import { NextResponse } from 'next/server';

// Senate LDA (Lobbying Disclosure Act) API
export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const searchName = decodeURIComponent(name);

  try {
    // Senate LDA API - search for lobbying filings mentioning this senator
    const ldaUrl = `https://lda.senate.gov/api/v1/filings/?filing_year=2024&search=${encodeURIComponent(searchName)}&format=json`;

    const res = await fetch(ldaUrl, {
      next: { revalidate: 86400 }
    });

    if (!res.ok) {
      // LDA API might require different params
      return NextResponse.json({
        filings: [],
        total: 0,
        note: 'Lobbying data is being aggregated'
      });
    }

    const data = await res.json();
    const filings = (data.results || []).slice(0, 20).map((filing: any) => ({
      registrantName: filing.registrant?.name || 'Unknown',
      clientName: filing.client?.name || 'Unknown',
      filingType: filing.filing_type,
      filingYear: filing.filing_year,
      amount: filing.income || filing.expenses,
      issues: filing.lobbying_activities?.map((a: any) => a.general_issue_code) || [],
    }));

    return NextResponse.json({
      filings,
      total: data.count || 0,
      senator: searchName,
    });
  } catch (error) {
    console.error('LDA API error:', error);
    return NextResponse.json({
      filings: [],
      total: 0,
      error: 'Lobbying data unavailable'
    });
  }
}
