import { z } from 'zod'
import { knex } from '../../database'

export const createUserBodySchema = z.object({
  name: z.string(),
  email: z
    .string()
    .email()
    .refine(
      async (value) => {
        const emailExists = await knex('users').where('email', value).first()
        return !emailExists
      },
      { message: 'Email already exists' },
    ),
  username: z
    .string()
    .min(4)
    .refine(
      async (value) => {
        const usernameExists = await knex('users')
          .where('username', value)
          .first()

        return !usernameExists
      },
      {
        message: 'Username allready exists',
      },
    ),
  password: z.string().min(6),
})

export const userSessionBodySchema = z.object({
  username: z.string().min(4),
  password: z.string().min(6),
})
