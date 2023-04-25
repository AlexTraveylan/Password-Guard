import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Description } from './description'
import { ButtonApp } from './shared/buttonApp'

export default function BtnAccesIfLogged() {
  const { data: session } = useSession()

  // If no session exists, display access denied message
  if (!session) {
    return (
      <>
        <Description />
      </>
    )
  }

  // If session exists, display content
  return (
    <Link href="/protected">
      <ButtonApp>Entrer</ButtonApp>
    </Link>
  )
}
