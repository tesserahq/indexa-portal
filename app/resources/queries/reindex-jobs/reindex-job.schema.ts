import { z } from 'zod/v4'

// ============================================================================
// API Schemas (for server-side validation)
// ============================================================================

/**
 * Base reindex job schema (POST payload)
 */
const baseReindexJobSchema = z.object({
  domains: z.array(z.string()),
  entity_types: z.array(z.string()),
  updated_after: z.string().datetime(),
  updated_before: z.string().datetime(),
})

/**
 * Create reindex job schema
 */
export const reindexJobCreateSchema = baseReindexJobSchema

/**
 * Update reindex job schema (all fields optional)
 */
export const reindexJobUpdateSchema = baseReindexJobSchema.partial()

// ============================================================================
// Form Schema (for client-side form validation)
// ============================================================================

export const reindexJobFormSchema = z.object({
  domains: z.array(z.string()).min(1, 'At least one domain is required'),
  entity_types: z.array(z.string()).min(1, 'At least one entity type is required'),
  updated_after: z.string().min(1, 'Updated after is required'),
  updated_before: z.string().min(1, 'Updated before is required'),
})

export type ReindexJobFormValue = z.infer<typeof reindexJobFormSchema>

/**
 * Default form values for reindex job form
 */
export const defaultReindexJobFormValues: ReindexJobFormValue = {
  domains: [],
  entity_types: [],
  updated_after: '',
  updated_before: '',
}
