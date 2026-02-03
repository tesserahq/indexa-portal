import { DetailContent } from '@/components/detail-content'
import DeleteDomainService, {
  type DeleteDomainServiceHandle,
} from '@/components/dialog/delete-domain-service'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/modules/shadcn/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/shadcn/ui/popover'
import { useDeleteDomainService, useDomainService } from '@/resources/hooks/domain-services'
import { Button } from '@shadcn/ui/button'
import { EllipsisVertical, Pencil, Trash2 } from 'lucide-react'
import { useRef } from 'react'
import { useLoaderData, useNavigate } from 'react-router'
import { DateTime, EmptyContent } from 'tessera-ui/components'
import { getEnabledBadgeProps } from '..'

export async function loader({ params }: { params: { id?: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return {
    apiUrl,
    nodeEnv,
    domainServiceId: params.id ?? '',
  }
}

export default function DomainServiceDetail() {
  const { apiUrl, nodeEnv, domainServiceId } = useLoaderData<typeof loader>()
  const { token, isLoading: isLoadingAuth } = useApp()
  const navigate = useNavigate()
  const deleteRef = useRef<DeleteDomainServiceHandle>(null)

  const config = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { data, isLoading, error } = useDomainService(config, domainServiceId, {
    enabled: !!token && !isLoadingAuth && Boolean(domainServiceId),
  })
  const deleteDomainService = useDeleteDomainService(config)

  const handleDeleteDomainService = async () => {
    if (!data?.id) return
    deleteRef.current?.updateConfig({ isLoading: true })
    try {
      await deleteDomainService.mutateAsync(data.id)
      deleteRef.current?.close()
      navigate('/domain-services')
    } finally {
      deleteRef.current?.updateConfig({ isLoading: false })
    }
  }

  if (isLoading) {
    return <AppPreloader />
  }

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-search.png"
        title="Failed to get domain service"
        description={error.message}
      />
    )
  }

  if (!data) {
    return (
      <EmptyContent
        image="/images/empty-search.png"
        title="Domain service not found"
        description="The requested domain service could not be found."
      />
    )
  }

  return (
    <DetailContent
      title="Domain Services"
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
              onClick={() => navigate(`/domain-services/${data.id}/edit`)}>
              <Pencil size={18} />
              <span>Edit</span>
            </Button>
            <Button
              variant="ghost"
              className="flex w-full justify-start gap-2 hover:bg-destructive hover:text-white"
              onClick={() =>
                deleteRef.current?.open({
                  title: 'Delete domain service?',
                  description: `Are you sure you want to delete "${data.name || data.id}"? This action cannot be undone.`,
                  onDelete: handleDeleteDomainService,
                })
              }>
              <Trash2 size={18} />
              <span>Delete</span>
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
          <dt className="d-label">Name</dt>
          <dd className="d-content">{data.name || '-'}</dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Status</dt>
          <dd className="d-content">
            <Badge variant="outline" className={getEnabledBadgeProps(data.enabled)?.className}>
              <span className="text-xs">{getEnabledBadgeProps(data.enabled)?.label}</span>
            </Badge>
          </dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Base URL</dt>
          <dd className="d-content">
            {data.base_url ? (
              <a href={data.base_url} target="_blank" rel="noreferrer" className="button-link">
                {data.base_url}
              </a>
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Indexes Path Prefix</dt>
          <dd className="d-content">{data.indexes_path_prefix || '-'}</dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Domains</dt>
          <dd className="d-content">{data.domains?.join(', ') || '-'}</dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Excluded Entities</dt>
          <dd className="d-content">{data.excluded_entities?.join(', ') || '-'}</dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Created At</dt>
          <dd className="d-content">
            {data.created_at ? (
              <DateTime date={data.created_at} formatStr="dd/MM/yyyy HH:mm" />
            ) : (
              '-'
            )}
          </dd>
        </div>
        <div className="d-item">
          <dt className="d-label">Updated At</dt>
          <dd className="d-content">
            {data.updated_at ? (
              <DateTime date={data.updated_at} formatStr="dd/MM/yyyy HH:mm" />
            ) : (
              '-'
            )}
          </dd>
        </div>
      </div>
      <DeleteDomainService ref={deleteRef} />
    </DetailContent>
  )
}
