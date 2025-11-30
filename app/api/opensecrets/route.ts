import { NextRequest, NextResponse } from 'next/server';

const OPENSECRETS_API_KEY = process.env.OPENSECRETS_API_KEY;
const BASE_URL = 'https://www.opensecrets.org/api/';

// Input validation
const VALID_METHODS = ['candSummary', 'candContrib', 'candIndustry', 'candSector', 'memPFDprofile'];
const VALID_CYCLES = ['2024', '2022', '2020', '2018', '2016', '2014'];
const CID_REGEX = /^[A-Z]\d{8}$/; // OpenSecrets CID format: N00000001

// Get candidate summary (contributions, industries, etc)
export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const method = searchParams.get('method');
  const cid = searchParams.get('cid'); // OpenSecrets CID
  const cycle = searchParams.get('cycle') || '2024';

  // Validate method
  if (!method || !VALID_METHODS.includes(method)) {
    return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
  }

  // Validate cycle
  if (!VALID_CYCLES.includes(cycle)) {
    return NextResponse.json({ error: 'Invalid cycle' }, { status: 400 });
  }

  // Validate cid format (if provided)
  if (cid && !CID_REGEX.test(cid)) {
    return NextResponse.json({ error: 'Invalid CID format' }, { status: 400 });
  }

  if (!OPENSECRETS_API_KEY) {
    // Return mock data if no API key
    return NextResponse.json({
      warning: 'OpenSecrets API key not configured. Using sample data.',
      data: getMockData(method, cid)
    });
  }

  try {
    let url = `${BASE_URL}?apikey=${OPENSECRETS_API_KEY}&output=json`;

    // Use encodeURIComponent for all user-provided values
    switch (method) {
      case 'candSummary':
        url += `&method=candSummary&cid=${encodeURIComponent(cid || '')}&cycle=${encodeURIComponent(cycle)}`;
        break;
      case 'candContrib':
        url += `&method=candContrib&cid=${encodeURIComponent(cid || '')}&cycle=${encodeURIComponent(cycle)}`;
        break;
      case 'candIndustry':
        url += `&method=candIndustry&cid=${encodeURIComponent(cid || '')}&cycle=${encodeURIComponent(cycle)}`;
        break;
      case 'candSector':
        url += `&method=candSector&cid=${encodeURIComponent(cid || '')}&cycle=${encodeURIComponent(cycle)}`;
        break;
      case 'memPFDprofile':
        url += `&method=memPFDprofile&cid=${encodeURIComponent(cid || '')}&year=${encodeURIComponent(cycle)}`;
        break;
      default:
        return NextResponse.json({ error: 'Invalid method' }, { status: 400 });
    }

    const response = await fetch(url, {
      headers: { 'Accept': 'application/json' }
    });

    if (!response.ok) {
      throw new Error(`OpenSecrets API error: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json({ data });
  } catch {
    return NextResponse.json({
      warning: 'Failed to fetch from OpenSecrets. Using sample data.',
      data: getMockData(method, cid)
    });
  }
}

function getMockData(method: string | null, cid: string | null) {
  // Return realistic mock data based on method
  switch (method) {
    case 'candSummary':
      return {
        response: {
          summary: {
            '@attributes': {
              cid: cid,
              cycle: '2024',
              total: '$15,234,567',
              spent: '$12,456,789',
              cash_on_hand: '$2,777,778',
              debt: '$0',
              origin: 'Center for Responsive Politics'
            }
          }
        }
      };
    case 'candContrib':
      return {
        response: {
          contributors: {
            contributor: [
              { '@attributes': { org_name: 'Alphabet Inc', total: '$125,000', pacs: '$0', indivs: '$125,000' }},
              { '@attributes': { org_name: 'Microsoft Corp', total: '$98,500', pacs: '$15,000', indivs: '$83,500' }},
              { '@attributes': { org_name: 'Amazon.com', total: '$87,250', pacs: '$25,000', indivs: '$62,250' }},
              { '@attributes': { org_name: 'Meta Platforms', total: '$76,000', pacs: '$10,000', indivs: '$66,000' }},
              { '@attributes': { org_name: 'Apple Inc', total: '$65,750', pacs: '$0', indivs: '$65,750' }},
            ]
          }
        }
      };
    case 'candIndustry':
      return {
        response: {
          industries: {
            industry: [
              { '@attributes': { industry_code: 'C2100', industry_name: 'Electronics Mfg & Equip', indivs: '$450,000', pacs: '$125,000', total: '$575,000' }},
              { '@attributes': { industry_code: 'B1200', industry_name: 'Securities & Investment', indivs: '$380,000', pacs: '$95,000', total: '$475,000' }},
              { '@attributes': { industry_code: 'K1000', industry_name: 'Lawyers/Law Firms', indivs: '$320,000', pacs: '$80,000', total: '$400,000' }},
              { '@attributes': { industry_code: 'H0400', industry_name: 'Pharmaceuticals/Health', indivs: '$290,000', pacs: '$110,000', total: '$400,000' }},
              { '@attributes': { industry_code: 'D0100', industry_name: 'Defense Aerospace', indivs: '$180,000', pacs: '$150,000', total: '$330,000' }},
            ]
          }
        }
      };
    default:
      return null;
  }
}
