import { Elysia, t } from 'elysia'
import { supabase } from '@/backend/config/database'
import { successResponse } from '@/backend/utils/response'
import { errorHandler, throwNotFoundError } from '@/backend/utils/error'
import { formatPaginationResponse } from '@/backend/utils/helpers'

export const bannerRoutes = new Elysia({ prefix: '/banners' })
  .use(errorHandler)

  // Public routes - Get active banners only WITH MEDIA
  .get('/', async ({ query }) => {
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10

    // Get total count of active banners
    const { count, error: countError } = await supabase
      .from('banners')
      .select('*', { count: 'exact', head: true })
      .eq('active', true)

    if (countError) {
      throw new Error('Failed to fetch banner count')
    }

    // Get paginated active banners ordered by order_index WITH MEDIA JOIN
    const from = (page - 1) * limit
    const to = page * limit - 1

    const { data, error } = await supabase
      .from('banners')
      .select(`
        *,
        media:image_media_id (
          media_id,
          file_path,
          caption,
          media_type
        )
      `)
      .eq('active', true)
      .order('order_index', { ascending: true })
      .range(from, to)

    if (error) {
      throw new Error('Failed to fetch banners')
    }

    return formatPaginationResponse({
      data: (data || []) as unknown[],
      page,
      limit,
      total: count || 0
    })
  })

  // Public route - Get single active banner by ID WITH MEDIA
  .get('/:id', async ({ params }) => {
    const bannerId = parseInt(params.id)

    const { data, error } = await supabase
      .from('banners')
      .select(`
        *,
        media:image_media_id (
          media_id,
          file_path,
          caption,
          media_type
        )
      `)
      .eq('banner_id', bannerId)
      .eq('active', true)
      .single()

    if (error || !data) {
      throwNotFoundError('Banner')
    }

    return successResponse(data)
  }, {
    params: t.Object({
      id: t.String()
    })
  })