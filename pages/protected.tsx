import { useSession } from 'next-auth/react'
import { useState } from 'react'
import AccessDenied from '../components/access-denied'
import { AddPasswordForm } from '../components/add-password-form'
import Layout from '../components/layout'
import { MasterForm } from '../components/master-form'
import { SvgAddPassword } from '../components/shared/svgs'

export default function ProtectedPage() {
  const { data: session } = useSession()
  const [isShow, setIsShow] = useState(false)

  function toggleIsShow() {
    setIsShow(!isShow)
  }

  if (!session) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  // If session exists, display content
  return (
    <Layout>
      <h1 className="text-5xl font-semibold mb-5">
        Acceder à vos mots de passe
      </h1>
      <MasterForm />
      <div
        className="text-center m-3 cursor-pointer"
        onClick={() => toggleIsShow()}
      >
        <SvgAddPassword />
      </div>
      <AddPasswordForm isShow={isShow} />
    </Layout>
  )
}
