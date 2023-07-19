import { useSession } from 'next-auth/react'
import { useEffect, useState } from 'react'
import AccessDenied from '../components/access-denied'
import { AddPasswordForm } from '../components/add-password-form'
import Layout from '../components/layout'
import { PasswordCard } from '../components/password_card'
import { SvgAddPassword } from '../components/shared/svgs'
import { decryptPassword, encryptData, privateKeyDecrypt } from '../prisma/services/security.service'

export type PassBdd = {
  id: number
  title: string
  login: string
  password: string
}

export default function ProtectedPage() {
  const { data: session } = useSession()
  const [isAcces, setIsAcces] = useState(false)
  const [isShow, setIsShow] = useState(false)
  const [passwords, setPasswords] = useState<PassBdd[]>([])

  async function checkIsUserLogged() {
    const response = await fetch('api/user/isAcces')
    if (response.ok) {
      setIsAcces(true)
      recupPasswords()
    }
  }

  async function recupPasswords() {
    const privateKey = localStorage.getItem('privateKey')
    if (!privateKey) return
    const response = await fetch('api/password/getAll')
    if (!response.ok) return

    const data = await response.json()

    const privateKeyBuffer = Buffer.from(privateKey, 'utf-8')

    const passBdds: PassBdd[] = []

    for (const password of data.passwords) {
      const encryptedData: encryptData = {
        iv: password.iv,
        encryptedPassword: Buffer.from(password.password, 'hex').toString('hex'),
      }

      const decryptedAESKey = privateKeyDecrypt(Buffer.from(password.encryptedAESKey, 'base64'), privateKeyBuffer)
      const decryptedPassword = decryptPassword(encryptedData, decryptedAESKey)

      passBdds.push({ id: password.id, title: password.title, login: password.login, password: decryptedPassword })
    }

    setPasswords(passBdds)
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
      <AddPasswordForm isShow={isShow} recupPasswords={recupPasswords} />
      {isAcces && passwords.length > 0 && (
        <div className="flex flex-row gap-3 flex-wrap justify-center">
          {passwords.map((password) => {
            return <PasswordCard password={password} recupPasswords={recupPasswords} />
          })}
        </div>
      )}
    </Layout>
  )
}
