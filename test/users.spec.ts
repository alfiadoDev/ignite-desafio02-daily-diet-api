import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest'
import { app } from '../src/app'
import { execSync } from 'node:child_process'
import request from 'supertest'

describe('Users', () => {
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

  it('Should be able to create a new user', async () => {
    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        username: 'john.doe',
        password: '123456',
      })
      .expect(201)
  })

  it('Should not be able to create a new user with exists username or email', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'john.doe',
      password: '123456',
    })

    await request(app.server)
      .post('/users')
      .send({
        name: 'John Doe',
        email: 'johndoe@example.com',
        username: 'john.doe',
        password: '123456',
      })
      .expect(400)
  })

  it('Should be able to authenticate user', async () => {
    await request(app.server).post('/users').send({
      name: 'John Doe',
      email: 'johndoe@example.com',
      username: 'john.doe',
      password: '123456',
    })

    const response = await request(app.server).post('/users/sessions').send({
      username: 'john.doe',
      password: '123456',
    })

    expect(response.get('Set-Cookie')?.length).toEqual(1)
  })
})
