import { Elysia } from 'elysia'

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string = 'INTERNAL_ERROR',
    public statusCode: number = 500,
    public details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export const errorHandler = new Elysia()
  .error({
    VALIDATION_ERROR: AppError,
    AUTHENTICATION_ERROR: AppError,
    AUTHORIZATION_ERROR: AppError,
    NOT_FOUND: AppError,
    INTERNAL_ERROR: AppError
  })
  .onError(({ code, error, set }) => {
    console.error(`Error [${code}]:`, error)

    // Safely extract a message from the union-typed error
    const errMessage = typeof (error as { message?: unknown })?.message === 'string' ? (error as { message: string }).message : ''

    // Handle different error types
    if (error instanceof AppError) {
      set.status = error.statusCode
      return {
        success: false,
        error: {
          code: error.code,
          message: error.message,
          details: error.details
        }
      }
    }

    // Handle authentication errors
    if (errMessage.includes('token') || errMessage.includes('Authentication')) {
      set.status = 401
      return {
        success: false,
        error: {
          code: 'AUTHENTICATION_ERROR',
          message: 'Authentication required'
        }
      }
    }

    // Handle authorization errors
    if (errMessage.includes('permissions') || errMessage.includes('Insufficient')) {
      set.status = 403
      return {
        success: false,
        error: {
          code: 'AUTHORIZATION_ERROR',
          message: 'Insufficient permissions'
        }
      }
    }

    // Handle validation errors
    if (errMessage.includes('validation') || code === 'VALIDATION') {
      set.status = 400
      return {
        success: false,
        error: {
          code: 'VALIDATION_ERROR',
          message: 'Invalid input data',
          details: errMessage
        }
      }
    }

    // Handle not found errors
    if (errMessage.includes('not found') || code === 'NOT_FOUND') {
      set.status = 404
      return {
        success: false,
        error: {
          code: 'NOT_FOUND',
          message: 'Resource not found'
        }
      }
    }

    // Default internal server error
    set.status = 500
    return {
      success: false,
      error: {
        code: 'INTERNAL_ERROR',
        message: 'Internal server error'
      }
    }
  })

// Helper functions for throwing specific errors
export const throwValidationError = (message: string, details?: unknown) => {
  throw new AppError(message, 'VALIDATION_ERROR', 400, details)
}

export const throwNotFoundError = (resource: string) => {
  throw new AppError(`${resource} not found`, 'NOT_FOUND', 404)
}

export const throwAuthenticationError = (message: string = 'Authentication required') => {
  throw new AppError(message, 'AUTHENTICATION_ERROR', 401)
}

export const throwAuthorizationError = (message: string = 'Insufficient permissions') => {
  throw new AppError(message, 'AUTHORIZATION_ERROR', 403)
}