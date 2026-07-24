/**
 * useApi.ts — barrel re-export
 *
 * This file re-exports all hooks from their resource-specific modules.
 * Existing imports like `import { useGetArticles } from '@/hooks/useApi'`
 * continue to work without any changes.
 *
 * For new code, prefer importing directly from the specific module:
 *   import { useGetArticles } from '@/hooks/useArticles'
 */

// Core hook and types
export { useApi as default, useApi, apiRequest } from './useCore';
export type { ApiResponse, ApiError, UseApiState, UseApiReturn } from './useCore';

// Resource hooks
export * from './useArticles';
export * from './useCategories';
export * from './useBanners';
export * from './useMedia';
export * from './useTransparency';
export * from './useOffices';