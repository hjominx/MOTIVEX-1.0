import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

function verifyAdmin(req: Request) {
  const adminSecret = process.env.ADMIN_API_SECRET
  const provided = req.headers.get('x-admin-secret')
  return Boolean(adminSecret && provided === adminSecret)
}

export async function GET(req: Request) {
  if (!verifyAdmin(req)) return new NextResponse('Unauthorized', { status: 401 })

  const supabase = createAdminClient()
  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })
  return NextResponse.json({ users: data })
}

export async function POST(req: Request) {
  if (!verifyAdmin(req)) return new NextResponse('Unauthorized', { status: 401 })

  const body = await req.json().catch(() => null)
  const id = body?.id
  if (!id) return new NextResponse('Missing id', { status: 400 })

  const supabase = createAdminClient()
  const { error } = await supabase.auth.admin.deleteUser(id)
  if (error) return new NextResponse(JSON.stringify({ error: error.message }), { status: 500 })

  return NextResponse.json({ success: true })
}
