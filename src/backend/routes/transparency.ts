import { Elysia } from 'elysia'
import { supabase } from '@/backend/config/database'
import { errorHandler } from '@/backend/utils/error'
import { formatPaginationResponse } from '@/backend/utils/helpers'

function getProxyUrl(filePath: string): string | null {
  if (!filePath) return null
  // Proxy route: /api/download/[bucket]/[...filePath]
  // bucket = "transparency", filePath already includes "full-transparency/filename.pdf"
  return `/api/download/transparency/${filePath}`
}

function enrichDocument(doc: Record<string, unknown>) {
  return {
    ...doc,
    year: doc.date_passed
      ? new Date(doc.date_passed as string).getFullYear()
      : null,
    pdf_url: doc.document_path
      ? getProxyUrl(doc.document_path as string)
      : null,
  }
}

export const transparencyRoutes = new Elysia({ prefix: '/transparency' })
  .use(errorHandler)

  .get('/public', async ({ query }) => {
    const page     = parseInt(query.page     as string) || 1
    const limit    = parseInt(query.limit    as string) || 200
    const category = query.category as string | undefined
    const year     = query.year     as string | undefined
    const search   = query.search   as string | undefined

    let countQuery = supabase
      .from('transparency')
      .select('*', { count: 'exact', head: true })
      .eq('status', 'active')

    if (category) countQuery = countQuery.eq('category', category)
    if (year)     countQuery = countQuery
      .gte('date_passed', `${year}-01-01`)
      .lte('date_passed', `${year}-12-31`)
    if (search)   countQuery = countQuery.ilike('title', `%${search}%`)

    const { count, error: countError } = await countQuery   // ← insert below this line
    
    if (countError) {
      console.error('[transparency] countError code:', countError.code)
      console.error('[transparency] countError message:', countError.message)
      console.error('[transparency] countError details:', countError.details)
      console.error('[transparency] countError hint:', countError.hint)
      throw new Error('Failed to fetch transparency count')
    }

    const from = (page - 1) * limit
    const to   = page * limit - 1

    let dataQuery = supabase
      .from('transparency')
      .select('document_id, category, title, date_passed, document_path, status, created_at')
      .eq('status', 'active')
      .order('date_passed', { ascending: false })
      .range(from, to)

    if (category) dataQuery = dataQuery.eq('category', category)
    if (year)     dataQuery = dataQuery
      .gte('date_passed', `${year}-01-01`)
      .lte('date_passed', `${year}-12-31`)
    if (search)   dataQuery = dataQuery.ilike('title', `%${search}%`)

    const { data, error } = await dataQuery
    if (error) throw new Error('Failed to fetch transparency documents')

    const enriched = (data || []).map(enrichDocument)

    return formatPaginationResponse({
      data:  enriched as unknown[],
      page,
      limit,
      total: count || 0,
    })
  })