import { fetchApi } from '@/libraries/fetch'
import { IQueryConfig, IQueryParams } from '@/resources/queries'
import { IPaging } from '@/resources/types/pagination'
import {
  DomainServiceFormData,
  DomainServiceType,
  UpdateDomainServiceData,
} from './domain-service.type'

const ENDPOINT = 'domain-services'

/**
 * Create
 */
export async function createDomainService(config: IQueryConfig, data: DomainServiceFormData) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}`, token, nodeEnv, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response as DomainServiceType
}

/**
 * Detail
 */
export async function fetchDomainService(domainServiceId: string, config: IQueryConfig) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}/${domainServiceId}`, token, nodeEnv)

  return response as DomainServiceType
}

/**
 * Lists
 */
export async function fetchDomainServices(config: IQueryConfig, params: IQueryParams) {
  const { apiUrl, token, nodeEnv } = config
  const { page, size, q } = params

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}`, token, nodeEnv, {
    method: 'GET',
    pagination: { page, size },
    params: { q },
  })

  return response as IPaging<DomainServiceType>
}

/**
 * Update
 */
export async function updateDomainService(
  domainServiceId: string,
  config: IQueryConfig,
  data: UpdateDomainServiceData
) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}/${domainServiceId}`, token, nodeEnv, {
    method: 'PUT',
    body: JSON.stringify(data),
  })

  return response as DomainServiceType
}

/**
 * Delete
 */
export async function deleteDomainService(domainServiceId: string, config: IQueryConfig) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}/${domainServiceId}`, token, nodeEnv, {
    method: 'DELETE',
  })

  return response as DomainServiceType
}
