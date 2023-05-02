import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'
import { generateAccessToken, verifyRefreshToken } from '../../../prisma/services/auth.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)

  if (session?.user?.email && req.method === 'POST') {
    const { refreshToken } = req.body

    const decodedRefreshToken = verifyRefreshToken(String(refreshToken))
    const newAccesToken = generateAccessToken(String(decodedRefreshToken.sub))

    return res.status(200).json({ message: 'Token actualisé', accesToken: newAccesToken })
  }

  return res.status(400).json({ error: "Une erreur s'est produite." })
}
