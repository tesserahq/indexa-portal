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

  // app host urls
  const quoreHostUrl = process.env.QUORE_HOST_URL
  const looplyHostUrl = process.env.LOOPLY_HOST_URL
  const vaultaHostUrl = process.env.VAULTA_HOST_URL
  const identiesHostUrl = process.env.IDENTIES_HOST_URL
  const orchaHostUrl = process.env.ORCHA_HOST_URL
  const custosHostUrl = process.env.CUSTOS_HOST_URL
  const indexaHostUrl = process.env.INDEXA_HOST_URL || process.env.HOST_URL
  const sendlyHostUrl = process.env.SENDLY_HOST_URL

  return {
    identiesApiUrl,
    quoreHostUrl,
    looplyHostUrl,
    vaultaHostUrl,
    identiesHostUrl,
    orchaHostUrl,
    custosHostUrl,
    indexaHostUrl,
    sendlyHostUrl,
  }
}

export default function PrivateLayout() {
  const {
    identiesApiUrl,
    quoreHostUrl,
    looplyHostUrl,
    vaultaHostUrl,
    identiesHostUrl,
    orchaHostUrl,
    custosHostUrl,
    indexaHostUrl,
    sendlyHostUrl,
  } = useLoaderData<typeof loader>()

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

  const appHostUrls = {
    quore: quoreHostUrl ?? '',
    looply: looplyHostUrl ?? '',
    vaulta: vaultaHostUrl ?? '',
    identies: identiesHostUrl ?? '',
    orcha: orchaHostUrl ?? '',
    custos: custosHostUrl ?? '',
    indexa: indexaHostUrl ?? '',
    sendly: sendlyHostUrl ?? '',
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
      <Layout.Main menuItems={menuItems}>
        <Layout.Header
          appHostUrls={appHostUrls}
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
