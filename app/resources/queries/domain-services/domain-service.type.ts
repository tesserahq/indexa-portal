/**
 * Domain Service type
 */
export type DomainServiceType = {
  id: string
  name?: string
  domains?: string[]
  base_url?: string
  indexes_path_prefix?: string
  excluded_entities?: string[]
  enabled?: boolean
  created_at?: string
  updated_at?: string
}

/**
 * Domain Service form data
 */
export type DomainServiceFormData = {
  name: string
  domains: string[]
  base_url: string
  indexes_path_prefix: string
  excluded_entities: string[]
  enabled: boolean
}

/**
 * Update domain service data (all fields optional)
 */
export type UpdateDomainServiceData = Partial<DomainServiceFormData>
