import { redirect } from 'react-router'

export async function loader({ params }: { params: { id: string } }) {
  return redirect(`/domain-services/${params.id}/overview`)
}

export default function DomainServiceDetailIndex() {
  return null
}
