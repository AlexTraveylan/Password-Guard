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

  if (session?.user?.email && req.method === 'POST') {
    const currentUser = await userService.getUserAppByEmail(session.user.email)
    const { titre, login, encryptedPasswordData, encryptedAESKey }: { titre: string; login: string; encryptedPasswordData: string; encryptedAESKey: string } = req.body

    if (!currentUser || !titre || !login || !encryptedPasswordData || !encryptedAESKey) {
      return res.status(400).json({ error: 'manque de données' })
    }

    const newPassword = await guardedPasswordsService.createGuardPassword({
      title: titre,
      login: login,
      password: Buffer.from(encryptedPasswordData, 'base64'),
      encryptedAESKey: Buffer.from(encryptedAESKey, 'base64'),
      userId: currentUser.id,
    })

    if (newPassword) {
      return res.status(201).json({ message: 'Password ajouté avec succes' })
    }
  }

  return res.status(400).json({ error: "Une erreur s'est produite." })
}
