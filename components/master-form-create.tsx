import CryptoJS from 'crypto-js'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { ButtonApp } from './shared/buttonApp'
import { PasswordInput } from './shared/password-input'
import { SvgLock } from './shared/svgs'

export function MasterFormCreate() {
  const { data: session } = useSession()
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const [isValidForm, setIsValidForm] = useState(false)
  const [isPaste, setIsPaste] = useState(false)
  const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{15,}$/

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      const master = formData.get('master')
      const confirm = formData.get('confirm')

      if (master && confirm) {
        const isMasterSecure = regex.test(String(formData.get('master')))
        const isConfirmEqualMaster = String(formData.get('master')) === String(formData.get('confirm'))

        if (isMasterSecure && isConfirmEqualMaster) {
          if (session?.user?.email) {
            const supersalt = process.env.NEXT_PUBLIC_SUPERMASTERSALT + session.user.email
            const response = await fetch('api/user/createUser', {
              method: 'POST',
              body: JSON.stringify({
                hashMaster: CryptoJS.SHA256(supersalt + String(formData.get('master'))).toString(CryptoJS.enc.Hex),
              }),
            })

            if (response.ok) {
              router.push('/check')
            } else {
              console.error("Une erreur s'est produite")
            }
          }
        }
      }
    }
  }

  function validationFormTest() {
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      const master = formData.get('master')
      const confirm = formData.get('confirm')

      if (master && confirm) {
        const isMasterSecure = regex.test(String(formData.get('master')))
        const isConfirmEqualMaster = String(formData.get('master')) === String(formData.get('confirm'))
        setIsValidForm(isMasterSecure && isConfirmEqualMaster)
      }
    }
  }

  function robustTest(password: string) {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{15,}$/

    return regex.test(password)
  }

  function samePasswordTest(password: string) {
    if (!formRef.current) {
      return true
    }

    const formData = new FormData(formRef.current)
    const master = String(formData.get('master'))

    return password === master
  }

  return (
    <form ref={formRef} onChange={validationFormTest} onSubmit={handleSubmit} className="flex flex-col items-center shadow-md p-5 rounded-md">
      <PasswordInput label="Master" name="master" validate={robustTest} validationMessage="Pas assez robuste." />
      <PasswordInput label="Confirmation" name="confirm" validate={samePasswordTest} validationMessage="Ne correspond pas." onPaste={() => setIsPaste(true)} />

      <ButtonApp type="submit" disabled={!isValidForm}>
        {isValidForm ? 'Commencer' : <SvgLock />}
      </ButtonApp>
      <>
        {isValidForm && (
          <p className="text-orange-600 text-sm mt-2 text-center max-w-xs">
            Attention, si vous perdez ce mot de passe. Vous ne pourrez pas le modifier, ni le recuperer, ni acceder à vos eventuels futurs mots de passe enregistrés sur Password Guard.
          </p>
        )}
        {isPaste && <p className="text-red-600 text-sm mt-2 text-center max-w-xs">DANGER : Vous avez copié votre mot de passe, soyez certain d'être capable de le réecrire avant de valider.</p>}
      </>
    </form>
  )
}
