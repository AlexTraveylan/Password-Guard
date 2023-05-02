import { NextApiRequest, NextApiResponse } from 'next'
import { generateAccessToken, generateRefreshToken } from '../../../prisma/services/auth.service'
import { UserAppService } from '../../../prisma/services/userApp.service'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'
import bcrypt from 'bcrypt'

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
        const accessToken = generateAccessToken(session.user.email)
        const refreshToken = generateRefreshToken(session.user.email)
        const privateKey = searchUser.privateKey.toString('utf-8')

        res.setHeader('Set-Cookie', [
          `accessToken=${accessToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${60 * 60}; Path=/`,
          `refreshToken=${refreshToken}; HttpOnly; Secure; SameSite=Strict; Max-Age=${30 * 24 * 60 * 60}; Path=/`,
        ])

        return res.status(200).json({ message: 'Correspondance ok', privateKey: privateKey })
      }
    }
  }

  return res.status(400).json({ error: "Une erreur s'est produite." })
}
