import { GuardedPassword } from '@prisma/client'
import { prisma } from '../prisma-client'

export class GuardedPasswordService {
  async createGuardPassword({
    login,
    password,
    userId,
  }: Omit<GuardedPassword, 'id'>) {
    const guardedPassword = await prisma.guardedPassword.create({
      data: {
        login,
        password,
        userId,
      },
    })
    return guardedPassword
  }

  async updateGuardPassword({
    id,
    login,
    password,
  }: Omit<GuardedPassword, 'userId'>) {
    const guardedPassword = await prisma.guardedPassword.update({
      where: { id },
      data: {
        login,
        password,
      },
    })
    return guardedPassword
  }

  async getGuardedPasswordById(id: number) {
    const guardedPassword = await prisma.guardedPassword.findUnique({
      where: { id },
    })

    return guardedPassword
  }

  async deleteGuardedPasswordById(id: number) {
    const guardedPassword = await prisma.guardedPassword.delete({
      where: { id },
    })

    return guardedPassword
  }

  // TODO A supprimer et chercher l'user par masterPassword
  async getAllGuardedPasswordByUserID(userId: number) {
    const guardedPasswords = await prisma.guardedPassword.findMany({
      where: {
        userId: userId,
      },
    })
    return guardedPasswords
  }
}
