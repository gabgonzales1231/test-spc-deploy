import { Elysia } from 'elysia'
import { cors } from '@elysiajs/cors'
import { jwt } from '@elysiajs/jwt'
import { staticPlugin } from '@elysiajs/static'
import { categoryRoutes } from '@/backend/routes/categories'
import { articleRoutes } from '@/backend/routes/articles'
import { mediaRoutes } from '@/backend/routes/media'
import { bannerRoutes } from '@/backend/routes/banners'
import { faqsRouter } from '@/backend/routes/faqs'
import { servicesRouter } from '@/backend/routes/services'
import { errorHandler } from './utils/error'

// Added the forms routes import
import { formsRoutes } from '@/backend/routes/forms'
import { chatRoutes } from './routes/chat'
import { aboutUsRoutes } from './routes/about-us'
import { transparencyRoutes } from './routes/transparency'
import { mapRoutes } from './routes/map'
import { epacdRoutes } from './routes/epacd'
import { psgcRoutes } from './routes/psgc'
import { officesRoutes } from './routes/offices'
import { serviceStandardRoutes } from './routes/service-standard'

export const app = new Elysia()
  .use(cors({
    origin: process.env.NEXT_PUBLIC_FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }))
  .use(jwt({
    name: 'jwt',
    secret: process.env.JWT_SECRET || 'super-secret-jwt-key'
  }))
  .onError(({ code, error, set, path }) => {
    console.error('Global error:', { code, path, error })
    switch (code) {
      case 'NOT_FOUND':
        set.status = 404
        return {
          success: false,
          error: { code: 'API_NOT_FOUND', message: `Route not found: ${path}` }
        }
      case 'VALIDATION':
        set.status = 400
        return {
          success: false,
          error: { code: 'VALIDATION_ERROR', message: error.message, path }
        }
      case 'PARSE':
        set.status = 400
        return {
          success: false,
          error: { code: 'PARSE_ERROR', message: 'Invalid JSON payload', path }
        }
      default:
        set.status = 500
        return {
          success: false,
          error: { code: 'INTERNAL_ERROR', message: 'Internal server error', path }
        }
    }
  })
  // Everything under /api
  .group('/api', (api) => {
    return api
      .use(errorHandler)
      // Public endpoints
      .get('/', () => ({
        message: 'SPC Website API',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      }))
      .get('/health', () => ({
        status: 'healthy',
        timestamp: new Date().toISOString()
      }))
      .get('/status', () => ({
        api: 'SPC Website API',
        status: 'operational',
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }))
      // Feature routes
      .use(categoryRoutes)
      .use(articleRoutes)
      .use(mediaRoutes)
      .use(bannerRoutes)
      .use(faqsRouter)
      .use(servicesRouter)
      .use(transparencyRoutes)
      .use(chatRoutes)
      .use(formsRoutes)
      .use(aboutUsRoutes)
      .use(mapRoutes)
      .use(epacdRoutes)
      .use(psgcRoutes)
      .use(officesRoutes)
      .use(serviceStandardRoutes)
  })
  // Static assets
  .use(staticPlugin({
    assets: 'public',
    prefix: '/'
  }))

  console.log(
  'Registered routes:\n',
  app.routes.map((r: any) => `${r.method} ${r.path}`).join('\n')
)