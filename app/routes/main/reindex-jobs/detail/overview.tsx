import { DetailContent } from '@/components/detail-content'
import { AppPreloader } from '@/components/loader/pre-loader'
import CancelReindexJob, {
  type CancelReindexJobHandle,
} from '@/components/dialog/cancel-reindex-job'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/modules/shadcn/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/shadcn/ui/popover'
import {
  useCancelReindexJob,
  useReindexJob,
  useRunReindexJob,
} from '@/resources/hooks/reindex-jobs'
import { Button } from '@shadcn/ui/button'
import { AlertTriangle, EllipsisVertical, Loader2, PlayIcon } from 'lucide-react'
import { useRef } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { DateTime, EmptyContent } from 'tessera-ui/components'
import { getStatusBadgeProps } from '..'

export async function loader({ params }: { params: { id?: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return {
    apiUrl,
    nodeEnv,
    reindexJobId: params.id ?? '',
  }
}

export default function ReindexJobDetail() {
  const { apiUrl, nodeEnv, reindexJobId } = useLoaderData<typeof loader>()
  const { token, isLoading: isLoadingAuth } = useApp()
  const navigate = useNavigate()
  const deleteRef = useRef<CancelReindexJobHandle>(null)

  const config = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { data, isLoading, error } = useReindexJob(config, reindexJobId, {
    enabled: !!token && !isLoadingAuth && Boolean(reindexJobId),
  })
  const cancelReindexJob = useCancelReindexJob(config)
  const runReindexJob = useRunReindexJob(config)

  const handleCancelReindexJob = async () => {
    if (!data?.id) return
    deleteRef.current?.updateConfig({ isLoading: true })
    try {
      await cancelReindexJob.mutateAsync(data.id)
      deleteRef.current?.close()
    } finally {
      deleteRef.current?.updateConfig({ isLoading: false })
    }
  }

  const handleRunReindexJob = async () => {
    if (!data?.id) return
    await runReindexJob.mutateAsync(data.id)
  }

  if (isLoading) {
    return <AppPreloader />
  }

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-search.png"
        title="Failed to get reindex job"
        description={error.message}
      />
    )
  }

  if (!data) {
    return (
      <EmptyContent
        image="/images/empty-search.png"
        title="Reindex job not found"
        description="The requested reindex job could not be found."
      />
    )
  }

  return (
    <DetailContent
      title="Reindex Jobs"
      actions={
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
          <PopoverContent align="end" side="bottom" className="w-40 p-2">
            <Button
              variant="ghost"
              className="flex w-full justify-start gap-2"
              onClick={handleRunReindexJob}
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
                  description: `Are you sure you want to cancel job "${data.id}"? This action cannot be undone.`,
                  onCancel: handleCancelReindexJob,
                })
              }>
              <AlertTriangle size={18} />
              <span>Cancel</span>
            </Button>
          </PopoverContent>
        </Popover>
      }>
      <div className="d-list">
        <div className="d-item">
          <dt className="d-label">ID</dt>
          <dd className="d-content">{data.id}</dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Status</dt>
          <dd className="d-content">
            <Badge variant="outline" className={getStatusBadgeProps(data.status)?.className}>
              <span className="text-xs">{getStatusBadgeProps(data.status)?.label}</span>
            </Badge>
          </dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Started At</dt>
          <dd className="d-content">
            {data.started_at ? (
              <DateTime date={data.started_at} formatStr="dd/MM/yyyy HH:mm" />
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Completed At</dt>
          <dd className="d-content">
            {data.completed_at ? (
              <DateTime date={data.completed_at} formatStr="dd/MM/yyyy HH:mm" />
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Error Message</dt>
          <dd className="d-content">{data.error_message || '-'}</dd>
        </div>
      </div>
      <CancelReindexJob ref={deleteRef} />
    </DetailContent>
  )
}
