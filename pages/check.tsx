import CryptoJS from 'crypto-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import Layout from '../components/layout'
import { ButtonApp } from '../components/shared/buttonApp'
import { Loader } from '../components/shared/loader'
import { PasswordInput } from '../components/shared/password-input'
import { apiIsUserResponse } from './protected'

export const useError = (): [error: string, pushError: (message: string) => void] => {
  const [error, setError] = useState('')
  const pushError = (message: string) => {
    setError(message)
    setTimeout(() => {
      setError('')
    }, 2000)
  }
  return [error, pushError]
}

export default function ProtectedPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [isAcces, setIsAcces] = useState(false)
  const [isLoad, setIsLoad] = useState(true)
  const [error, pushError] = useError()

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
    setIsLoad(true)
    const formData = new FormData(event.target as HTMLFormElement)
    if (session?.user?.email) {
      const supersalt = process.env.NEXT_PUBLIC_SUPERMASTERSALT + session.user.email

      const hashedMaster = CryptoJS.SHA256(supersalt + String(formData.get('master'))).toString(CryptoJS.enc.Hex)

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
        return
      }

      const data: { error: string } = await response.json()
      pushError(data.error)
    }
    setIsLoad(false)
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
      <form onSubmit={checkPassword} className="flex flex-col items-center gap-3">
        <h1>Vérification de votre identité :</h1>
        <PasswordInput label="Master" name="master" />
        <ButtonApp type="submit">Vérifier</ButtonApp>
        {error != '' && <div className="text-xs text-red-400">{error}</div>}
      </form>
    </Layout>
  )
}
