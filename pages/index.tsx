import { useSession } from 'next-auth/react'
import BtnAccesIfLogged from '../components/btn-acces-iflogged'
import Layout from '../components/layout'
import { Loader } from '../components/shared/loader'

export default function ServerSidePage() {
  const { status } = useSession()

  if (status === 'loading') {
    return (
      <Layout>
        <h3>Chargement du profil utilisateur ...</h3>
        <Loader show={true} />
      </Layout>
    )
  }

  return (
    <Layout>
      <div className="flex flex-col justify-center items-center gap-5">
        <h1 className="text-7xl text-center">Password Guard</h1>
        <BtnAccesIfLogged />
      </div>
    </Layout>
  )
}
