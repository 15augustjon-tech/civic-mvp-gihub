import { createClient } from '@/lib/supabase/server'
import { NextResponse } from 'next/server'

// Input validation helpers
const VALID_PARTIES = ['R', 'D', 'I'];
const VALID_CHAMBERS = ['senate', 'house'];
const MAX_NAME_LENGTH = 100;
const NAME_REGEX = /^[a-zA-Z\s.'-]+$/;
const STATE_REGEX = /^[A-Z]{2}$/;
const ID_REGEX = /^[a-zA-Z0-9-]+$/;

function validatePoliticianInput(body: any): { valid: boolean; error?: string } {
  const { politician_id, politician_name, politician_party, politician_state, politician_chamber } = body;

  if (!politician_id || typeof politician_id !== 'string' || !ID_REGEX.test(politician_id)) {
    return { valid: false, error: 'Invalid politician_id format' };
  }

  if (!politician_name || typeof politician_name !== 'string') {
    return { valid: false, error: 'politician_name is required' };
  }

  if (politician_name.length > MAX_NAME_LENGTH) {
    return { valid: false, error: 'politician_name too long' };
  }

  if (!NAME_REGEX.test(politician_name)) {
    return { valid: false, error: 'politician_name contains invalid characters' };
  }

  if (!politician_party || !VALID_PARTIES.includes(politician_party)) {
    return { valid: false, error: 'Invalid politician_party' };
  }

  if (!politician_state || !STATE_REGEX.test(politician_state)) {
    return { valid: false, error: 'Invalid politician_state format' };
  }

  if (!politician_chamber || !VALID_CHAMBERS.includes(politician_chamber)) {
    return { valid: false, error: 'Invalid politician_chamber' };
  }

  return { valid: true };
}

// GET - Fetch user's watchlist
export async function GET() {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { data, error } = await supabase
    .from('watchlists')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: 'Failed to fetch watchlist' }, { status: 500 })
  }

  return NextResponse.json({ watchlist: data })
}

// POST - Add to watchlist
export async function POST(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  // Safely parse JSON with error handling
  let body;
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  // Validate input
  const validation = validatePoliticianInput(body);
  if (!validation.valid) {
    return NextResponse.json({ error: validation.error }, { status: 400 })
  }

  const { politician_id, politician_name, politician_party, politician_state, politician_chamber } = body

  // Check if already in watchlist
  const { data: existing } = await supabase
    .from('watchlists')
    .select('id')
    .eq('user_id', user.id)
    .eq('politician_id', politician_id)
    .maybeSingle()

  if (existing) {
    return NextResponse.json({ error: 'Already in watchlist' }, { status: 400 })
  }

  const { data, error } = await supabase
    .from('watchlists')
    .insert({
      user_id: user.id,
      politician_id,
      politician_name,
      politician_party,
      politician_state,
      politician_chamber,
      alerts_enabled: true,
    })
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: 'Failed to add to watchlist' }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}

// DELETE - Remove from watchlist
export async function DELETE(request: Request) {
  const supabase = await createClient()

  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const politician_id = searchParams.get('politician_id')

  if (!politician_id || !ID_REGEX.test(politician_id)) {
    return NextResponse.json({ error: 'Invalid politician_id' }, { status: 400 })
  }

  const { error } = await supabase
    .from('watchlists')
    .delete()
    .eq('user_id', user.id)
    .eq('politician_id', politician_id)

  if (error) {
    return NextResponse.json({ error: 'Failed to remove from watchlist' }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
