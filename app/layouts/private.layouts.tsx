import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { useRequestInfo } from '@/hooks/useRequestInfo'
import { ROUTE_PATH as THEME_PATH } from '@/routes/resources/update-theme'
import { SITE_CONFIG } from '@/utils/config/site.config'
import { CalendarCog, Database, RefreshCcw, ServerCog } from 'lucide-react'
import { Outlet, useLoaderData, useNavigate, useSubmit } from 'react-router'
import { Layout, MainItemProps, TesseraProvider } from 'tessera-ui'

export function loader() {
  const identiesApiUrl = process.env.IDENTIES_API_URL

  return {
    identiesApiUrl,
  }
}

export default function PrivateLayout() {
  const { identiesApiUrl } = useLoaderData<typeof loader>()
  const { isLoading, token } = useApp()
  const requestInfo = useRequestInfo()
  const submit = useSubmit()
  const navigate = useNavigate()

  const onSetTheme = (theme: string) => {
    submit(
      { theme },
      {
        method: 'POST',
        action: THEME_PATH,
        navigate: false,
        fetcherKey: 'theme-fetcher',
      }
    )
  }

  const menuItems: MainItemProps[] = [
    {
      title: 'Reindex Jobs',
      path: `/reindex-jobs`,
      icon: RefreshCcw,
    },
    {
      title: 'Domain Services',
      path: `/domain-services`,
      icon: Database,
    },
    {
      title: 'Events',
      path: `/events`,
      icon: CalendarCog,
    },
    {
      title: 'Providers',
      path: '/providers',
      icon: ServerCog,
    },
  ]

  if (isLoading) {
    return <AppPreloader className="min-h-screen" />
  }

  if (!token || !identiesApiUrl) {
    return <AppPreloader className="min-h-screen" />
  }

  return (
    <TesseraProvider identiesApiUrl={identiesApiUrl} token={token}>
      <Layout.Main menuItems={menuItems} collapseSidebar={false}>
        <Layout.Header
          actionLogout={() => navigate('/logout', { replace: true })}
          actionProfile={() => {}}
          defaultAvatar=""
          onSetTheme={onSetTheme}
          selectedTheme={requestInfo.userPrefs.theme || 'system'}
          title={SITE_CONFIG.siteTitle}
        />
        <Outlet />
      </Layout.Main>
    </TesseraProvider>
  )
}
