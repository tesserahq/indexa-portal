import { fetchApi } from '@/libraries/fetch'
import { IQueryConfig, IQueryParams } from '@/resources/queries'
import { IPaging } from '@/resources/types/pagination'
import { ReIndexFormData, ReIndexJobType } from './reindex-job.type'

const ENDPOINT = 'reindex-jobs'

/**
 * Create
 */
export async function createReindexJob(config: IQueryConfig, data: ReIndexFormData) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}`, token, nodeEnv, {
    method: 'POST',
    body: JSON.stringify(data),
  })

  return response as ReIndexJobType
}

/**
 * Detail
 */
export async function fetchReindexJob(reindexJobId: string, config: IQueryConfig) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}/${reindexJobId}`, token, nodeEnv)

  return response as ReIndexJobType
}

/**
 * Lists
 */
export async function fetchReindexJobs(config: IQueryConfig, params: IQueryParams) {
  const { apiUrl, token, nodeEnv } = config
  const { page, size, q } = params

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}`, token, nodeEnv, {
    method: 'GET',
    pagination: { page, size },
    params: { q },
  })

  return response as IPaging<ReIndexJobType>
}

/**
 * Cancel
 */
export async function cancelReindexJob(reindexJobId: string, config: IQueryConfig) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}/${reindexJobId}/cancel`, token, nodeEnv, {
    method: 'POST',
  })

  return response as ReIndexJobType
}

/**
 * Run
 */
export async function runReindexJob(reindexJobId: string, config: IQueryConfig) {
  const { apiUrl, token, nodeEnv } = config

  const response = await fetchApi(`${apiUrl}/${ENDPOINT}/${reindexJobId}/run`, token, nodeEnv, {
    method: 'POST',
  })

  return response as ReIndexJobType
}
