import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { ButtonApp } from './shared/buttonApp'
import { PasswordInput } from './shared/password-input'
import { SvgLock } from './shared/svgs'

export function MasterFormCreate() {
  const formRef = useRef<HTMLFormElement>(null)
  const router = useRouter()
  const [isValidForm, setIsValidForm] = useState(false)
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{15,}$/

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (formRef.current) {
      const formData = new FormData(formRef.current)
      const master = formData.get('master')
      const confirm = formData.get('confirm')

      if (master && confirm) {
        const isMasterSecure = regex.test(String(formData.get('master')))
        const isConfirmEqualMaster =
          String(formData.get('master')) === String(formData.get('confirm'))

        if (isMasterSecure && isConfirmEqualMaster) {
          const response = await fetch('api/user/createUser', {
            method: 'POST',
            body: JSON.stringify({ master: formData.get('master') }),
          })

          if (response.ok) {
            router.push('/view')
          } else {
            console.error("Une erreur s'est produite")
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
        const isConfirmEqualMaster =
          String(formData.get('master')) === String(formData.get('confirm'))
        setIsValidForm(isMasterSecure && isConfirmEqualMaster)
      }
    }
  }

  return (
    <form
      ref={formRef}
      onChange={validationFormTest}
      onSubmit={handleSubmit}
      className="flex flex-col items-center shadow-md p-5 rounded-md"
    >
      <PasswordInput
        label="Master"
        name="master"
        onPaste={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
      />
      <PasswordInput
        label="Confirmation"
        name="confirm"
        onPaste={(e) => e.preventDefault()}
        onCut={(e) => e.preventDefault()}
      />

      <ButtonApp type="submit" disabled={!isValidForm}>
        {isValidForm ? 'Commencer' : <SvgLock />}
      </ButtonApp>
      <>
        {isValidForm && (
          <p className="text-orange-600 text-sm mt-2 text-center max-w-xs">
            Attention, si vous perdez ce mot de passe. Vous ne pourrez pas le
            modifier, ni le recuperer, ni acceder à vos eventuels futurs mots de
            passe enregistrés sur Password Guard.
          </p>
        )}
      </>
    </form>
  )
}
