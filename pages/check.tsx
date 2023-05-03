import CryptoJS from 'crypto-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import Layout from '../components/layout'
import { ButtonApp } from '../components/shared/buttonApp'
import { Input } from '../components/shared/input'
import { Loader } from '../components/shared/loader'
import { apiIsUserResponse } from './protected'

export default function ProtectedPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isAcces, setIsAcces] = useState(false)
  const [isLoad, setIsLoad] = useState(true)

  async function checkIsUserExist() {
    const response = await fetch(`api/user/isUser`)
    if (response.ok) {
      const responseType: apiIsUserResponse = await response.json()
      if (responseType.action === '2') {
        setIsAcces(true)
      }
    }
    setIsLoad(false)
  }

  async function checkPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.target as HTMLFormElement)
    if (session?.user?.email) {
      const supersalt = process.env.NEXT_PUBLIC_SUPERMASTERSALT + session.user.email

      const hashedMaster = CryptoJS.SHA256(supersalt + String(formData.get('master'))).toString(CryptoJS.enc.Hex)

      try {
        const response = await fetch('api/user/checkMaster', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ clientHashedMaster: hashedMaster }),
        })

        if (response.ok) {
          const data: { message: string; privateKey: string } = await response.json()
          localStorage.setItem('privateKey', data.privateKey)
          router.push('/viewPassword')
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  useEffect(() => {
    checkIsUserExist()
  }, [])

  if (isLoad) {
    return (
      <Layout>
        <Loader show={isLoad} />
      </Layout>
    )
  }

  if (!session || isAcces) {
    return (
      <Layout>
        <AccessDenied />
      </Layout>
    )
  }

  return (
    <Layout>
      <h1>Vérification de votre identité :</h1>
      <form onSubmit={checkPassword} className="text-center">
        <Input label="Entrer votre master password" type="password" name="master" />
        <ButtonApp type="submit">Vérifier</ButtonApp>
      </form>
    </Layout>
  )
}
