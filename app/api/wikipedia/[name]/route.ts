import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const searchName = decodeURIComponent(name);

  try {
    // Search for the Wikipedia page
    const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(searchName + ' United States Senator')}&format=json&origin=*`;

    const searchRes = await fetch(searchUrl, {
      next: { revalidate: 86400 }
    });

    if (!searchRes.ok) {
      return NextResponse.json({ error: 'Wikipedia search failed' }, { status: 500 });
    }

    const searchData = await searchRes.json();
    const results = searchData.query?.search || [];

    if (results.length === 0) {
      return NextResponse.json({ summary: null, url: null });
    }

    // Get the page extract (summary)
    const pageTitle = results[0].title;
    const extractUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts|pageimages&exintro&explaintext&titles=${encodeURIComponent(pageTitle)}&format=json&origin=*&pithumbsize=300`;

    const extractRes = await fetch(extractUrl, {
      next: { revalidate: 86400 }
    });

    if (!extractRes.ok) {
      return NextResponse.json({ error: 'Wikipedia extract failed' }, { status: 500 });
    }

    const extractData = await extractRes.json();
    const pages = extractData.query?.pages || {};
    const pageId = Object.keys(pages)[0];
    const page = pages[pageId];

    if (!page || page.missing) {
      return NextResponse.json({ summary: null, url: null });
    }

    // Truncate summary to ~500 chars
    let summary = page.extract || '';
    if (summary.length > 500) {
      summary = summary.substring(0, 500).trim() + '...';
    }

    return NextResponse.json({
      title: page.title,
      summary,
      thumbnail: page.thumbnail?.source || null,
      url: `https://en.wikipedia.org/wiki/${encodeURIComponent(pageTitle.replace(/ /g, '_'))}`,
    });
  } catch (error) {
    console.error('Wikipedia API error:', error);
    return NextResponse.json({ error: 'Failed to fetch Wikipedia data' }, { status: 500 });
  }
}
