import bcrypt from 'bcrypt'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { UserAppService } from '../../../prisma/services/userApp.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const userAppService = new UserAppService()

  if (session?.user?.email && req.method === 'POST') {
    const searchUser = await userAppService.getUserAppByEmail(session.user.email)

    if (searchUser) {
      const salt = searchUser.salt
      const masterPassword = searchUser.masterPassword
      const { clientHashedMaster } = req.body
      const clientDoubleHashedMaster = await bcrypt.hash(clientHashedMaster, salt)
      const clientDoubleHashedMasterBuffer = Buffer.from(clientDoubleHashedMaster)

      if (clientDoubleHashedMasterBuffer.equals(masterPassword)) {
        return res.status(200).json({ message: 'Correspondance ok' })
      }
    }
  }

  return res.status(400).json({ error: "Une erreur s'est produite." })
}
