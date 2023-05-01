import { ComponentPropsWithoutRef, useState } from 'react'
import styles from './password-input.module.css'
import { SvgEyeClose, SvgEyeOpen } from './svgs'

type InputProps = ComponentPropsWithoutRef<'input'> & {
  label: string
  validate?: (password: string) => boolean
  validationMessage?: string
}

export function PasswordInput({
  label,
  validate,
  validationMessage,
  ...props
}: InputProps) {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false)
  const [isValid, setIsValid] = useState(true)

  function togglePasswordVisibility(visible: boolean) {
    setIsPasswordVisible(visible)
  }

  function validatePassword(password: string) {
    if (validate) {
      const isValidated = validate(password)
      setIsValid(isValidated)
    }
  }

  return (
    <div className="mb-3 max-w-xs flex flex-col gap-1 items-center">
      <label htmlFor="default-input" className="block text-sm">
        {label}
      </label>
      <div className="inline-flex items-center gap-3">
        <input
          id="default-input"
          className={`border rounded-lg block px-3 py-1 ${
            !isValid && styles.notValid
          }`}
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
          {validationMessage != undefined ? (
            <>{validationMessage}</>
          ) : (
            <>Champ non valide</>
          )}
        </p>
      )}
    </div>
  )
}
