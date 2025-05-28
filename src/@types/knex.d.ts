// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Knex } from 'knex'

declare module 'knex/types/tables' {
  interface User {
    id: string
    name: string
    email: string
    username: string
    password: string
    session_id?: string
    created_at: string
  }

  interface Food {
    id: string
    user_id: string
    name: string
    description: string
    date: string
    is_it_on_diet: boolean
    created_at: string
    updated_at: string
  }

  export interface Tables {
    users: User
    foods: Food
  }
}
