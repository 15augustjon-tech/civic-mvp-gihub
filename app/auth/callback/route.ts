import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Whitelist of safe redirect paths
const SAFE_ROUTES = ['/', '/watchlist', '/leaderboard', '/settings', '/compare', '/politician'];

function isValidRedirect(path: string): boolean {
  // Must start with / and not contain protocol or double slashes
  if (!path.startsWith('/') || path.startsWith('//') || path.includes('://')) {
    return false;
  }
  // Check if path starts with any safe route
  return SAFE_ROUTES.some(route => path === route || path.startsWith(`${route}/`));
}

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  const next = searchParams.get('next') ?? '/'

  // Validate redirect path to prevent open redirect attacks
  const validatedNext = isValidRedirect(next) ? next : '/';

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${validatedNext}`)
    }
  }

  // Return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/auth/error`)
}
