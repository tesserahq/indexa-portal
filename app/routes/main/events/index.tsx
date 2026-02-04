import { DataTable } from '@/components/data-table'
import DialogPreviewJson, { PreviewJsonHandle } from '@/components/dialog/preview-json'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { Button } from '@/modules/shadcn/ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/shadcn/ui/popover'
import { useEvents } from '@/resources/hooks/events'
import { useEventIndex } from '@/resources/hooks/events/use-events'
import { EventType } from '@/resources/queries/events'
import { ensureCanonicalPagination } from '@/utils/helpers/pagination.helper'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, FileJson, Loader2, Search } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { useLoaderData } from 'react-router'
import { DateTime, EmptyContent } from 'tessera-ui/components'

export async function loader({ request }: { request: Request }) {
  const pagination = ensureCanonicalPagination(request, {
    defaultSize: 25,
    defaultPage: 1,
  })

  if (pagination instanceof Response) {
    return pagination
  }

  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv, pagination }
}

export default function EventsListing() {
  const { apiUrl, nodeEnv, pagination } = useLoaderData<typeof loader>()
  const { token, isLoading: isLoadingAuth } = useApp()
  const dialogRef = useRef<PreviewJsonHandle>(null)

  const config = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { data, isLoading, error } = useEvents(
    config,
    { page: pagination.page, size: pagination.size },
    { enabled: !!token && !isLoadingAuth }
  )
  const { mutateAsync: handleEventIndex, isPending: isIndexing } = useEventIndex(config)

  const columns = useMemo<ColumnDef<EventType>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        size: 100,
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.id.slice(0, 8)}</span>
        },
      },
      {
        accessorKey: 'event_type',
        header: 'Event Type',
        size: 100,
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.event_type}</span>
        },
      },
      {
        accessorKey: 'subject',
        header: 'Subject',
        size: 300,
        cell: ({ row }) => {
          return <span className="text-sm">{row.original.subject}</span>
        },
      },
      {
        accessorKey: 'time',
        header: 'Event Time',
        size: 90,
        cell: ({ row }) => {
          const date = row.original.time
          return date && <DateTime date={date} formatStr="dd/MM/yyyy HH:mm" />
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        size: 90,
        cell: ({ row }) => {
          const date = row.getValue('created_at') as string
          return date ? <DateTime date={date} formatStr="dd/MM/yyyy HH:mm" /> : '-'
        },
      },
      {
        accessorKey: 'updated_at',
        header: 'Updated At',
        size: 90,
        cell: ({ row }) => {
          const date = row.getValue('updated_at') as string
          return date ? <DateTime date={date} formatStr="dd/MM/yyyy HH:mm" /> : '-'
        },
      },
      {
        accessorKey: 'id',
        header: '',
        size: 5,
        cell: ({ row }) => {
          const { id } = row.original

          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button size="icon" variant="ghost" className="px-0">
                  <EllipsisVertical size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" side="right" className="w-40 p-1">
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => dialogRef.current?.onOpen(row.original.event_data)}>
                  <FileJson size={18} />
                  <span>View Data</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => handleEventIndex({ event_id: id })}
                  disabled={isIndexing}>
                  {isIndexing ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <Search size={18} />
                  )}
                  <span>{isIndexing ? 'Indexing...' : 'Index'}</span>
                </Button>
              </PopoverContent>
            </Popover>
          )
        },
      },
    ],
    [handleEventIndex, isIndexing]
  )

  if (isLoading) {
    return <AppPreloader className="min-h-screen" />
  }

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-events.png"
        title="Failed to get events"
        description={error.message}
      />
    )
  }

  const meta = data
    ? {
        page: data.page,
        pages: data.pages,
        size: data.size,
        total: data.total,
      }
    : undefined

  return (
    <div className="h-full page-content">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="page-title">Events</h1>
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyContent
          image="/images/empty-events.png"
          title="No events found"
          description="There are no events yet."
        />
      ) : (
        <DataTable columns={columns} data={data?.items || []} meta={meta} isLoading={isLoading} />
      )}

      <DialogPreviewJson ref={dialogRef} title="Event Data" />
    </div>
  )
}
