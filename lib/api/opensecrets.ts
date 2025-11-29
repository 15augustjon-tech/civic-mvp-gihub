// =============================================================================
// OPENSECRETS API INTEGRATION
// Documentation: https://www.opensecrets.org/api
// =============================================================================

const API_KEY = process.env.OPENSECRETS_API_KEY;
const BASE = 'https://www.opensecrets.org/api';

// Get legislator summary (includes net worth, top industries)
export async function getLegislatorSummary(opensecretsCid: string, cycle = 2024) {
  if (!API_KEY || !opensecretsCid) return null;

  const res = await fetch(
    `${BASE}/?method=candSummary&cid=${opensecretsCid}&cycle=${cycle}&apikey=${API_KEY}&output=json`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.response?.summary?.['@attributes'] || null;
}

// Get top contributors
export async function getTopContributors(opensecretsCid: string, cycle = 2024) {
  if (!API_KEY || !opensecretsCid) return [];

  const res = await fetch(
    `${BASE}/?method=candContrib&cid=${opensecretsCid}&cycle=${cycle}&apikey=${API_KEY}&output=json`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.response?.contributors?.contributor || [];
}

// Get top industries
export async function getTopIndustries(opensecretsCid: string, cycle = 2024) {
  if (!API_KEY || !opensecretsCid) return [];

  const res = await fetch(
    `${BASE}/?method=candIndustry&cid=${opensecretsCid}&cycle=${cycle}&apikey=${API_KEY}&output=json`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.response?.industries?.industry || [];
}

// Get sector breakdown
export async function getSectorBreakdown(opensecretsCid: string, cycle = 2024) {
  if (!API_KEY || !opensecretsCid) return [];

  const res = await fetch(
    `${BASE}/?method=candSector&cid=${opensecretsCid}&cycle=${cycle}&apikey=${API_KEY}&output=json`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  return data.response?.sectors?.sector || [];
}

// Get personal financial disclosure (net worth)
export async function getFinancialDisclosure(opensecretsCid: string) {
  if (!API_KEY || !opensecretsCid) return null;

  const res = await fetch(
    `${BASE}/?method=memPFDprofile&cid=${opensecretsCid}&apikey=${API_KEY}&output=json`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return null;
  const data = await res.json();
  return data.response?.member_profile?.['@attributes'] || null;
}

// Lookup CID by name (OpenSecrets ID)
export async function lookupLegislator(name: string) {
  if (!API_KEY) return [];

  const res = await fetch(
    `${BASE}/?method=getLegislators&id=&apikey=${API_KEY}&output=json`,
    { next: { revalidate: 86400 } }
  );

  if (!res.ok) return [];
  const data = await res.json();
  const legislators = data.response?.legislator || [];

  // Filter by name
  return legislators.filter((leg: any) =>
    leg['@attributes']?.firstlast?.toLowerCase().includes(name.toLowerCase())
  );
}
