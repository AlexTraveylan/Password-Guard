import { PassBdd } from '../pages/viewPassword'
import CopyToClipboardButton from './shared/clipBoardButton'

export function PasswordCard({ password }: { password: PassBdd }) {
  return (
    <div key={password.id} className="shadow-md p-5 rounded-md">
      <h3 className="text-center m-3">{password.title}</h3>
      <div className="flex flex-rox gap-3">
        <CopyToClipboardButton password={password.login} btnType="user" />
        <CopyToClipboardButton password={password.password} btnType="password" />
      </div>
    </div>
  )
}
