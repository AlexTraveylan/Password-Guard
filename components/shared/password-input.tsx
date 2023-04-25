import { ComponentPropsWithoutRef, useState } from 'react'
import { SvgEyeClose, SvgEyeOpen } from './svgs'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string
}

export function PasswordInput({ label, ...props }: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isValid, setIsValid] = useState(true)

  function togglePasswordVisibility(visible: boolean) {
    setIsPasswordVisible(visible)
  }

  function validatePassword(password: string) {
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{15,}$/
    setIsValid(regex.test(password))
  }

  return (
    <div className="mb-3 max-w-xs flex flex-col gap-1 items-center">
      <label htmlFor="default-input" className="block text-sm">
        {label}
      </label>
      <div className="inline-flex items-center gap-3">
        <input
          id="default-input"
          className="border rounded-lg block px-3 py-1"
          type={isPasswordVisible ? 'text' : 'password'}
          onChange={(e) => {
            validatePassword(e.target.value)
          }}
          {...props}
        />
        <div
          onMouseDown={() => togglePasswordVisibility(true)}
          onMouseUp={() => togglePasswordVisibility(false)}
          onMouseLeave={() => togglePasswordVisibility(false)}
        >
          {isPasswordVisible ? <SvgEyeOpen /> : <SvgEyeClose />}
        </div>
      </div>
      {!isValid && (
        <p className="text-red-500 text-sm mt-1 text-center">
          Le mot de passe doit contenir au minimum 15 caractères, une minuscule,
          une MAJUSCULE, un chiffre et un caractère spécial.
        </p>
      )}
    </div>
  )
}
