import { DataTable } from '@/components/data-table'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/modules/shadcn/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/shadcn/ui/popover'
import {
  useCancelReindexJob,
  useReindexJobs,
  useRunReindexJob,
} from '@/resources/hooks/reindex-jobs'
import { ReIndexJobType } from '@/resources/queries/reindex-jobs'
import { ensureCanonicalPagination } from '@/utils/helpers/pagination.helper'
import { Button } from '@shadcn/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { AlertTriangle, EllipsisVertical, EyeIcon, Loader2, PlayIcon } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router'
import { DateTime, EmptyContent, NewButton } from 'tessera-ui/components'
import CancelReindexJob, { CancelReindexJobHandle } from '@/components/dialog/cancel-reindex-job'

export const getStatusBadgeProps = (status?: string) => {
  switch (status) {
    case 'pending':
      return { label: 'Pending', className: 'border-amber-500 text-amber-600' }
    case 'running':
      return { label: 'Running', className: 'border-orange-500 text-orange-600' }
    case 'completed':
      return { label: 'Completed', className: 'border-green-500 text-green-600' }
    case 'failed':
      return { label: 'Failed', className: 'border-red-500 text-red-600' }
    case 'cancelled':
      return { label: 'Cancelled', className: 'border-red-500 text-red-600' }
    default:
      return { label: '-', className: 'border-slate-300 text-slate-500' }
  }
}

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

export default function ReIndexJobs() {
  const { apiUrl, nodeEnv, pagination } = useLoaderData<typeof loader>()
  const { token, isLoading: isLoadingAuth } = useApp()
  const navigate = useNavigate()
  const deleteRef = useRef<CancelReindexJobHandle>(null)

  const config = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { data, isLoading, error } = useReindexJobs(
    config,
    { page: pagination.page, size: pagination.size },
    { enabled: !!token && !isLoadingAuth }
  )
  const cancelReindexJob = useCancelReindexJob(config)
  const runReindexJob = useRunReindexJob(config)

  const handleCancelReindexJob = async (jobId: string) => {
    deleteRef.current?.updateConfig({ isLoading: true })
    try {
      await cancelReindexJob.mutateAsync(jobId)
      deleteRef.current?.close()
    } finally {
      deleteRef.current?.updateConfig({ isLoading: false })
    }
  }

  const handleRunReindexJob = async (jobId: string) => {
    await runReindexJob.mutateAsync(jobId)
  }

  const columns = useMemo<ColumnDef<ReIndexJobType>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => {
          const { id } = row.original
          return (
            <Link to={`/reindex-jobs/${id}`} className="button-link">
              <div className="max-w-[220px] truncate" title={id}>
                {id.slice(0, 8) || '-'}
              </div>
            </Link>
          )
        },
      },
      {
        accessorKey: 'domains',
        header: 'Domains',
        size: 250,
        cell: ({ row }) => {
          const domains = row.original.domains?.join(', ') || '-'
          return (
            <div className="max-w-[220px] truncate" title={domains}>
              {domains}
            </div>
          )
        },
      },
      {
        accessorKey: 'entity_types',
        header: 'Entity Types',
        size: 250,
        cell: ({ row }) => {
          const entityTypes = row.original.entity_types?.join(', ') || '-'
          return (
            <div className="max-w-[220px] truncate" title={entityTypes}>
              {entityTypes}
            </div>
          )
        },
      },
      {
        accessorKey: 'status',
        header: 'Status',
        size: 150,
        cell: ({ row }) => {
          const status = row.getValue('status') as string | undefined
          const badge = getStatusBadgeProps(status)
          return (
            <Badge variant="outline" className={badge.className}>
              <span className="text-xs">{badge.label}</span>
            </Badge>
          )
        },
      },
      {
        accessorKey: 'started_at',
        header: 'Started At',
        size: 160,
        cell: ({ row }) => {
          const date = row.getValue('started_at') as string
          return date ? <DateTime date={date} formatStr="dd/MM/yyyy HH:mm" /> : '-'
        },
      },
      {
        accessorKey: 'completed_at',
        header: 'Completed At',
        size: 160,
        cell: ({ row }) => {
          const date = row.getValue('completed_at') as string
          return date ? <DateTime date={date} formatStr="dd/MM/yyyy HH:mm" /> : '-'
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        size: 160,
        cell: ({ row }) => {
          const date = row.getValue('created_at') as string
          return <DateTime date={date} formatStr="dd/MM/yyyy HH:mm" />
        },
      },
      {
        id: 'actions',
        header: '',
        size: 20,
        cell: ({ row }) => {
          const job = row.original
          return (
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  size="icon"
                  variant="ghost"
                  className="px-0 hover:bg-transparent"
                  aria-label="Open actions"
                  tabIndex={0}>
                  <EllipsisVertical size={18} />
                </Button>
              </PopoverTrigger>
              <PopoverContent align="start" side="left" className="w-40 p-2">
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => navigate(`/reindex-jobs/${job.id}`)}>
                  <EyeIcon size={18} />
                  <span>Overview</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => handleRunReindexJob(job.id)}
                  disabled={runReindexJob.isPending}>
                  {runReindexJob.isPending ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <PlayIcon size={18} />
                  )}
                  <span>{runReindexJob.isPending ? 'Running...' : 'Run'}</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2 hover:bg-destructive hover:text-white"
                  onClick={() =>
                    deleteRef.current?.open({
                      title: 'Cancel reindex job?',
                      description: `Are you sure you want to cancel job "${job.id}"? This action cannot be undone.`,
                      onCancel: () => handleCancelReindexJob(job.id),
                    })
                  }>
                  <AlertTriangle size={18} />
                  <span>Cancel</span>
                </Button>
              </PopoverContent>
            </Popover>
          )
        },
      },
    ],
    [cancelReindexJob, navigate]
  )

  if (isLoading) {
    return <AppPreloader className="min-h-screen" />
  }

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-reindex-job.png"
        title="Failed to get reindex jobs"
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
        <h1 className="page-title">Reindex Jobs</h1>
        {!isLoading && data?.items.length !== 0 && (
          <NewButton
            label="New Reindex Job"
            onClick={() => navigate('/reindex-jobs/new')}
            disabled={isLoading}
          />
        )}
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyContent
          image="/images/empty-reindex-job.png"
          title="No reindex jobs found"
          description="Get started by creating your first reindex job.">
          <Button onClick={() => navigate('/reindex-jobs/new')} variant="black">
            Start Creating
          </Button>
        </EmptyContent>
      ) : (
        <DataTable columns={columns} data={data?.items || []} meta={meta} isLoading={isLoading} />
      )}

      <CancelReindexJob ref={deleteRef} />
    </div>
  )
}
