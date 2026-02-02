/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQueryConfig, IQueryParams } from '@/resources/queries'
import {
  cancelReindexJob,
  createReindexJob,
  fetchReindexJob,
  fetchReindexJobs,
  runReindexJob,
} from '@/resources/queries/reindex-jobs/reindex-job.queries'
import { ReIndexFormData, ReIndexJobType } from '@/resources/queries/reindex-jobs/reindex-job.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'

/**
 * Custom error class for query errors
 */
class QueryError extends Error {
  code?: string
  details?: unknown

  constructor(message: string, code?: string, details?: unknown) {
    super(message)
    this.name = 'QueryError'
    this.code = code
    this.details = details
  }
}

/**
 * Reindex job query keys for React Query caching
 */
export const reindexJobQueryKeys = {
  all: ['reindex-jobs'] as const,
  lists: () => [...reindexJobQueryKeys.all, 'list'] as const,
  list: (config: IQueryConfig, params: IQueryParams) =>
    [...reindexJobQueryKeys.lists(), config, params] as const,
  details: () => [...reindexJobQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...reindexJobQueryKeys.details(), id] as const,
}

/**
 * Hook for fetching paginated reindex jobs
 * @config - Reindex job query configuration
 * @params - Reindex job query parameters
 * @options - Reindex job query options
 */
export function useReindexJobs(
  config: IQueryConfig,
  params: IQueryParams,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: reindexJobQueryKeys.list(config, params),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }

        return await fetchReindexJobs(config, params)
      } catch (error: any) {
        throw new QueryError(error.message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  })
}

/**
 * Hook for fetching reindex job detail
 * @reindexJobId - Reindex job ID
 * @config - Reindex job query configuration
 * @options - Reindex job query options
 */
export function useReindexJob(
  config: IQueryConfig,
  reindexJobId: string,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: reindexJobQueryKeys.detail(reindexJobId),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }

        return await fetchReindexJob(reindexJobId, config)
      } catch (error: any) {
        throw new QueryError(error.message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false && Boolean(reindexJobId),
  })
}

/**
 * Hook for creating reindex job
 */
export function useCreateReindexJob(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: ReIndexJobType) => void
    onError?: (error: QueryError) => void
  }
) {
  const queryClient = useQueryClient()

  if (!config.token) {
    throw new QueryError('Token is required', 'TOKEN_REQUIRED')
  }

  return useMutation({
    mutationFn: async (data: ReIndexFormData): Promise<ReIndexJobType> => {
      return await createReindexJob(config, data)
    },
    onSuccess: (data) => {
      // Invalidate and refetch reindex jobs lists
      queryClient.invalidateQueries({ queryKey: reindexJobQueryKeys.lists() })

      toast.success('Reindex job created successfully!', { duration: 3000 })

      options?.onSuccess?.(data)
    },
    onError: (error: QueryError) => {
      toast.error('Failed to create reindex job', {
        description: error?.message || 'Please try again.',
      })

      options?.onError?.(error)
    },
  })
}

/**
 * Hook for cancelling reindex job
 */
export function useCancelReindexJob(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: ReIndexJobType) => void
    onError?: (error: QueryError) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reindexJobId: string): Promise<ReIndexJobType> => {
      if (!config.token) {
        throw new QueryError('Token is required', 'TOKEN_REQUIRED')
      }

      return await cancelReindexJob(reindexJobId, config)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reindexJobQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: reindexJobQueryKeys.details() })

      toast.success('Reindex job cancelled successfully!', { duration: 3000 })

      options?.onSuccess?.(data)
    },
    onError: (error: QueryError) => {
      toast.error('Failed to cancel reindex job', {
        description: error?.message || 'Please try again.',
      })

      options?.onError?.(error)
    },
  })
}

/**
 * Hook for run reindex job
 */
export function useRunReindexJob(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: ReIndexJobType) => void
    onError?: (error: QueryError) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (reindexJobId: string): Promise<ReIndexJobType> => {
      if (!config.token) {
        throw new QueryError('Token is required', 'TOKEN_REQUIRED')
      }

      return await runReindexJob(reindexJobId, config)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: reindexJobQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: reindexJobQueryKeys.details() })

      toast.success('Job is running successfully!', { duration: 3000 })

      options?.onSuccess?.(data)
    },
    onError: (error: QueryError) => {
      toast.error('Failed to run reindex job.', {
        description: error?.message || 'Please try again.',
      })

      options?.onError?.(error)
    },
  })
}
