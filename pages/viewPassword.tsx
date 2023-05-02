import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import { AddPasswordForm } from '../components/add-password-form'
import Layout from '../components/layout'
import { SvgAddPassword } from '../components/shared/svgs'

export default function ProtectedPage() {
  const { data: session } = useSession()
  const [isAcces, setIsAcces] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [passwords, setPasswords] = useState([])

  async function checkIsUserLogged() {
    const response = await fetch('api/user/isAcces')
    if (response.ok) {
      setIsAcces(true)
    }
  }

  async function recupPasswords() {
    const response = await fetch('api/password/getAll')
  }

  useEffect(() => {
    checkIsUserLogged()
  }, [])

  if (!session || !isAcces) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  return (
    <Layout>
      <h1>Ajouter un mot de passe :</h1>
      <div onClick={() => setIsShow(!isShow)}>
        <SvgAddPassword />
      </div>
      <AddPasswordForm isShow={isShow} />
    </Layout>
  )
}
