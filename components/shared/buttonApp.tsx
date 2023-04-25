import { ButtonHTMLAttributes, ReactNode } from 'react'
import style from './button.module.css'

type ButtonAppProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode
}

export function ButtonApp({ children, ...props }: ButtonAppProps) {
  return (
    <>
      <button className={style.btn_app} {...props}>
        {children}
      </button>
    </>
  )
}
