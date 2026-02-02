import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { Button } from '@/modules/shadcn/ui/button'
import { useReindexJob } from '@/resources/hooks/reindex-jobs'
import { FileText, KeyRound, Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useLocation, useNavigate, useParams } from 'react-router'
import { EmptyContent } from 'tessera-ui/components'
import { Layout, DetailItemsProps, BreadcrumbItemData } from 'tessera-ui/layouts'

export function loader({ params }: { params: { id: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv, id: params.id }
}

export default function ReindexJobDetailLayout() {
  const { apiUrl, nodeEnv } = useLoaderData<typeof loader>()
  const { token } = useApp()
  const params = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemData[]>([])

  // Nested Items for the role
  const menuItems: DetailItemsProps[] = [
    {
      title: 'Overview',
      path: `/reindex-jobs/${params.id}/overview`,
      icon: <FileText size={18} />,
    },
  ]

  // Generate resource data (role) to get name/title from resource
  const {
    data: reindexJob,
    isLoading,
    error,
  } = useReindexJob({ apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }, params.id as string, {
    enabled: !!token,
  })

  // Generate breadcrumb based on the pathname and role name
  const generatingBreadcrumb = async () => {
    const breadcrumbItems = []

    const pathParts = pathname.split('/').filter(Boolean)

    for (let index = 0; index < pathParts.length; index++) {
      const part = pathParts[index]

      breadcrumbItems.push({
        // If the part is the same as the role id, use the role name, otherwise use the part
        label: part === params?.id ? reindexJob?.id || '' : part,

        // Generate the link based on the path parts
        link: `/${pathParts.slice(0, index + 1).join('/')}`,
      })
    }

    setBreadcrumb(breadcrumbItems)
  }

  useEffect(() => {
    if (reindexJob) {
      generatingBreadcrumb()
    }
  }, [reindexJob, pathname])

  if (isLoading || !token) {
    return <AppPreloader className="min-h-screen" />
  }

  if (error || !reindexJob) {
    return (
      <EmptyContent
        title="Reindex Job Not Found"
        image="/images/empty-reindex-job.png"
        description={`We can't find reindex job with ID ${params.id} ${(error as Error)?.message}`}>
        <Button onClick={() => navigate('/reindex-jobs')}>Back to Reindex Jobs</Button>
      </EmptyContent>
    )
  }

  return (
    <Layout.Detail menuItems={menuItems} breadcrumb={breadcrumb}>
      <div className="max-w-screen-2xl mx-auto">
        <Outlet />
      </div>
    </Layout.Detail>
  )
}
