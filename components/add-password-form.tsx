import { useRef } from 'react'
import { encryptPassword, generateAESKey } from '../prisma/services/security.service'
import { ButtonApp } from './shared/buttonApp'
import { Input } from './shared/input'

export function AddPasswordForm({ isShow }: { isShow: boolean }) {
  const formRef = useRef<HTMLFormElement>(null)

  async function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()

    if (!formRef.current) {
      return
    }

    const formData = new FormData(formRef.current)
    const titre = String(formData.get('titre'))
    const login = String(formData.get('login'))
    const password = String(formData.get('password'))

    // Chiffrez le mot de passe à l'aide d'une clé AES
    const aesKey = generateAESKey()
    const encryptedPasswordData = encryptPassword(password, aesKey)

    const response = await fetch('/api/user/getPublicKey')
    if (!response.ok) {
      return
    }

    const data: { message: string; publicKey: string } = await response.json()

    // Chiffrez la clé AES à l'aide de la clé publique RSA de l'utilisateur
    const publicKey = data.publicKey
    const encryptedAESKey = publicKeyEncrypt(aesKey, publicKey)

    const response2 = await fetch('/api/password/addPassword', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ titre, login, encryptedPasswordData, encryptedAESKey }),
    })

    if (response2.ok) {
    }
  }

  if (!isShow) {
    return <></>
  }

  return (
    <form ref={formRef} className="flex flex-col items-center shadow-md p-5 rounded-md">
      <Input label="Titre" type="text" name="titre" />
      <Input label="Login" type="text" name="login" />
      <Input label="Password" type="password" name="password" />
      <div onClick={(e) => handleSubmit(e)} className="text-center">
        <ButtonApp>Nouveau mot de passe</ButtonApp>
      </div>
    </form>
  )
}
function publicKeyEncrypt(aesKey: Buffer, publicKey: string) {
  throw new Error('Function not implemented.')
}
