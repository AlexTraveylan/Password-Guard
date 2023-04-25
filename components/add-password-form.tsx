import { ButtonApp } from './shared/buttonApp'
import { Input } from './shared/input'

export function AddPasswordForm({ isShow }: { isShow: boolean }) {
  function handleSubmit(e: React.MouseEvent) {
    e.preventDefault()
  }

  if (!isShow) {
    return <></>
  }

  return (
    <form className="flex flex-col items-center shadow-md p-5 rounded-md">
      <Input label="Titre" type="text" name="titre" />
      <Input label="Login" type="text" name="login" />
      <Input label="Password" type="password" name="password" />
      <div onClick={(e) => handleSubmit(e)} className="text-center">
        <ButtonApp>Nouveau mot de passe</ButtonApp>
      </div>
    </form>
  )
}
