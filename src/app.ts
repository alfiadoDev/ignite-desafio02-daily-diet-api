import fastify from 'fastify'
import { usersRoutes } from './routes/users.routes'
import fastifyCookie from '@fastify/cookie'
import { foodsRoutes } from './routes/foods.routes'

const app = fastify()

app.register(fastifyCookie)
app.register(usersRoutes, { prefix: 'users' })
app.register(foodsRoutes, { prefix: 'foods' })

export { app }
