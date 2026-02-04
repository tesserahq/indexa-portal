/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQueryConfig } from '@/resources/queries'
import { fetchProviders } from '@/resources/queries/providers'
import { useQuery } from '@tanstack/react-query'

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
 * Event query keys for React Query caching
 */
export const providerQueryKeys = {
  all: ['providers'] as const,
  lists: () => [...providerQueryKeys.all, 'list'] as const,
}

/**
 * Hook for fetching paginated providers
 * @config - Provider query configuration
 * @params - Provider query parameters
 * @options - Provider query options
 */
export function useProviders(
  config: IQueryConfig,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: providerQueryKeys.lists(),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }

        return await fetchProviders(config)
      } catch (error: any) {
        throw new QueryError(error.message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false,
  })
}
