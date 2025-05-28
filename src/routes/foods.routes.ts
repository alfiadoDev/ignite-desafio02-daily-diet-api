import type { FastifyInstance } from 'fastify'
import { checkSessionIdExists } from '../middlewares/check-session-id-exists'
import { foodBodySchema, foodParamsSchema } from './validations/food.validation'
import { knex } from '../database'
import { randomUUID } from 'node:crypto'

export async function foodsRoutes(app: FastifyInstance) {
  app.addHook('preHandler', checkSessionIdExists)

  app.post('/', async (request, reply) => {
    const parsedBodySchema = foodBodySchema.safeParse(request.body)

    if (!parsedBodySchema.success)
      return reply.status(400).send(parsedBodySchema.error.format())

    const { name, description, date, isItOnDiet } = parsedBodySchema.data

    await knex('foods').insert({
      id: randomUUID(),
      user_id: request.user?.id,
      name,
      description,
      date: date.toString(),
      is_it_on_diet: isItOnDiet,
      updated_at: new Date().toString(),
    })

    return reply.status(201).send()
  })

  app.get('/', async (request, reply) => {
    const foods = await knex('foods')
      .where('user_id', request.user?.id)
      .select()

    return reply.send({ foods })
  })

  app.get('/metrics', async (request, reply) => {
    const totalFoodsCount = await knex('foods')
      .where('user_id', request.user?.id)
      .count('id', { as: 'totalFoods' })
      .first()

    const totalDietFoodsCount = await knex('foods')
      .where('user_id', request.user?.id)
      .andWhere('is_it_on_diet', true)
      .count('id', { as: 'totalDietFoods' })
      .first()

    const totalOutDietFoodsCount = await knex('foods')
      .where('user_id', request.user?.id)
      .andWhere('is_it_on_diet', false)
      .count('id', { as: 'totalOutDietFoods' })
      .first()

    const totalFoods = totalFoodsCount ? Number(totalFoodsCount.totalFoods) : 0
    const totalDietFoods = totalDietFoodsCount
      ? Number(totalDietFoodsCount.totalDietFoods)
      : 0
    const totalOutDietFoods = totalOutDietFoodsCount
      ? Number(totalOutDietFoodsCount.totalOutDietFoods)
      : 0

    const foodsWithinDiet = (totalDietFoods * 100) / totalFoods

    return reply.send({
      metrics: {
        totalFoods,
        totalDietFoods,
        totalOutDietFoods,
        foodsWithinDiet,
      },
    })
  })

  app.put('/:foodId', async (request, reply) => {
    const parsedParamsSchema = foodParamsSchema.safeParse(request.params)

    if (!parsedParamsSchema.success)
      return reply.status(400).send(parsedParamsSchema.error.format())

    const parsedBodySchema = foodBodySchema.safeParse(request.body)

    if (!parsedBodySchema.success)
      return reply.status(400).send(parsedBodySchema.error.format())

    const { name, description, date, isItOnDiet } = parsedBodySchema.data
    const { foodId } = parsedParamsSchema.data

    const food = await knex('foods')
      .where({
        id: foodId,
        user_id: request.user?.id,
      })
      .first()

    if (!food) return reply.status(400).send({ error: 'Food not found ' })

    await knex('foods')
      .update({
        name,
        description,
        date: date.toString(),
        is_it_on_diet: isItOnDiet,
        updated_at: new Date().toString(),
      })
      .where('id', foodId)

    return reply.status(204).send()
  })

  app.delete('/:foodId', async (request, reply) => {
    const parsedParamsSchema = foodParamsSchema.safeParse(request.params)

    if (!parsedParamsSchema.success)
      return reply.status(400).send(parsedParamsSchema.error.format())

    const { foodId } = parsedParamsSchema.data

    const food = await knex('foods')
      .where({
        id: foodId,
        user_id: request.user?.id,
      })
      .first()

    if (!food) return reply.status(400).send({ error: 'Food not found ' })

    await knex('foods').delete().where('id', foodId)

    return reply.status(204).send()
  })

  app.get('/:foodId', async (request, reply) => {
    const parsedParamsSchema = foodParamsSchema.safeParse(request.params)

    if (!parsedParamsSchema.success)
      return reply.status(400).send(parsedParamsSchema.error.format())

    const { foodId } = parsedParamsSchema.data

    const food = await knex('foods')
      .where({
        id: foodId,
        user_id: request.user?.id,
      })
      .first()

    return reply.send({ food })
  })
}
