import { z } from "zod";

export const CategorySchema = z.object({
  category_id: z.number(),
  name: z.string().max(255),
  parent_category_id: z.number().nullable(),
  description: z.string().nullable(),
  slug: z.string().max(255),
  created_at: z.coerce.date(),
  updated_at: z.coerce.date(),
});

export const CreateCategorySchema = z.object({
  name: z.string().max(255),
  parent_category_id: z.number().nullable(),
  description: z.string().nullable(),
  slug: z.string().max(255),
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

export type Category = z.infer<typeof CategorySchema>;
export type CreateCategory = z.infer<typeof CreateCategorySchema>;
export type UpdateCategory = z.infer<typeof UpdateCategorySchema>;
