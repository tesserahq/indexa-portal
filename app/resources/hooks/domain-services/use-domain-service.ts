/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQueryConfig, IQueryParams } from '@/resources/queries'
import {
  createDomainService,
  deleteDomainService,
  fetchDomainService,
  fetchDomainServices,
  updateDomainService,
} from '@/resources/queries/domain-services/domain-service.queries'
import {
  DomainServiceFormData,
  DomainServiceType,
  UpdateDomainServiceData,
} from '@/resources/queries/domain-services/domain-service.type'
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
 * Domain service query keys for React Query caching
 */
export const domainServiceQueryKeys = {
  all: ['domain-services'] as const,
  lists: () => [...domainServiceQueryKeys.all, 'list'] as const,
  list: (config: IQueryConfig, params: IQueryParams) =>
    [...domainServiceQueryKeys.lists(), config, params] as const,
  details: () => [...domainServiceQueryKeys.all, 'detail'] as const,
  detail: (id: string) => [...domainServiceQueryKeys.details(), id] as const,
}

/**
 * Hook for fetching paginated domain services
 * @config - Domain service query configuration
 * @params - Domain service query parameters
 * @options - Domain service query options
 */
export function useDomainServices(
  config: IQueryConfig,
  params: IQueryParams,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: domainServiceQueryKeys.list(config, params),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }

        return await fetchDomainServices(config, params)
      } catch (error: any) {
        throw new QueryError(error.message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false,
  })
}

/**
 * Hook for fetching domain service detail
 * @domainServiceId - Domain service ID
 * @config - Domain service query configuration
 * @options - Domain service query options
 */
export function useDomainService(
  config: IQueryConfig,
  domainServiceId: string,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: domainServiceQueryKeys.detail(domainServiceId),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }

        return await fetchDomainService(domainServiceId, config)
      } catch (error: any) {
        throw new QueryError(error.message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000, // 5 minutes
    enabled: options?.enabled !== false && Boolean(domainServiceId),
  })
}

/**
 * Hook for creating domain service
 */
export function useCreateDomainService(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: DomainServiceType) => void
    onError?: (error: QueryError) => void
  }
) {
  const queryClient = useQueryClient()

  if (!config.token) {
    throw new QueryError('Token is required', 'TOKEN_REQUIRED')
  }

  return useMutation({
    mutationFn: async (data: DomainServiceFormData): Promise<DomainServiceType> => {
      return await createDomainService(config, data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: domainServiceQueryKeys.lists() })

      toast.success('Domain service created successfully!', { duration: 3000 })

      options?.onSuccess?.(data)
    },
    onError: (error: QueryError) => {
      toast.error('Failed to create domain service', {
        description: error?.message || 'Please try again.',
      })

      options?.onError?.(error)
    },
  })
}

/**
 * Hook for updating domain service
 */
export function useUpdateDomainService(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: DomainServiceType) => void
    onError?: (error: QueryError) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: {
      id: string
      data: UpdateDomainServiceData
    }): Promise<DomainServiceType> => {
      if (!config.token) {
        throw new QueryError('Token is required', 'TOKEN_REQUIRED')
      }

      return await updateDomainService(payload.id, config, payload.data)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: domainServiceQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: domainServiceQueryKeys.details() })

      toast.success('Domain service updated successfully!', { duration: 3000 })

      options?.onSuccess?.(data)
    },
    onError: (error: QueryError) => {
      toast.error('Failed to update domain service', {
        description: error?.message || 'Please try again.',
      })

      options?.onError?.(error)
    },
  })
}

/**
 * Hook for deleting domain service
 */
export function useDeleteDomainService(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: DomainServiceType) => void
    onError?: (error: QueryError) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (domainServiceId: string): Promise<DomainServiceType> => {
      if (!config.token) {
        throw new QueryError('Token is required', 'TOKEN_REQUIRED')
      }

      return await deleteDomainService(domainServiceId, config)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: domainServiceQueryKeys.lists() })
      queryClient.invalidateQueries({ queryKey: domainServiceQueryKeys.details() })

      toast.success('Domain service deleted successfully!', { duration: 3000 })

      options?.onSuccess?.(data)
    },
    onError: (error: QueryError) => {
      toast.error('Failed to delete domain service', {
        description: error?.message || 'Please try again.',
      })

      options?.onError?.(error)
    },
  })
}
