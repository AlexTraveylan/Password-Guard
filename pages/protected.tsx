import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import Layout from '../components/layout'
import { MasterFormCreate } from '../components/master-form-create'
import { Loader } from '../components/shared/loader'

type apiIsUserResponse = {
  action: '1' | '2'
}

export default function ProtectedPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isUserNotCreated, setIsUserNotCreated] = useState(false)
  const [isLoadingUser, setIsLoadingUser] = useState(true)

  async function checkIsUserExist() {
    const response = await fetch(`api/user/isUser`)
    if (response.ok) {
      const responseType: apiIsUserResponse = await response.json()
      if (responseType.action === '1') {
        router.push('/view')
      } else {
        setIsUserNotCreated(true)
      }
    }
    setIsLoadingUser(false)
  }

  useEffect(() => {
    checkIsUserExist()
  }, [])

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  if (isLoadingUser) {
    return (
      <Layout>
        <Loader show={isLoadingUser} />
      </Layout>
    )
  }

  if (isUserNotCreated) {
    return (
      <Layout>
        <h1 className="text-5xl font-semibold mb-5 text-center px-3">
          Choississez votre Master Password.
        </h1>
        <h2 className="text-2xl mb-5 text-center px-3">
          Assurez-vous d'avoir une connexion sécurisée lors de la création de
          votre master password.
        </h2>
        <h3 className="mb-5 text-center px-3">
          Il doit posseder au minimum 15 caractères, une minuscule, une
          MAJUSCULE, un chiffre, un caractère spécial.
        </h3>
        <MasterFormCreate />
      </Layout>
    )
  }

  return (
    <Layout>
      <AccessDenied />
    </Layout>
  )
}
