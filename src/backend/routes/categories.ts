// backend/routes/categories.ts
import { Elysia, t } from 'elysia'
import { supabase } from '@/backend/config/database'
import { successResponse } from '@/backend/utils/response'
import { errorHandler, throwNotFoundError } from '@/backend/utils/error'
import { formatPaginationResponse } from '@/backend/utils/helpers'
import { Category } from '@/backend/schemas/categories'

type CategoryTree = Category & { children: CategoryTree[] }

export const categoryRoutes = new Elysia({ prefix: '/categories' })
  .use(errorHandler)

  // Public routes - Get all categories
  .get('/', async ({ query }) => {
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10
    const search = query.search as string
    const parentCategoryId = query.parent_category_id as string

    // Build count query
    let countQuery = supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })

    if (search) {
      countQuery = countQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (parentCategoryId) {
      if (parentCategoryId === 'null') {
        countQuery = countQuery.is('parent_category_id', null)
      } else {
        countQuery = countQuery.eq('parent_category_id', parseInt(parentCategoryId))
      }
    }

    const { count, error: countError } = await countQuery

    if (countError) {
      throw new Error('Failed to fetch category count')
    }

    // Build data query
    const from = (page - 1) * limit
    const to = page * limit - 1

    let dataQuery = supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
      .range(from, to)

    if (search) {
      dataQuery = dataQuery.or(`name.ilike.%${search}%,description.ilike.%${search}%`)
    }
    if (parentCategoryId) {
      if (parentCategoryId === 'null') {
        dataQuery = dataQuery.is('parent_category_id', null)
      } else {
        dataQuery = dataQuery.eq('parent_category_id', parseInt(parentCategoryId))
      }
    }

    const { data, error } = await dataQuery

    if (error) {
      throw new Error('Failed to fetch categories')
    }

    return formatPaginationResponse({
      data: (data || []) as unknown[],
      page,
      limit,
      total: count || 0
    })
  })

  // Public route - Get all root categories (no parent)
  .get('/root', async () => {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .is('parent_category_id', null)
      .order('name', { ascending: true })

    if (error) {
      throw new Error('Failed to fetch root categories')
    }

    return successResponse(data || [])
  })

  // Public route - Get category tree (hierarchical structure)
  .get('/tree', async () => {
    // Get all categories
    const { data: allCategories, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })

    if (error) {
      throw new Error('Failed to fetch categories')
    }

    // Build tree structure
    const categoryMap = new Map<number, CategoryTree>()
    const rootCategories: CategoryTree[] = []

    // First pass: create map of all categories with empty children
    allCategories?.forEach((category) => {
      categoryMap.set(category.category_id, { ...category, children: [] })
    })

    // Second pass: build tree
    allCategories?.forEach((category) => {
      const categoryWithChildren = categoryMap.get(category.category_id)!

      if (category.parent_category_id === null) {
        rootCategories.push(categoryWithChildren)
      } else {
        const parent = categoryMap.get(category.parent_category_id)
        if (parent) {
          parent.children.push(categoryWithChildren)
        }
      }
    })

    return successResponse(rootCategories)
  })

  // Public route - Get single category by ID
  .get('/:id', async ({ params }) => {
    const categoryId = parseInt(params.id)

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('category_id', categoryId)
      .single()

    if (error || !data) {
      throwNotFoundError('Category')
    }

    return successResponse(data)
  }, {
    params: t.Object({
      id: t.String()
    })
  })

  // Public route - Get category by slug
  .get('/slug/:slug', async ({ params }) => {
    const { slug } = params

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single()

    if (error || !data) {
      throwNotFoundError('Category')
    }

    return successResponse(data)
  }, {
    params: t.Object({
      slug: t.String()
    })
  })

  // Public route - Get subcategories of a category
  .get('/:id/subcategories', async ({ params, query }) => {
    const categoryId = parseInt(params.id)
    const page = parseInt(query.page as string) || 1
    const limit = parseInt(query.limit as string) || 10

    // Verify parent category exists
    const { data: parentExists } = await supabase
      .from('categories')
      .select('category_id')
      .eq('category_id', categoryId)
      .single()

    if (!parentExists) {
      throwNotFoundError('Parent category')
    }

    // Get total count
    const { count, error: countError } = await supabase
      .from('categories')
      .select('*', { count: 'exact', head: true })
      .eq('parent_category_id', categoryId)

    if (countError) {
      throw new Error('Failed to fetch subcategory count')
    }

    // Get paginated data
    const from = (page - 1) * limit
    const to = page * limit - 1

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('parent_category_id', categoryId)
      .order('name', { ascending: true })
      .range(from, to)

    if (error) {
      throw new Error('Failed to fetch subcategories')
    }

    return formatPaginationResponse({
      data: (data || []) as unknown[],
      page,
      limit,
      total: count || 0
    })
  }, {
    params: t.Object({
      id: t.String()
    })
  })