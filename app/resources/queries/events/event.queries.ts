import { fetchApi } from '@/libraries/fetch'
import { IQueryConfig, IQueryParams } from '@/resources/queries'
import { IPaging } from '@/resources/types/pagination'
import { EventType } from './event.type'

const ENDPOINT = 'events'

/**
 * Lists
 */
export async function fetchEvents(config: IQueryConfig, params: IQueryParams) {
  const { apiUrl, token, nodeEnv } = config
  const { page, size, q } = params

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}`, token, nodeEnv, {
    method: 'GET',
    pagination: { page, size },
    params: { q },
  })

  return response as IPaging<EventType>
}

/**
 * Index
 */
export async function eventIndex(config: IQueryConfig, event_id: string) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}/${event_id}/index`, token, nodeEnv, {
    method: 'POST',
  })

  return response
}
