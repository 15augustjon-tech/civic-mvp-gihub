// =============================================================================
// CIVIC FORUM - DATA TYPES & REAL DATA FETCHING
// =============================================================================
// Fetches real senator data from @unitedstates/congress-legislators
// Photos from Congress.gov official headshots
// =============================================================================

export interface Trade {
  date: string;
  ticker: string;
  company: string;
  type: 'BUY' | 'SELL';
  amount: string;
  potentialConflict?: string;
  estimatedGain?: string;
}

export interface Donor {
  name: string;
  amount: string;
  industry: string;
}

export interface FundingGroup {
  name: string;
  amount: string;
  type: 'PAC' | 'Super PAC' | 'Industry' | 'Individual';
}

export interface CompanyConnection {
  company: string;
  relationship: string;
  details?: string;
}

export interface VoteRecord {
  date: string;
  bill: string;
  vote: 'YEA' | 'NAY' | 'ABSTAIN';
  description: string;
}

export interface Senator {
  id: string;
  bioguideId: string;
  name: string;
  firstName: string;
  lastName: string;
  state: string;
  stateAbbr: string;
  party: 'R' | 'D' | 'I';
  photo: string;
  since: number;
  termEnd?: string;
  stateRank?: string;
  phone?: string;
  website?: string;
  office?: string;
  twitter?: string;
  facebook?: string;
  youtube?: string;
  opensecrets_id?: string;
  fec_id?: string;
  netWorth: string;
  netWorthChange: number;
  stockTrades: number;
  partyVotes: number;
  attendance: number;
  committees: string[];
  conflicts: string[];
  recentTrades: Trade[];
  topDonors: Donor[];
  bio?: string;
  education?: string[];
  previousCareer?: string[];
  fundingGroups?: FundingGroup[];
  companyConnections?: CompanyConnection[];
  recentVotes?: VoteRecord[];
  estimatedTradeGains?: string;
}

export interface Bill {
  id: string;
  title: string;
  description: string;
  status: 'Introduced' | 'Committee' | 'Floor Vote' | 'Passed' | 'Failed';
  date: string;
  sponsor: string;
  yeas: number;
  nays: number;
  category: string;
}

// State abbreviation to full name
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

// =============================================================================
// FETCH REAL SENATORS FROM PUBLIC SOURCE (NO API KEY NEEDED)
// =============================================================================

const LEGISLATORS_URL = 'https://theunitedstates.io/congress-legislators/legislators-current.json';
const SOCIAL_URL = 'https://theunitedstates.io/congress-legislators/legislators-social-media.json';

// Mutable senators array that gets populated
export let senators: Senator[] = [];
export const recentBills: Bill[] = [];

// Fetch real senators with official Congress.gov headshots
export async function fetchSenators(): Promise<Senator[]> {
  try {
    const [legislatorsRes, socialRes] = await Promise.all([
      fetch(LEGISLATORS_URL, { next: { revalidate: 86400 } }),
      fetch(SOCIAL_URL, { next: { revalidate: 86400 } })
    ]);

    if (!legislatorsRes.ok) throw new Error('Failed to fetch legislators');

    const legislators = await legislatorsRes.json();
    const socialData = socialRes.ok ? await socialRes.json() : [];

    // Build social media lookup
    const socialLookup: Record<string, any> = {};
    socialData.forEach((s: any) => {
      if (s.social) {
        socialLookup[s.id.bioguide] = s.social;
      }
    });

    // Filter to current senators only
    const currentSenators = legislators.filter((leg: any) => {
      const currentTerm = leg.terms[leg.terms.length - 1];
      return currentTerm.type === 'sen' && new Date(currentTerm.end) > new Date();
    });

    // Transform to our Senator format with REAL HEADSHOTS
    const result: Senator[] = currentSenators.map((leg: any) => {
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
        // OFFICIAL CONGRESS.GOV HEADSHOT
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
        // Placeholder values - populated from other APIs later
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
    result.sort((a, b) => a.lastName.localeCompare(b.lastName));

    // Update the global senators array
    senators = result;

    return result;
  } catch (error) {
    console.error('Error fetching senators:', error);
    return [];
  }
}

// =============================================================================
// HELPER FUNCTIONS
// =============================================================================

export function getAllTrades(): (Trade & { senatorId: string; senatorName: string })[] {
  const allTrades: (Trade & { senatorId: string; senatorName: string })[] = [];

  senators.forEach(senator => {
    senator.recentTrades.forEach(trade => {
      allTrades.push({
        ...trade,
        senatorId: senator.id,
        senatorName: senator.name,
      });
    });
  });

  return allTrades.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getSenatorById(id: string): Senator | undefined {
  return senators.find(s =>
    s.id === id.toLowerCase() ||
    s.bioguideId.toLowerCase() === id.toLowerCase()
  );
}

export async function getSenatorByIdAsync(id: string): Promise<Senator | undefined> {
  if (senators.length === 0) {
    await fetchSenators();
  }
  return senators.find(s =>
    s.id === id.toLowerCase() ||
    s.bioguideId.toLowerCase() === id.toLowerCase()
  );
}

export function getSenatorsWithConflicts(): Senator[] {
  return senators.filter(s => s.conflicts.length > 0);
}

export function getTotalStats() {
  return {
    totalSenators: senators.length,
    totalTrades: senators.reduce((acc, s) => acc + s.stockTrades, 0),
    totalConflicts: senators.reduce((acc, s) => acc + s.conflicts.length, 0),
    avgAttendance: senators.length > 0
      ? Math.round(senators.reduce((acc, s) => acc + s.attendance, 0) / senators.length)
      : 0,
  };
}

export function getTopStockWinners(): { senator: Senator; totalGains: string }[] {
  return senators
    .filter(s => s.estimatedTradeGains && s.estimatedTradeGains !== '$0')
    .map(s => ({
      senator: s,
      totalGains: s.estimatedTradeGains || '$0'
    }))
    .sort((a, b) => {
      const aVal = parseFloat(a.totalGains.replace(/[^0-9.-]/g, '')) || 0;
      const bVal = parseFloat(b.totalGains.replace(/[^0-9.-]/g, '')) || 0;
      return bVal - aVal;
    })
    .slice(0, 3);
}
