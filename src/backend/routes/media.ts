import { Elysia, t } from 'elysia'
import { supabase } from '@/backend/config/database'
import { successResponse } from '@/backend/utils/response'
import { errorHandler, throwNotFoundError } from '@/backend/utils/error'
import { formatPaginationResponse } from '@/backend/utils/helpers'
export const mediaRoutes = new Elysia({ prefix: '/media' })
  .use(errorHandler)

  // Public routes - Get all media
  .get('/', async ({ query }) => {
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const mediaType = query.media_type as string
    const relatedArticleId = query.related_article_id as string
    const relatedEventId = query.related_event_id as string
    const relatedBannerId = query.related_banner_id as string

    // Build count query
    let countQuery = supabase
      .from('media')
      .select('*', { count: 'exact', head: true })

    if (mediaType) countQuery = countQuery.eq('media_type', mediaType)
    if (relatedArticleId) countQuery = countQuery.eq('related_article_id', parseInt(relatedArticleId))
    if (relatedEventId) countQuery = countQuery.eq('related_event_id', parseInt(relatedEventId))
    if (relatedBannerId) countQuery = countQuery.eq('related_banner_id', parseInt(relatedBannerId))

    const { count, error: countError } = await countQuery

    if (countError) {
      throw new Error('Failed to fetch media count')
    }

    // Build data query
    const from = (page - 1) * limit
    const to = page * limit - 1

    let dataQuery = supabase
      .from('media')
      .select('*')
      .order('order_index', { ascending: true })
      .range(from, to)

    if (mediaType) dataQuery = dataQuery.eq('media_type', mediaType)
    if (relatedArticleId) dataQuery = dataQuery.eq('related_article_id', parseInt(relatedArticleId))
    if (relatedEventId) dataQuery = dataQuery.eq('related_event_id', parseInt(relatedEventId))
    if (relatedBannerId) dataQuery = dataQuery.eq('related_banner_id', parseInt(relatedBannerId))

    const { data, error } = await dataQuery

    if (error) {
      throw new Error('Failed to fetch media')
    }

    return formatPaginationResponse({
      data: (data || []) as unknown[],
      page,
      limit,
      total: count || 0
    })
  })

  // Public route - Get single media by ID
  .get('/:id', async ({ params }) => {
    const mediaId = parseInt(params.id)

    const { data, error } = await supabase
      .from('media')
      .select('*')
      .eq('media_id', mediaId)
      .single()

    if (error || !data) {
      throwNotFoundError('Media')
    }

    return successResponse(data)
  }, {
    params: t.Object({
      id: t.String()
    })
  })