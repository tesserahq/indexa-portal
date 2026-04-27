import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import useBreadcrumb from '@/hooks/useBreadcrumb'
import { Button } from '@/modules/shadcn/ui/button'
import { useReindexJob } from '@/resources/hooks/reindex-jobs'
import { FileText, KeyRound, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useLocation, useNavigate, useParams } from 'react-router'
import { EmptyContent } from 'tessera-ui/components'
import { Layout, DetailItemsProps, BreadcrumbItemData } from 'tessera-ui/layouts'

export function loader({ params }: { params: { reindexID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv, id: params.reindexID }
}

export default function ReindexJobDetailLayout() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const { token } = useApp()
  const params = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()

  // Nested Items for the role
  const menuItems: DetailItemsProps[] = [
    {
      title: 'Overview',
      path: `/reindex-jobs/${id}/overview`,
      icon: FileText,
    },
  ]

  const breadcrumbs = useBreadcrumb({
    pathname,
    params,
    token: token!,
    apiUrl: apiUrl!,
    nodeEnv: nodeEnv!,
  })

  // Generate resource data (role) to get name/title from resource
  const {
    data: reindexJob,
    isLoading,
    error,
  } = useReindexJob({ apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }, id as string, {
    enabled: !!token,
  })

  if (isLoading || !token) {
    return <AppPreloader className="min-h-screen" />
  }

  if (error || !reindexJob) {
    return (
      <EmptyContent
        title="Reindex Job Not Found"
        image="/images/empty-reindex-job.png"
        description={`We can't find reindex job with ID ${id} ${(error as Error)?.message}`}>
        <Button onClick={() => navigate('/reindex-jobs')}>Back to Reindex Jobs</Button>
      </EmptyContent>
    )
  }

  return (
    <Layout.Detail
      menuItems={menuItems}
      breadcrumbs={breadcrumbs}
      isLoading={breadcrumbs.length === 0 || !token || !id}>
      <div className="max-w-screen-2xl mx-auto">
        <Outlet />
      </div>
    </Layout.Detail>
  )
}
