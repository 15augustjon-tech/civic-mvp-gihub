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

// Cached senators array
let senators: Senator[] = [];

// Fetch real senators - uses internal API route to avoid CORS issues
export async function fetchSenators(): Promise<Senator[]> {
  try {
    // Use the internal API route which handles the external fetch server-side
    const baseUrl = typeof window !== 'undefined'
      ? window.location.origin
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    const response = await fetch(`${baseUrl}/api/senators`, {
      cache: 'force-cache',
      next: { revalidate: 86400 }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch senators: ${response.status}`);
    }

    const result: Senator[] = await response.json();

    // Update the cached senators array
    senators = result;

    return result;
  } catch (error) {
    console.error('Error fetching senators:', error);
    return [];
  }
}

// Get aggregate statistics
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
