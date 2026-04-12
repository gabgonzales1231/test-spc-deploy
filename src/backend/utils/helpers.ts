import { PaginationResponse } from '@/backend/types/PaginationResponse';

export function formatPaginationResponse<T>({
  data,
  page,
  limit,
  total,
}: {
  data: T[];
  page: number;
  limit: number;
  total: number;
}): PaginationResponse<T> {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrevious = page > 1;

  return {
    success: true,
    data,
    pagination: {
      page,
      limit,
      total,
      totalPages,
      hasNext,
      hasPrevious,
    },
  };
}