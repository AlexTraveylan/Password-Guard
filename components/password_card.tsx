import { useState } from 'react'
import { PassBdd } from '../pages/viewPassword'
import CopyToClipboardButton from './shared/clipBoardButton'
import { SvgClose, SvgEyeOpen } from './shared/svgs'

function splitPassword(password: string, splitedPassword: string[]): string[] {
  if (password.length > 15) {
    splitedPassword.push(`${password.slice(0, 15)}`)
    return splitPassword(password.slice(15), splitedPassword)
  } else {
    splitedPassword.push(password)
    return splitedPassword
  }
}

export function PasswordCard({ password }: { password: PassBdd }) {
  const [show, setShow] = useState(false)
  const passwordText = splitPassword(password.password, [])

  function pushInfos() {
    setShow(true)
    setTimeout(() => {
      setShow(false)
    }, 5000)
  }

  return (
    <div key={password.id} className="shadow-md p-5 rounded-md relative">
      {show && (
        <div className="absolute p-5 bg-black z-99 top-1/2 left-1/2 translate-y-[-50%] translate-x-[-50%] rounded-md text-white flex flex-col gap-3 items-center justify-center border-2 border-indigo-500">
          <div className="absolute top-0 right-0 p-1 text-red-500" onClick={() => setShow(false)}>
            <SvgClose stroke={1.7} />
          </div>
          <h3>{password.login}</h3>
          <div>
            {passwordText.map((line) => {
              return <h3>{line}</h3>
            })}
          </div>
        </div>
      )}

      <div className="flex flex-row items-center justify-center">
        <h3 className="text-center m-3">{password.title}</h3>
        <div className="hover:scale-110" onClick={() => pushInfos()}>
          <SvgEyeOpen />
        </div>
      </div>
      <div className="flex flex-rox gap-3">
        <CopyToClipboardButton password={password.login} btnType="user" />
        <CopyToClipboardButton password={password.password} btnType="password" />
      </div>
    </div>
  )
}
