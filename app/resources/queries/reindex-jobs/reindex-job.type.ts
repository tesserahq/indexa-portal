/**
 * ReIndex Job type
 */
export type ReIndexJobType = {
  id: string
  status?: string
  started_at?: string
  completed_at?: string
  error_message?: string | null
  domains?: string[]
  entity_types?: string[]
  updated_after?: string
  updated_before?: string
  created_at?: string
  updated_at?: string
}

/**
 * ReIndex Form Type
 */
export type ReIndexFormData = {
  domains: string[]
  entity_types: string[]
  updated_after: string
  updated_before: string
}

/**
 * Update user data (all fields optional)
 */
export type UpdateReIndexData = Partial<ReIndexFormData>
