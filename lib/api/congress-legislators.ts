// =============================================================================
// @UNITEDSTATES/CONGRESS-LEGISLATORS - FREE PUBLIC DATA SOURCE
// GitHub: https://github.com/unitedstates/congress-legislators
// No API key required - This is public domain data
// =============================================================================

const LEGISLATORS_URL = 'https://theunitedstates.io/congress-legislators/legislators-current.json';
const SOCIAL_URL = 'https://theunitedstates.io/congress-legislators/legislators-social-media.json';

export interface RawLegislator {
  id: {
    bioguide: string;
    thomas?: string;
    lis?: string;
    govtrack: number;
    opensecrets?: string;
    votesmart?: number;
    fec?: string[];
    cspan?: number;
    wikipedia?: string;
    house_history?: number;
    ballotpedia?: string;
    maplight?: number;
    icpsr?: number;
    wikidata?: string;
    google_entity_id?: string;
  };
  name: {
    first: string;
    last: string;
    official_full?: string;
    middle?: string;
    nickname?: string;
    suffix?: string;
  };
  bio: {
    birthday: string;
    gender: 'M' | 'F';
    religion?: string;
  };
  terms: Array<{
    type: 'sen' | 'rep';
    start: string;
    end: string;
    state: string;
    party: string;
    class?: number;
    state_rank?: 'junior' | 'senior';
    url?: string;
    address?: string;
    phone?: string;
    fax?: string;
    contact_form?: string;
    office?: string;
    rss_url?: string;
  }>;
}

export interface SocialMedia {
  id: {
    bioguide: string;
    thomas?: string;
    govtrack: number;
  };
  social?: {
    twitter?: string;
    twitter_id?: number;
    facebook?: string;
    facebook_id?: number;
    youtube?: string;
    youtube_id?: string;
    instagram?: string;
    instagram_id?: number;
  };
}

// Fetch all current legislators
export async function fetchLegislators(): Promise<RawLegislator[]> {
  const res = await fetch(LEGISLATORS_URL, {
    next: { revalidate: 86400 } // Cache for 24 hours
  });

  if (!res.ok) throw new Error('Failed to fetch legislators');
  return res.json();
}

// Fetch social media data
export async function fetchSocialMedia(): Promise<SocialMedia[]> {
  const res = await fetch(SOCIAL_URL, {
    next: { revalidate: 86400 }
  });

  if (!res.ok) return [];
  return res.json();
}

// Get current senators only
export async function fetchCurrentSenators() {
  const [legislators, socialData] = await Promise.all([
    fetchLegislators(),
    fetchSocialMedia()
  ]);

  // Build social media lookup
  const socialLookup: Record<string, SocialMedia['social']> = {};
  socialData.forEach(s => {
    if (s.social) {
      socialLookup[s.id.bioguide] = s.social;
    }
  });

  // Filter to current senators
  const senators = legislators.filter(leg => {
    const currentTerm = leg.terms[leg.terms.length - 1];
    return currentTerm.type === 'sen' && new Date(currentTerm.end) > new Date();
  });

  // Transform to our format
  return senators.map(leg => {
    const term = leg.terms[leg.terms.length - 1];
    const firstSenTerm = leg.terms.find(t => t.type === 'sen');
    const social = socialLookup[leg.id.bioguide] || {};

    let party: 'R' | 'D' | 'I' = 'I';
    if (term.party === 'Republican') party = 'R';
    else if (term.party === 'Democrat' || term.party === 'Democratic') party = 'D';

    return {
      bioguide_id: leg.id.bioguide,
      first_name: leg.name.first,
      last_name: leg.name.last,
      full_name: leg.name.official_full || `${leg.name.first} ${leg.name.last}`,
      state: term.state,
      party,
      photo_url: `https://www.congress.gov/img/member/${leg.id.bioguide.toLowerCase()}_200.jpg`,
      birthday: leg.bio.birthday,
      gender: leg.bio.gender,
      since_year: firstSenTerm ? new Date(firstSenTerm.start).getFullYear() : null,
      term_end: term.end,
      state_rank: term.state_rank,
      phone: term.phone,
      website: term.url,
      contact_form: term.contact_form,
      office_address: term.address,
      twitter: social.twitter,
      facebook: social.facebook,
      youtube: social.youtube,
      instagram: social.instagram,
      opensecrets_id: leg.id.opensecrets,
      fec_id: leg.id.fec?.[0],
      govtrack_id: leg.id.govtrack,
      votesmart_id: leg.id.votesmart,
    };
  });
}

// State abbreviation to full name mapping
export const stateNames: Record<string, string> = {
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
