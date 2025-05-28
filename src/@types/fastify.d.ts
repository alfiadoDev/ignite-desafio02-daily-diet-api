// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { fastify } from 'fastify'

interface User {
  sessionId: string
  id: string
}

declare module 'fastify' {
  export interface FastifyRequest {
    user?: User
  }
}
