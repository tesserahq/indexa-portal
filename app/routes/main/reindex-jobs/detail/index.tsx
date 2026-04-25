import { redirect } from 'react-router'

export async function loader({ params }: { params: { reindexID: string } }) {
  return redirect(`/reindex-jobs/${params.reindexID}/overview`)
}

export default function ReindexJobDetailIndex() {
  return null
}
