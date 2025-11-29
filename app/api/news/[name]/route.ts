import { NextResponse } from 'next/server';

// GDELT API for news mentions
export async function GET(
  request: Request,
  { params }: { params: Promise<{ name: string }> }
) {
  const { name } = await params;
  const searchName = decodeURIComponent(name);

  try {
    // GDELT Doc API - get recent news articles
    const gdeltUrl = `https://api.gdeltproject.org/api/v2/doc/doc?query="${encodeURIComponent(searchName)}"&mode=artlist&maxrecords=10&format=json&sort=datedesc`;

    const res = await fetch(gdeltUrl, {
      next: { revalidate: 3600 } // Cache for 1 hour
    });

    if (!res.ok) {
      // GDELT sometimes returns non-JSON errors
      return NextResponse.json({ articles: [], error: 'GDELT API unavailable' });
    }

    const text = await res.text();

    // Try to parse JSON
    let data;
    try {
      data = JSON.parse(text);
    } catch {
      return NextResponse.json({ articles: [], error: 'Invalid response from GDELT' });
    }

    const articles = (data.articles || []).map((article: any) => ({
      title: article.title,
      url: article.url,
      source: article.domain,
      date: article.seendate,
      image: article.socialimage,
      language: article.language,
    }));

    // Calculate sentiment summary (simplified)
    const sentiment = {
      positive: 0,
      negative: 0,
      neutral: articles.length,
    };

    return NextResponse.json({
      articles,
      total: articles.length,
      sentiment,
      query: searchName,
    });
  } catch (error) {
    console.error('GDELT API error:', error);
    return NextResponse.json({ articles: [], error: 'Failed to fetch news' });
  }
}
