import { DataTable } from '@/components/data-table'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { Badge } from '@/modules/shadcn/ui/badge'
import { useProviders } from '@/resources/hooks/providers'
import { ProviderType } from '@/resources/queries/providers'
import { ColumnDef } from '@tanstack/react-table'
import { useMemo } from 'react'
import { useLoaderData } from 'react-router'
import { EmptyContent } from 'tessera-ui'

export const getStatusBadgeProps = (status?: boolean) => {
  if (status) {
    return { className: 'border-green-500 text-green-600' }
  }

  return { className: 'border-red-500 text-red-600' }
}

export function loader() {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv }
}

export default function ProviderPage() {
  const { apiUrl, nodeEnv } = useLoaderData<typeof loader>()
  const { token } = useApp()

  const config = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { data, isLoading, error } = useProviders(config)

  const columns = useMemo<ColumnDef<ProviderType>[]>(
    () => [
      {
        accessorKey: 'name',
        header: 'Name',
      },
      {
        accessorKey: 'enabled',
        header: 'Enabled',
        cell: ({ row }) => {
          const { enabled } = row.original
          const badge = getStatusBadgeProps(enabled)

          return (
            <Badge variant="outline" className={badge.className}>
              <span className="text-xs">{enabled ? 'Enabled' : 'Disabled'}</span>
            </Badge>
          )
        },
      },
      {
        accessorKey: 'healty',
        header: 'Healty',
        cell: ({ row }) => {
          const { healty } = row.original
          const badge = getStatusBadgeProps(healty)

          return (
            <Badge variant="outline" className={badge.className}>
              <span className="text-xs">{healty ? 'Yes' : 'No'}</span>
            </Badge>
          )
        },
      },
    ],
    [data]
  )

  if (isLoading) {
    return <AppPreloader className="min-h-screen" />
  }

  if (error) {
    return (
      <EmptyContent
        image="/images/empty-providers.png"
        title="Failed to get providers"
        description={error.message}
      />
    )
  }

  return (
    <div className="h-full page-content">
      <div className="mb-5 flex items-center justify-between">
        <h1 className="page-title">Providers</h1>
      </div>

      {!isLoading && data?.items.length === 0 ? (
        <EmptyContent
          image="/images/empty-providers.png"
          title="No providers found"
          description="There are no providers yet."
        />
      ) : (
        <DataTable columns={columns} data={data?.items || []} isLoading={isLoading} />
      )}
    </div>
  )
}
