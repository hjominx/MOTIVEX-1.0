import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

function getSafeNextPath(nextParam: string | null): string {
  if (!nextParam) return '/'
  if (!nextParam.startsWith('/')) return '/'
  if (nextParam.startsWith('//')) return '/'
  if (nextParam.includes('://')) return '/'
  return nextParam
}

export async function GET(request: NextRequest) {
  const { searchParams, origin } = request.nextUrl
  const code = searchParams.get('code')
  const next = getSafeNextPath(searchParams.get('next'))

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)
    if (!error) {
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  return NextResponse.redirect(`${origin}/auth/error`)
}
