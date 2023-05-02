import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { GuardedPasswordService } from '../../../prisma/services/GuardedPassword.service'
import { UserAppService } from '../../../prisma/services/userApp.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const accesToken = req.cookies.accessToken
  const userService = new UserAppService()
  const guardedPasswordsService = new GuardedPasswordService()

  if (!accesToken) {
    return res.status(401).json({ error: 'No acces Token fourni' })
  }

  if (session?.user?.email) {
    const currentUser = await userService.getUserAppByEmail(session.user.email)
    if (!currentUser) {
      return res.status(400).json({ error: 'user inconnu' })
    }

    const passwords = await guardedPasswordsService.getAllGuardedPasswordByUserID(currentUser.id)
    if (!passwords) {
      return res.status(400).json({ error: 'aucun mot de passe trouvé' })
    }

    return res.status(200).json({ message: 'Acces autorisé', passwords: passwords })
  }

  return res.status(400).json({ error: "Une erreur s'est produite." })
}
