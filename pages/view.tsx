import { useSession } from 'next-auth/react'
import AccessDenied from '../components/access-denied'
import Layout from '../components/layout'

export default function ProtectedPage() {
  const { data: session } = useSession()

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  return (
    <Layout>
      <h1>Ici la liste des mots de passes protegés</h1>
    </Layout>
  )
}
