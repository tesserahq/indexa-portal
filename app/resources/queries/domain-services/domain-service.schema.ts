import { z } from 'zod/v4'

// ============================================================================
// API Schemas (for server-side validation)
// ============================================================================

/**
 * Base domain service schema (POST payload)
 */
const baseDomainServiceSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domains: z.array(z.string()).min(1, 'At least one domain is required'),
  base_url: z.string().min(1, 'Base URL is required'),
  indexes_path_prefix: z.string().min(1, 'Indexes path prefix is required'),
  excluded_entities: z.array(z.string()),
  enabled: z.boolean(),
})

/**
 * Create domain service schema
 */
export const domainServiceCreateSchema = baseDomainServiceSchema

/**
 * Update domain service schema (all fields optional)
 */
export const domainServiceUpdateSchema = baseDomainServiceSchema.partial()

// ============================================================================
// Form Schema (for client-side form validation)
// ============================================================================

export const domainServiceFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  domains: z.array(z.string()).min(1, 'At least one domain is required'),
  base_url: z.string().min(1, 'Base URL is required'),
  indexes_path_prefix: z.string().min(1, 'Indexes path prefix is required'),
  excluded_entities: z.array(z.string()),
  enabled: z.boolean(),
})

export type DomainServiceFormValue = z.infer<typeof domainServiceFormSchema>

/**
 * Default form values for domain service form
 */
export const defaultDomainServiceFormValues: DomainServiceFormValue = {
  name: '',
  domains: [],
  base_url: '',
  indexes_path_prefix: '',
  excluded_entities: [],
  enabled: true,
}
