export type EventUserType = {
  id: string
  email?: string
  username?: string
  avatar_url?: string
  first_name?: string
  last_name?: string
  provider?: string
  confirmed_at?: string
  verified?: boolean
  verified_at?: string
  created_at?: string
  updated_at?: string
}

export type EventType = {
  id: string
  source?: string
  spec_version?: string
  event_type?: string
  event_data: Record<string, unknown>
  data_content_type?: string
  subject?: string
  time?: string
  tags?: string[]
  labels?: Record<string, unknown>
  privy?: boolean
  user_id?: string
  project_id?: string
  created_at?: string
  updated_at?: string
  user?: EventUserType
}
