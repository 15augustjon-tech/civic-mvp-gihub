import { NextResponse } from 'next/server';

// Primary and fallback URLs for congress legislators data
const LEGISLATORS_URLS = [
  'https://unitedstates.github.io/congress-legislators/legislators-current.json',
  'https://theunitedstates.io/congress-legislators/legislators-current.json',
];
const SOCIAL_URLS = [
  'https://unitedstates.github.io/congress-legislators/legislators-social-media.json',
  'https://theunitedstates.io/congress-legislators/legislators-social-media.json',
];

const stateNames: Record<string, string> = {
  'AL': 'Alabama', 'AK': 'Alaska', 'AZ': 'Arizona', 'AR': 'Arkansas', 'CA': 'California',
  'CO': 'Colorado', 'CT': 'Connecticut', 'DE': 'Delaware', 'FL': 'Florida', 'GA': 'Georgia',
  'HI': 'Hawaii', 'ID': 'Idaho', 'IL': 'Illinois', 'IN': 'Indiana', 'IA': 'Iowa',
  'KS': 'Kansas', 'KY': 'Kentucky', 'LA': 'Louisiana', 'ME': 'Maine', 'MD': 'Maryland',
  'MA': 'Massachusetts', 'MI': 'Michigan', 'MN': 'Minnesota', 'MS': 'Mississippi', 'MO': 'Missouri',
  'MT': 'Montana', 'NE': 'Nebraska', 'NV': 'Nevada', 'NH': 'New Hampshire', 'NJ': 'New Jersey',
  'NM': 'New Mexico', 'NY': 'New York', 'NC': 'North Carolina', 'ND': 'North Dakota', 'OH': 'Ohio',
  'OK': 'Oklahoma', 'OR': 'Oregon', 'PA': 'Pennsylvania', 'RI': 'Rhode Island', 'SC': 'South Carolina',
  'SD': 'South Dakota', 'TN': 'Tennessee', 'TX': 'Texas', 'UT': 'Utah', 'VT': 'Vermont',
  'VA': 'Virginia', 'WA': 'Washington', 'WV': 'West Virginia', 'WI': 'Wisconsin', 'WY': 'Wyoming',
};

// Helper to try multiple URLs with fallback
async function fetchWithFallback(urls: string[]): Promise<Response | null> {
  for (const url of urls) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);

      const res = await fetch(url, {
        signal: controller.signal,
        headers: {
          'Accept': 'application/json',
          'User-Agent': 'CivicForum/1.0'
        }
      });

      clearTimeout(timeoutId);

      if (res.ok) {
        return res;
      }
    } catch (error) {
      console.log(`Failed to fetch from ${url}, trying next...`);
    }
  }
  return null;
}

export async function GET() {
  try {
    const [legislatorsRes, socialRes] = await Promise.all([
      fetchWithFallback(LEGISLATORS_URLS),
      fetchWithFallback(SOCIAL_URLS)
    ]);

    if (!legislatorsRes) {
      console.error('Failed to fetch legislators from all sources');
      return NextResponse.json({ error: 'Failed to fetch legislators' }, { status: 500 });
    }

    const legislators = await legislatorsRes.json();
    const socialData = socialRes ? await socialRes.json() : [];

    // Build social media lookup
    const socialLookup: Record<string, any> = {};
    socialData.forEach((s: any) => {
      if (s.id?.bioguide && s.social) {
        socialLookup[s.id.bioguide] = s.social;
      }
    });

    // Filter to current senators only
    const currentSenators = legislators.filter((leg: any) => {
      const currentTerm = leg.terms?.[leg.terms.length - 1];
      return currentTerm?.type === 'sen' && new Date(currentTerm.end) > new Date();
    });

    // Transform to our Senator format
    const result = currentSenators.map((leg: any) => {
      const term = leg.terms[leg.terms.length - 1];
      const firstSenTerm = leg.terms.find((t: any) => t.type === 'sen');
      const social = socialLookup[leg.id.bioguide] || {};

      let party: 'R' | 'D' | 'I' = 'I';
      if (term.party === 'Republican') party = 'R';
      else if (term.party === 'Democrat' || term.party === 'Democratic') party = 'D';

      const bioguideId = leg.id.bioguide;

      return {
        id: bioguideId.toLowerCase(),
        bioguideId: bioguideId,
        name: leg.name.official_full || `${leg.name.first} ${leg.name.last}`,
        firstName: leg.name.first,
        lastName: leg.name.last,
        state: stateNames[term.state] || term.state,
        stateAbbr: term.state,
        party,
        photo: `https://www.congress.gov/img/member/${bioguideId.toLowerCase()}_200.jpg`,
        since: firstSenTerm ? new Date(firstSenTerm.start).getFullYear() : new Date(term.start).getFullYear(),
        termEnd: term.end,
        stateRank: term.state_rank,
        phone: term.phone,
        website: term.url,
        office: term.address,
        twitter: social.twitter,
        facebook: social.facebook,
        youtube: social.youtube,
        opensecrets_id: leg.id.opensecrets,
        fec_id: leg.id.fec?.[0],
        netWorth: 'N/A',
        netWorthChange: 0,
        stockTrades: 0,
        partyVotes: 0,
        attendance: 0,
        committees: [],
        conflicts: [],
        recentTrades: [],
        topDonors: [],
      };
    });

    // Sort by last name
    result.sort((a: any, b: any) => a.lastName.localeCompare(b.lastName));

    return NextResponse.json(result, {
      headers: {
        'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=43200'
      }
    });
  } catch (error) {
    console.error('Error fetching senators:', error);
    return NextResponse.json({ error: 'Failed to fetch senators' }, { status: 500 });
  }
}
