import { config } from 'dotenv'
import { z } from 'zod'

if (process.env.NODE_ENV === 'test') config({ path: '.env.test' })
else config()

const envSchema = z.object({
  NODE_ENV: z
    .enum(['development', 'test', 'production'])
    .default('development'),
  DATABASE_CLIENT: z.enum(['sqlite3', 'pg']).default('sqlite3'),
  DATABASE_URL: z.string(),
  PORT: z.coerce.number().default(3333),
})

const parsedEnv = envSchema.safeParse(process.env)

if (!parsedEnv.success) {
  console.error('Invalid enviroment variables!', parsedEnv.error.format())

  throw new Error('Invalid enviroment variables!')
}

export const env = parsedEnv.data
