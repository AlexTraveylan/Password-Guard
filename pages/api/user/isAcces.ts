import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const accesToken = req.cookies.accessToken

  if (!accesToken) {
    return res.status(401).json({ error: 'No acces Token fourni' })
  }

  if (session?.user?.email) {
    return res.status(200).json({ message: 'Acces autorisé' })
  }

  return res.status(400).json({ error: "Une erreur s'est produite." })
}
