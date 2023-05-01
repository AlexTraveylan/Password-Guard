import { z } from 'zod'

export const GuardedPasswordSchema = z.object({
  id: z.number().int().nonnegative(),
  title: z.string().max(255),
  login: z.string().max(255),
  password: z.instanceof(Buffer),
  userId: z.number().int(),
})

export type GuardedPassword = z.infer<typeof GuardedPasswordSchema>

export const UserAppSchema = z.object({
  id: z.number().int().nonnegative(),
  name: z.string(),
  email: z.string().email(),
  masterPassword: z.instanceof(Buffer),
  salt: z.string(),
  guardedPasswords: z.array(GuardedPasswordSchema).optional(),
})

export type UserApp = z.infer<typeof UserAppSchema>
