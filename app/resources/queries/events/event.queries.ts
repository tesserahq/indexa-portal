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
