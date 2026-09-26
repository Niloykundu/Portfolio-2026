import { z } from "zod";

export const createProjectSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  slug: z
    .string()
    .min(1, "Slug is required")
    .max(200)
    .regex(/^[a-z0-9-]+$/, "Slug can only contain lowercase letters, numbers, and hyphens"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().optional().nullable(),
  client: z.string().optional().nullable(),
  year: z.number().int().min(2000).max(2100).optional().nullable(),
  duration: z.string().optional().nullable(),
  role: z.string().optional().nullable(),
  editingApproach: z.string().optional().nullable(),
  caseStudy: z.string().optional().nullable(),
  featured: z.boolean().default(false),
  published: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
  thumbnailUrl: z.string().url().optional().nullable(),
  thumbnailPublicId: z.string().optional().nullable(),
});

export const updateProjectSchema = createProjectSchema.partial();

export type CreateProjectInput = z.infer<typeof createProjectSchema>;
export type UpdateProjectInput = z.infer<typeof updateProjectSchema>;
