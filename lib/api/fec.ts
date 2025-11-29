// =============================================================================
// FEC.GOV API INTEGRATION
// Documentation: https://api.open.fec.gov/developers/
// =============================================================================

const API_KEY = process.env.FEC_API_KEY;
const BASE = 'https://api.open.fec.gov/v1';

// Search for candidate by name
export async function searchCandidate(name: string) {
  if (!API_KEY) return [];

  const res = await fetch(
    `${BASE}/candidates/search/?api_key=${API_KEY}&q=${encodeURIComponent(name)}&office=S&sort=-election_years`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

// Get candidate financial totals
export async function getCandidateTotals(candidateId: string, cycle = 2024) {
  if (!API_KEY || !candidateId) return null;

  const res = await fetch(
    `${BASE}/candidate/${candidateId}/totals/?api_key=${API_KEY}&cycle=${cycle}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.results?.[0] || null;
}

// Get candidate's committees (fundraising entities)
export async function getCandidateCommittees(candidateId: string) {
  if (!API_KEY || !candidateId) return [];

  const res = await fetch(
    `${BASE}/candidate/${candidateId}/committees/?api_key=${API_KEY}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

// Get contributions to a committee
export async function getCommitteeContributions(committeeId: string, limit = 50) {
  if (!API_KEY || !committeeId) return [];

  const res = await fetch(
    `${BASE}/schedules/schedule_a/?api_key=${API_KEY}&committee_id=${committeeId}&sort=-contribution_receipt_amount&per_page=${limit}`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}

// Get top contributors aggregated
export async function getTopContributors(candidateId: string, cycle = 2024) {
  if (!API_KEY || !candidateId) return [];

  // First get the principal campaign committee
  const committees = await getCandidateCommittees(candidateId);
  const principalCommittee = committees.find((c: any) => c.designation === 'P');

  if (!principalCommittee) return [];

  // Get contributions
  return getCommitteeContributions(principalCommittee.committee_id);
}

// Get candidate's fundraising history across cycles
export async function getFundraisingHistory(candidateId: string) {
  if (!API_KEY || !candidateId) return [];

  const res = await fetch(
    `${BASE}/candidate/${candidateId}/totals/?api_key=${API_KEY}&sort=-cycle&per_page=10`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.results || [];
}
