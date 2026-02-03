import { DataTable } from '@/components/data-table'
import DeleteDomainService, {
  DeleteDomainServiceHandle,
} from '@/components/dialog/delete-domain-service'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/modules/shadcn/ui/badge'
import { Popover, PopoverContent, PopoverTrigger } from '@/modules/shadcn/ui/popover'
import { useDeleteDomainService, useDomainServices } from '@/resources/hooks/domain-services'
import { DomainServiceType } from '@/resources/queries/domain-services'
import { ensureCanonicalPagination } from '@/utils/helpers/pagination.helper'
import { Button } from '@shadcn/ui/button'
import { ColumnDef } from '@tanstack/react-table'
import { EllipsisVertical, EyeIcon, Pencil, Trash2 } from 'lucide-react'
import { useMemo, useRef } from 'react'
import { Link, useLoaderData, useNavigate } from 'react-router'
import { DateTime, EmptyContent, NewButton } from 'tessera-ui/components'

export const getEnabledBadgeProps = (enabled?: boolean) => {
  if (enabled) {
    return { label: 'Enabled', className: 'border-green-500 text-green-600' }
  }

  return { label: 'Disabled', className: 'border-red-500 text-red-600' }
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

export default function DomainServices() {
  const { apiUrl, nodeEnv, pagination } = useLoaderData<typeof loader>()
  const { token, isLoading: isLoadingAuth } = useApp()
  const navigate = useNavigate()
  const deleteRef = useRef<DeleteDomainServiceHandle>(null)

  const config = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { data, isLoading, error } = useDomainServices(
    config,
    { page: pagination.page, size: pagination.size },
    { enabled: !!token && !isLoadingAuth }
  )
  const deleteDomainService = useDeleteDomainService(config)

  const handleDeleteDomainService = async (domainServiceId: string) => {
    deleteRef.current?.updateConfig({ isLoading: true })
    try {
      await deleteDomainService.mutateAsync(domainServiceId)
      deleteRef.current?.close()
    } finally {
      deleteRef.current?.updateConfig({ isLoading: false })
    }
  }

  const columns = useMemo<ColumnDef<DomainServiceType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
        cell: ({ row }) => {
          const { id, name } = row.original
          return (
            <Link to={`/domain-services/${id}`} className="button-link">
              <div className="max-w-[220px] truncate" title={name || '-'}>
                {name || '-'}
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
            <div className="max-w-[260px] truncate" title={domains}>
              {domains}
            </div>
          )
        },
      },
      {
        accessorKey: 'base_url',
        header: 'Base URL',
        size: 250,
        cell: ({ row }) => {
          const baseUrl = row.original.base_url || '-'
          return (
            <div className="max-w-[260px] truncate" title={baseUrl}>
              {baseUrl !== '-' ? (
                <a href={baseUrl} target="_blank" rel="noreferrer" className="button-link">
                  {baseUrl}
                </a>
              ) : (
                baseUrl
              )}
            </div>
          )
        },
      },
      {
        accessorKey: 'enabled',
        header: 'Status',
        size: 150,
        cell: ({ row }) => {
          const enabled = row.getValue('enabled') as boolean | undefined
          const badge = getEnabledBadgeProps(enabled)
          return (
            <Badge variant="outline" className={badge.className}>
              <span className="text-xs">{badge.label}</span>
            </Badge>
          )
        },
      },
      {
        accessorKey: 'created_at',
        header: 'Created At',
        size: 160,
        cell: ({ row }) => {
          const date = row.getValue('created_at') as string
          return date ? <DateTime date={date} formatStr="dd/MM/yyyy HH:mm" /> : '-'
        },
      },
      {
        id: 'actions',
        header: '',
        size: 20,
        cell: ({ row }) => {
          const service = row.original
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
                  onClick={() => navigate(`/domain-services/${service.id}`)}>
                  <EyeIcon size={18} />
                  <span>Overview</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2"
                  onClick={() => navigate(`/domain-services/${service.id}/edit`)}>
                  <Pencil size={18} />
                  <span>Edit</span>
                </Button>
                <Button
                  variant="ghost"
                  className="flex w-full justify-start gap-2 hover:bg-destructive hover:text-white"
                  onClick={() =>
                    deleteRef.current?.open({
                      title: 'Delete domain service?',
                      description: `Are you sure you want to delete "${service.name || service.id}"? This action cannot be undone.`,
                      onDelete: () => handleDeleteDomainService(service.id),
                    })
                  }>
                  <Trash2 size={18} />
                  <span>Delete</span>
                </Button>
              </PopoverContent>
            </Popover>
          )
        },
      },
    ],
    [navigate]
  )

  if (isLoading) {
    return <AppPreloader className="min-h-screen" />
  }

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-domain-services.png"
        title="Failed to get domain services"
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
        <h1 className="page-title">Domain Services</h1>
        {!isLoading && data?.items.length !== 0 && (
          <NewButton
            label="New Domain Service"
            onClick={() => navigate('/domain-services/new')}
            disabled={isLoading}
          />
        )}
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyContent
          image="/images/empty-domain-services.png"
          title="No domain services found"
          description="Get started by creating your first domain service.">
          <Button onClick={() => navigate('/domain-services/new')} variant="black">
            Start Creating
          </Button>
        </EmptyContent>
      ) : (
        <DataTable columns={columns} data={data?.items || []} meta={meta} isLoading={isLoading} />
      )}

      <DeleteDomainService ref={deleteRef} />
    </div>
  )
}
