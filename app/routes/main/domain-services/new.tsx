import { DomainServiceForm } from '@/components/crud-form/domain-service-form'
import { useApp } from '@/context/AppContext'
import { useCreateDomainService } from '@/resources/hooks/domain-services'
import { IQueryConfig } from '@/resources/queries'
import {
  defaultDomainServiceFormValues,
  type DomainServiceFormValue,
} from '@/resources/queries/domain-services'
import { useLoaderData, useNavigate } from 'react-router'

export async function loader() {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv }
}

export default function DomainServiceNew() {
  const { apiUrl, nodeEnv } = useLoaderData<typeof loader>()
  const { token } = useApp()
  const navigate = useNavigate()

  const config: IQueryConfig = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { mutateAsync: createDomainService, isPending } = useCreateDomainService(config, {
    onSuccess: (data) => {
      navigate(`/domain-services/${data.id}`)
    },
  })

  const handleSubmit = async (data: DomainServiceFormValue): Promise<void> => {
    await createDomainService(data)
  }

  return (
    <DomainServiceForm
      onSubmit={handleSubmit}
      defaultValues={defaultDomainServiceFormValues}
      isSubmitting={isPending}
    />
  )
}
