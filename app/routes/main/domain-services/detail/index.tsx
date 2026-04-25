import { redirect } from 'react-router'

export async function loader({ params }: { params: { domainID: string } }) {
  return redirect(`/domain-services/${params.domainID}/overview`)
}

export default function DomainServiceDetailIndex() {
  return null
}
