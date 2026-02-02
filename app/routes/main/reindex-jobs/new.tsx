import { ReindexJobForm } from '@/components/crud-form/reindex-job-form'
import { useApp } from '@/context/AppContext'
import { useCreateReindexJob } from '@/resources/hooks/reindex-jobs'
import { IQueryConfig } from '@/resources/queries'
import {
  defaultReindexJobFormValues,
  type ReindexJobFormValue,
} from '@/resources/queries/reindex-jobs'
import { useLoaderData, useNavigate } from 'react-router'

export async function loader() {
  const apiUrl = process.env.API_URL
  const nodeEnv = process.env.NODE_ENV

  return { apiUrl, nodeEnv }
}

export default function ReindexJobNew() {
  const { apiUrl, nodeEnv } = useLoaderData<typeof loader>()
  const { token } = useApp()
  const navigate = useNavigate()

  const config: IQueryConfig = { apiUrl: apiUrl!, token: token!, nodeEnv: nodeEnv }

  const { mutateAsync: createReindexJob, isPending } = useCreateReindexJob(config, {
    onSuccess: (data) => {
      navigate(`/reindex-jobs/${data.id}`)
    },
  })

  const handleSubmit = async (data: ReindexJobFormValue): Promise<void> => {
    await createReindexJob(data)
  }

  return (
    <ReindexJobForm
      onSubmit={handleSubmit}
      defaultValues={defaultReindexJobFormValues}
      isSubmitting={isPending}
    />
  )
}
