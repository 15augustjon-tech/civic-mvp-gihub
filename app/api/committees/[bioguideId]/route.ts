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
    // Get member details which includes committee assignments
    const res = await fetch(
      `${BASE}/member/${bioguideId}?api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) {
      return NextResponse.json({ error: 'Congress API error' }, { status: res.status });
    }

    const data = await res.json();
    const member = data.member;

    if (!member) {
      return NextResponse.json({ committees: [] });
    }

    // Extract committees from current term
    const committees: string[] = [];

    if (member.terms && member.terms.length > 0) {
      const currentTerm = member.terms[member.terms.length - 1];
      if (currentTerm?.committees) {
        currentTerm.committees.forEach((c: any) => {
          if (c.name) committees.push(c.name);
        });
      }
    }

    // Also check for a separate committee assignments array
    if (member.committees) {
      member.committees.forEach((c: any) => {
        const name = c.name || c.committee?.name;
        if (name && !committees.includes(name)) {
          committees.push(name);
        }
      });
    }

    return NextResponse.json({
      committees,
      bioguideId,
    });
  } catch (error) {
    console.error('Congress API error:', error);
    return NextResponse.json({ error: 'Failed to fetch committees' }, { status: 500 });
  }
}
