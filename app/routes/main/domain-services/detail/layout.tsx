import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { Button } from '@/modules/shadcn/ui/button'
import { useDomainService } from '@/resources/hooks/domain-services'
import { FileText, Pencil } from 'lucide-react'
import { useEffect, useState } from 'react'
import { Outlet, useLoaderData, useLocation, useNavigate, useParams } from 'react-router'
import { EmptyContent } from 'tessera-ui/components'
import { Layout, DetailItemsProps, BreadcrumbItemData } from 'tessera-ui/layouts'

export function loader({ params }: { params: { id: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv, id: params.id }
}

export default function DomainServiceDetailLayout() {
  const { apiUrl, nodeEnv } = useLoaderData<typeof loader>()
  const { token } = useApp()
  const params = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const [breadcrumb, setBreadcrumb] = useState<BreadcrumbItemData[]>([])

  const menuItems: DetailItemsProps[] = [
    {
      title: 'Overview',
      path: `/domain-services/${params.id}/overview`,
      icon: <FileText size={18} />,
    },
  ]

  const {
    data: domainService,
    isLoading,
    error,
  } = useDomainService({ apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }, params.id as string, {
    enabled: !!token,
  })

  const generatingBreadcrumb = async () => {
    const breadcrumbItems = []
    const pathParts = pathname.split('/').filter(Boolean)

    for (let index = 0; index < pathParts.length; index++) {
      const part = pathParts[index]

      breadcrumbItems.push({
        label: part === params?.id ? domainService?.name || '' : part,
        link: `/${pathParts.slice(0, index + 1).join('/')}`,
      })
    }

    setBreadcrumb(breadcrumbItems)
  }

  useEffect(() => {
    if (domainService) {
      generatingBreadcrumb()
    }
  }, [domainService, pathname])

  if (isLoading || !token) {
    return <AppPreloader className="min-h-screen" />
  }

  if (error || !domainService) {
    return (
      <EmptyContent
        title="Domain Service Not Found"
        image="/images/empty-search.png"
        description={`We can't find domain service with ID ${params.id} ${(error as Error)?.message}`}>
        <Button onClick={() => navigate('/domain-services')}>Back to Domain Services</Button>
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
