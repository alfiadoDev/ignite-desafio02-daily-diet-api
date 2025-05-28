import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Foods', () => {
  beforeAll(async () => {
    await app.ready()
  })

  beforeEach(() => {
    execSync('npm run knex -- migrate:rollback --all')
    execSync('npm run knex -- migrate:latest')
  })

  afterAll(async () => {
    await app.close()
  })

  it('Should be able to create a new food', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'john.doe',
      password: '123456',
    })

    const sessionResponse = await request(app.server)
      .post('/users/sessions')
      .send({
        username: 'john.doe',
        password: '123456',
      })

    const createFoodResponse = await request(app.server)
      .post('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send({
        name: 'Humburguer',
        description: 'food description',
        date: new Date(),
        isItOnDiet: false,
      })

    expect(createFoodResponse.statusCode).toEqual(201)
  })

  it('Should be able to list all foods', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'john.doe',
      password: '123456',
    })

    const sessionResponse = await request(app.server)
      .post('/users/sessions')
      .send({
        username: 'john.doe',
        password: '123456',
      })

    await request(app.server)
      .post('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send({
        name: 'Humburguer',
        description: 'food description',
        date: new Date(),
        isItOnDiet: false,
      })

    const foodsResponse = await request(app.server)
      .get('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send()

    expect(foodsResponse.body.foods).toEqual([
      expect.objectContaining({
        name: 'Humburguer',
        description: 'food description',
      }),
    ])
  })

  it('Should be able to update a food', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'john.doe',
      password: '123456',
    })

    const sessionResponse = await request(app.server)
      .post('/users/sessions')
      .send({
        username: 'john.doe',
        password: '123456',
      })

    await request(app.server)
      .post('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send({
        name: 'Humburguer',
        description: 'food description',
        date: new Date(),
        isItOnDiet: false,
      })

    const foodsResponse = await request(app.server)
      .get('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send()

    await request(app.server)
      .put(`/foods/${foodsResponse.body.foods[0].id}`)
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send({
        name: 'Humburguer updated',
        description: 'food description updated',
        date: new Date(),
        isItOnDiet: true,
      })
      .expect(204)

    const foodsResponse2 = await request(app.server)
      .get('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send()

    expect(foodsResponse2.body.foods).toEqual([
      expect.objectContaining({
        name: 'Humburguer updated',
        description: 'food description updated',
      }),
    ])
  })

  it('Should be able to delete a food', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'john.doe',
      password: '123456',
    })

    const sessionResponse = await request(app.server)
      .post('/users/sessions')
      .send({
        username: 'john.doe',
        password: '123456',
      })

    await request(app.server)
      .post('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send({
        name: 'Humburguer',
        description: 'food description',
        date: new Date(),
        isItOnDiet: false,
      })

    const foodsResponse = await request(app.server)
      .get('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send()

    await request(app.server)
      .delete(`/foods/${foodsResponse.body.foods[0].id}`)
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send()
      .expect(204)
  })

  it('Should be able to get a specific food', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'john.doe',
      password: '123456',
    })

    const sessionResponse = await request(app.server)
      .post('/users/sessions')
      .send({
        username: 'john.doe',
        password: '123456',
      })

    await request(app.server)
      .post('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send({
        name: 'Humburguer',
        description: 'food description',
        date: new Date(),
        isItOnDiet: false,
      })

    const foodsResponse = await request(app.server)
      .get('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send()

    const foodResponse = await request(app.server)
      .get(`/foods/${foodsResponse.body.foods[0].id}`)
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send()

    expect(foodResponse.body.food).toEqual(
      expect.objectContaining({
        name: 'Humburguer',
        description: 'food description',
      }),
    )
  })

  it('Should be able to list all metrics', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'john.doe',
      password: '123456',
    })

    const sessionResponse = await request(app.server)
      .post('/users/sessions')
      .send({
        username: 'john.doe',
        password: '123456',
      })

    await request(app.server)
      .post('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send({
        name: 'Humburguer',
        description: 'food description',
        date: new Date(),
        isItOnDiet: false,
      })

    await request(app.server)
      .post('/foods')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send({
        name: 'Salada',
        description: 'salada description',
        date: new Date(),
        isItOnDiet: true,
      })

    const metricsResponse = await request(app.server)
      .get('/foods/metrics')
      .set('Cookie', sessionResponse.get('Set-Cookie')!)
      .send()

    expect(metricsResponse.body.metrics).toEqual(
      expect.objectContaining({
        totalFoods: 2,
        totalDietFoods: 1,
        totalOutDietFoods: 1,
        foodsWithinDiet: 50,
      }),
    )
  })
})
