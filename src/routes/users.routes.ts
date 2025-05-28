import type { FastifyInstance } from 'fastify'
import {
  createUserBodySchema,
  userSessionBodySchema,
} from './validations/user.validation'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'
import { compare, hash } from 'bcryptjs'

export async function usersRoutes(app: FastifyInstance) {
  app.post('/', async (request, reply) => {
    const parsedBody = await createUserBodySchema.safeParseAsync(request.body)

    if (!parsedBody.success)
      return reply.status(400).send(parsedBody.error.format())

    const { name, email, username, password } = parsedBody.data

    const hashedPassword = await hash(password, 6)

    await knex('users').insert({
      id: randomUUID(),
      name,
      email,
      username,
      password: hashedPassword,
    })

    return reply.status(201).send()
  })

  app.post('/sessions', async (request, reply) => {
    const parsedSessionBody = userSessionBodySchema.safeParse(request.body)

    if (!parsedSessionBody.success)
      return reply.status(400).send(parsedSessionBody.error.format())

    const { username, password } = parsedSessionBody.data

    const user = await knex('users').where('username', username).first()

    if (!user)
      return reply.status(400).send({ error: 'Username or password invalid.' })

    const compareHash = await compare(password, user.password)

    if (!compareHash)
      return reply.status(400).send({ error: 'Username or password invalid.' })

    const sessionId = randomUUID()

    await knex('users')
      .update({
        session_id: sessionId,
      })
      .where('id', user.id)

    reply.cookie('sessionId', sessionId, {
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    })

    return reply.send({
      user: {
        name: user.name,
        email: user.email,
        username: user.username,
      },
    })
  })
}
