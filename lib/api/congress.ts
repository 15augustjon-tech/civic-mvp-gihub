// =============================================================================
// CONGRESS.GOV API INTEGRATION
// Documentation: https://api.congress.gov/
// =============================================================================

const API_KEY = process.env.CONGRESS_API_KEY;
const BASE = 'https://api.congress.gov/v3';

// Get member details
export async function getMember(bioguideId: string) {
  if (!API_KEY) throw new Error('CONGRESS_API_KEY not set');

  const res = await fetch(
    `${BASE}/member/${bioguideId}?api_key=${API_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.member;
}

// Get member's sponsored legislation
export async function getMemberBills(bioguideId: string, limit = 20) {
  if (!API_KEY) return [];

  const res = await fetch(
    `${BASE}/member/${bioguideId}/sponsored-legislation?api_key=${API_KEY}&limit=${limit}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.sponsoredLegislation || [];
}

// Get member's cosponsored legislation
export async function getMemberCosponsoredBills(bioguideId: string, limit = 20) {
  if (!API_KEY) return [];

  const res = await fetch(
    `${BASE}/member/${bioguideId}/cosponsored-legislation?api_key=${API_KEY}&limit=${limit}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.cosponsoredLegislation || [];
}

// Get recent Senate votes
export async function getSenateVotes(congress = 118, limit = 50) {
  if (!API_KEY) return [];

  const res = await fetch(
    `${BASE}/vote/senate/${congress}?api_key=${API_KEY}&limit=${limit}&sort=date+desc`,
    { next: { revalidate: 3600 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.votes || [];
}

// Get specific vote details
export async function getVoteDetails(congress: number, session: number, rollCall: number) {
  if (!API_KEY) return null;

  const res = await fetch(
    `${BASE}/vote/senate/${congress}/${session}/${rollCall}?api_key=${API_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.vote;
}

// Get all current senators from Congress.gov
export async function getCurrentSenators() {
  if (!API_KEY) return [];

  const res = await fetch(
    `${BASE}/member?chamber=senate&currentMember=true&api_key=${API_KEY}&limit=100`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.members || [];
}

// Get all Senate committees
export async function getCommittees() {
  if (!API_KEY) return [];

  const res = await fetch(
    `${BASE}/committee/senate?api_key=${API_KEY}&limit=100`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.committees || [];
}

// Get a specific member's committee assignments
export async function getMemberCommittees(bioguideId: string): Promise<string[]> {
  if (!API_KEY) return [];

  try {
    const res = await fetch(
      `${BASE}/member/${bioguideId}?api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return [];
    const data = await res.json();

    // Extract committee names from the member data
    const member = data.member;
    if (!member) return [];

    // The API returns committee assignments in different formats
    // Try to extract from depiction or terms
    const committees: string[] = [];

    // Check if there's a currentMember with committees
    if (member.terms) {
      const currentTerm = member.terms[member.terms.length - 1];
      if (currentTerm?.committees) {
        currentTerm.committees.forEach((c: any) => {
          if (c.name) committees.push(c.name);
        });
      }
    }

    return committees;
  } catch (error) {
    console.error(`Error fetching committees for ${bioguideId}:`, error);
    return [];
  }
}

// Batch fetch committees for multiple senators (more efficient)
export async function getMemberDetails(bioguideId: string) {
  if (!API_KEY) return null;

  try {
    const res = await fetch(
      `${BASE}/member/${bioguideId}?api_key=${API_KEY}`,
      { next: { revalidate: 86400 } }
    );

    if (!res.ok) return null;
    const data = await res.json();
    return data.member;
  } catch (error) {
    console.error(`Error fetching member ${bioguideId}:`, error);
    return null;
  }
}
