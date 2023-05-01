import { UserApp } from '@prisma/client'
import { prisma } from '../prisma-client'

export class UserAppService {
  async createUserApp({
    name,
    email,
    masterPassword,
    salt,
  }: Omit<UserApp, 'id'>) {
    const userApp = await prisma.userApp.create({
      data: {
        name,
        email,
        masterPassword,
        salt,
      },
    })
    return userApp
  }

  async getUserAppByEmail(email: string) {
    const userApp = await prisma.userApp.findUnique({
      where: {
        email,
      },
    })
    return userApp
  }
}
