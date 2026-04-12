import { StandardResponse, ErrorResponse } from "@/backend/schemas/responses";

export function successResponse(
  data: any = null,
  message?: string,
  meta?: StandardResponse["meta"]
): StandardResponse {
  return {
    success: true,
    data,
    ...(message ? { message } : {}),
    ...(meta ? { meta } : {}),
  }
}

export function errorResponse(
  code: string,
  message: string,
  details?: any
): ErrorResponse {
  return {
    success: false,
    error: {
      code,
      message,
      ...(details ? { details } : {}),
    },
  }
}
