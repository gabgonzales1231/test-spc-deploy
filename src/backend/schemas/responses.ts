import { z } from "zod";

export const StandardResponseSchema = z.object({
  success: z.boolean(),
  data: z.any(),
  message: z.string().optional(),
  meta: z.object({
    pagination: z.object({
      page: z.number(),
      limit: z.number(),
      total: z.number(),
      pages: z.number(),
    }).optional(),
  }).optional(),
});

export const ErrorResponseSchema = z.object({
  success: z.boolean().default(false),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.any().optional(),
  }),
});

export type StandardResponse = z.infer<typeof StandardResponseSchema>;
export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
