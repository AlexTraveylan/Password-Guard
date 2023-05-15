import { signIn, signOut, useSession } from 'next-auth/react'
import Link from 'next/link'
import { Logo, SvgConnexion, SvgDeconnexion } from './shared/svgs'

export default function Header() {
  const { data: session } = useSession()

  return (
    <>
      <header>
        <div className="flex flex-row justify-between items-center gap-5 flex-wrap h-24 px-3">
          <Link className="min-w-[20%]" href="/">
            <Logo />
          </Link>
          {session && session.user ? (
            <>
              <div className="hidden flex-col items-center sm:flex">
                <p>Connecté en tant que :</p>
                <p className="font-bold">{session.user.name ?? session.user.email}</p>
              </div>
              <Link
                className="min-w-[20%] flex justify-end"
                href={`/api/auth/signout`}
                onClick={(e) => {
                  e.preventDefault()
                  signOut()
                }}
              >
                <SvgDeconnexion />
              </Link>
            </>
          ) : (
            <>
              <h3>Connectez-vous</h3>
              <Link
                className="min-w-[20%] flex justify-end"
                href={`/api/auth/signin`}
                onClick={(e) => {
                  e.preventDefault()
                  signIn()
                }}
              >
                <SvgConnexion />
              </Link>
            </>
          )}
        </div>
        <hr />
      </header>
    </>
  )
}
