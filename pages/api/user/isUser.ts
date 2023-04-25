import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { UserAppService } from '../../../prisma/services/userApp.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const userAppService = new UserAppService()

  if (session?.user?.email) {
    const searchUser = await userAppService.getUserAppByEmail(
      session.user.email
    )
    if (searchUser) {
      return res.status(200).json({ action: '1' })
    } else {
      return res.status(200).json({ action: '2' })
    }
  }

  return res.status(400).json({ error: "Une erreur s'est produite." })
}
