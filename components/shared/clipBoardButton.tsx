import { useState } from 'react'
import { ButtonApp } from './buttonApp'
import { SvgKey, SvgUser } from './svgs'

export function CopyToClipboardButton({ password, btnType }: { password: string; btnType: 'user' | 'password' }) {
  const [isCopied, setIsCopied] = useState(false)

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(password)
      setIsCopied(true)

      // Réinitialiser l'état après un certain temps
      setTimeout(() => {
        setIsCopied(false)
      }, 10000)
    } catch (err) {
      console.error('Erreur lors de la copie dans le presse-papier', err)
    }
  }

  const sgv = btnType === 'user' ? <SvgUser /> : <SvgKey />

  return <ButtonApp onClick={copyToClipboard}>{isCopied ? 'Copié!' : sgv}</ButtonApp>
}

export default CopyToClipboardButton
