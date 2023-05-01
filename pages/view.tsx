import CryptoJS from 'crypto-js'
import { useSession } from 'next-auth/react'
import AccessDenied from '../components/access-denied'
import Layout from '../components/layout'
import { ButtonApp } from '../components/shared/buttonApp'
import { Input } from '../components/shared/input'

export default function ProtectedPage() {
  const { data: session } = useSession()

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
      } catch (error) {
        console.error(error)
      }
    }
  }

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
      <form onSubmit={checkPassword}>
        <Input label="Entrer votre master password" type="password" name="master" />
        <ButtonApp type="submit">Vérifer</ButtonApp>
      </form>
    </Layout>
  )
}
