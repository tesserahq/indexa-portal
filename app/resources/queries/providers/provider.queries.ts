import { fetchApi } from '@/libraries/fetch'
import { IQueryConfig } from '@/resources/queries'
import { ProderTypeList } from './provider.type'

const ENDPOINT = 'providers'

/**
 * Lists
 */
export async function fetchProviders(config: IQueryConfig) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}`, token, nodeEnv, {
    method: 'GET',
  })

  return response as ProderTypeList
}
