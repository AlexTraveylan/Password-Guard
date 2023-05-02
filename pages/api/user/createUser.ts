import bcrypt from 'bcrypt'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import { UserApp } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { generateRSAKeyPair } from '../../../prisma/services/security.service'
import { UserAppService } from '../../../prisma/services/userApp.service'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions)
  const userAppService = new UserAppService()
  const randomSalt = await bcrypt.genSalt(16)

  if (session?.user?.email && session.user.name && req.method === 'POST') {
    const searchUser = await userAppService.getUserAppByEmail(session.user.email)

    if (searchUser) {
      return res.status(400).json({ error: 'AVERTISSEMENT : Rapport de sécurité envoyé au développeur.' })
    } else {
      const { hashMaster } = JSON.parse(req.body)

      try {
        const doubleHashedMaster = await bcrypt.hash(hashMaster, randomSalt)
        const { privateKey, publicKey } = generateRSAKeyPair()

        const newUser: Omit<UserApp, 'id'> = {
          email: session.user.email,
          name: session.user.name,
          masterPassword: Buffer.from(doubleHashedMaster, 'utf-8'),
          salt: randomSalt,
          privateKey: Buffer.from(privateKey.toString(), 'utf-8'),
          publicKey: Buffer.from(publicKey.toString(), 'utf-8'),
        }

        try {
          const createdUser = await userAppService.createUserApp(newUser)
          return res.status(201).json({ message: 'Utilisateur enregistré' })
        } catch (error) {
          return res.status(500).json({
            error: "Une erreur s'est produite avec l'acces à la base de donnée",
          })
        }
      } catch (error) {
        return res.status(500).json({
          error: "Une erreur s'est produite lors du hachage du mot de passe.",
        })
      }
    }
  }

  return res.status(400).json({ error: "Une erreur s'est produite." })
}
