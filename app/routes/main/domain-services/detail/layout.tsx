import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import useBreadcrumb from '@/hooks/useBreadcrumb'
import { Button } from '@/modules/shadcn/ui/button'
import { useDomainService } from '@/resources/hooks/domain-services'
import { FileText } from 'lucide-react'
import { Outlet, useLoaderData, useLocation, useNavigate, useParams } from 'react-router'
import { EmptyContent } from 'tessera-ui/components'
import { Layout, DetailItemsProps } from 'tessera-ui/layouts'

export function loader({ params }: { params: { domainID: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv, id: params.domainID }
}

export default function DomainServiceDetailLayout() {
  const { apiUrl, nodeEnv, id } = useLoaderData<typeof loader>()
  const { token } = useApp()
  const params = useParams()
  const navigate = useNavigate()
  const { pathname } = useLocation()
  const menuItems: DetailItemsProps[] = [
    {
      title: 'Overview',
      path: `/domain-services/${id}/overview`,
      icon: FileText,
    },
  ]

  const {
    data: domainService,
    isLoading,
    error,
  } = useDomainService({ apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }, id as string, {
    enabled: !!token,
  })

  const breadcrumbs = useBreadcrumb({
    pathname,
    params,
    token: token!,
    apiUrl: apiUrl!,
    nodeEnv: nodeEnv!,
  })

  if (isLoading || !token) {
    return <AppPreloader className="min-h-screen" />
  }

  if (error || !domainService) {
    return (
      <EmptyContent
        title="Domain Service Not Found"
        image="/images/empty-search.png"
        description={`We can't find domain service with ID ${id} ${(error as Error)?.message}`}>
        <Button onClick={() => navigate('/domain-services')}>Back to Domain Services</Button>
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
