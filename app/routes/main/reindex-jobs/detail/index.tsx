import { redirect } from 'react-router'

export async function loader({ params }: { params: { id: string } }) {
  return redirect(`/reindex-jobs/${params.id}/overview`)
}

export default function ReindexJobDetailIndex() {
  return null
}
