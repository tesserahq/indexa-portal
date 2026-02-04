/* eslint-disable @typescript-eslint/no-explicit-any */
import { IQueryConfig, IQueryParams } from '@/resources/queries'
import { eventIndex, fetchEvents } from '@/resources/queries/events/event.queries'
import { EventType } from '@/resources/queries/events/event.type'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { toast } from 'tessera-ui'

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
export const eventQueryKeys = {
  all: ['events'] as const,
  lists: () => [...eventQueryKeys.all, 'list'] as const,
  list: (config: IQueryConfig, params: IQueryParams) =>
    [...eventQueryKeys.lists(), config, params] as const,
}

/**
 * Hook for fetching paginated events
 * @config - Event query configuration
 * @params - Event query parameters
 * @options - Event query options
 */
export function useEvents(
  config: IQueryConfig,
  params: IQueryParams,
  options?: {
    enabled?: boolean
    staleTime?: number
  }
) {
  return useQuery({
    queryKey: eventQueryKeys.list(config, params),
    queryFn: async () => {
      try {
        if (!config.token) {
          throw new QueryError('Token is required', 'TOKEN_REQUIRED')
        }

        return await fetchEvents(config, params)
      } catch (error: any) {
        throw new QueryError(error.message)
      }
    },
    staleTime: options?.staleTime || 5 * 60 * 1000,
    enabled: options?.enabled !== false,
  })
}

/**
 * Hook for fetching paginated events
 * @config - Event query configuration
 * @event_id - Event ID
 * @options - Event query options
 */
export function useEventIndex(
  config: IQueryConfig,
  options?: {
    onSuccess?: (data: any) => void
    onError?: (error: QueryError) => void
  }
) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async (payload: { event_id: string }) => {
      if (!config.token) {
        throw new QueryError('Token is required', 'TOKEN_REQUIRED')
      }

      return await eventIndex(config, payload.event_id)
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: eventQueryKeys.lists() })

      toast.success('Event indexed successfully!', { duration: 3000 })

      options?.onSuccess?.(data)
    },
    onError: (error: QueryError) => {
      toast.error('Failed to index event', {
        description: error?.message || 'Please try again.',
      })

      options?.onError?.(error)
    },
  })
}
