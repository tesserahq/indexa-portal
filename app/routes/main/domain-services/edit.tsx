import { DomainServiceForm } from '@/components/crud-form/domain-service-form'
import { AppPreloader } from '@/components/loader/pre-loader'
import { useApp } from '@/context/AppContext'
import { useDomainService, useUpdateDomainService } from '@/resources/hooks/domain-services'
import { IQueryConfig } from '@/resources/queries'
import {
  domainServiceToFormValues,
  formValuesToDomainServiceData,
  type DomainServiceFormValue,
} from '@/resources/queries/domain-services'
import { useLoaderData, useNavigate } from 'react-router'
import { EmptyContent } from 'tessera-ui/components'

export async function loader({ params }: { params: { id?: string } }) {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return {
    apiUrl,
    nodeEnv,
    domainServiceId: params.id ?? '',
  }
}

export default function DomainServiceEdit() {
  const { apiUrl, nodeEnv, domainServiceId } = useLoaderData<typeof loader>()
  const { token, isLoading: isLoadingAuth } = useApp()
  const navigate = useNavigate()

  const config: IQueryConfig = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { data, isLoading, error } = useDomainService(config, domainServiceId, {
    enabled: !!token && !isLoadingAuth && Boolean(domainServiceId),
  })

  const { mutateAsync: updateDomainService, isPending } = useUpdateDomainService(config, {
    onSuccess: (updated) => {
      navigate(`/domain-services/${updated.id}`)
    },
  })

  if (isLoading) {
    return <AppPreloader />
  }

  if (error || !data) {
    return (
      <EmptyContent
        image="/images/empty-search.png"
        title="Domain service not found"
        description={
          (error as Error)?.message || 'The requested domain service could not be found.'
        }
      />
    )
  }

  const handleSubmit = async (formValues: DomainServiceFormValue): Promise<void> => {
    await updateDomainService({
      id: domainServiceId,
      data: formValuesToDomainServiceData(formValues),
    })
  }

  return (
    <DomainServiceForm
      title="Update Domain Service"
      onSubmit={handleSubmit}
      defaultValues={domainServiceToFormValues(data)}
      isSubmitting={isPending}
      submitLabel="Update"
      cancelPath={`/domain-services/${domainServiceId}`}
    />
  )
}
