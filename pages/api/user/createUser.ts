import bcrypt from 'bcrypt'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

import { UserApp } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { UserAppService } from '../../../prisma/services/userApp.service'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await getServerSession(req, res, authOptions)
  const userAppService = new UserAppService()
  const saltRounds = 12
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{15,}$/

  console.log(session?.user?.email)
  console.log(session?.user?.name)
  console.log(req.method === 'POST')

  if (session?.user?.email && session.user.name && req.method === 'POST') {
    const searchUser = await userAppService.getUserAppByEmail(
      session.user.email
    )
    if (searchUser) {
      return res.status(400).json({
        error: 'AVERTISSEMENT : Rapport de sécurité envoyé au développeur.',
      })
    } else {
      const { master } = JSON.parse(req.body)
      console.log(req.body)
      const isRegexOk = regex.test(String(master))

      if (isRegexOk) {
        try {
          const hashMaster = await bcrypt.hash(master, saltRounds)

          const newUser: Omit<UserApp, 'id'> = {
            email: session.user.email,
            name: session.user.name,
            masterPassword: Buffer.from(hashMaster, 'utf-8'),
          }

          try {
            const createdUser = await userAppService.createUserApp(newUser)
            console.log(createdUser)
            return res.status(201).json({ message: 'Utilisateur enregistré' })
          } catch (error) {
            return res.status(500).json({
              error:
                "Une erreur s'est produite avec l'acces à la base de donnée",
            })
          }
        } catch (error) {
          return res.status(500).json({
            error: "Une erreur s'est produite lors du hachage du mot de passe.",
          })
        }
      } else {
        return res.status(400).json({
          error: 'Le master password ne respecte pas les conditions demandées.',
        })
      }
    }
  }

  return res.status(400).json({ error: "Une erreur s'est produite." })
}
