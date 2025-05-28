# 🥗 Daily Diet API

A **Daily Diet API** é uma API RESTful desenvolvida com **Node.js** e **Fastify** para ajudar usuários a controlarem sua alimentação diária. Com ela, é possível registrar alimentos, marcar se estão dentro ou fora da dieta, e extrair métricas relevantes para o acompanhamento nutricional.

---

## 🚀 Como rodar o projeto

1. Copie os arquivos de ambiente:
   ```bash
   cp .env.example .env
   cp .env.test.example .env.test
   ```
   Configure os valores conforme suas variáveis locais.

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Rode os testes automatizados:
   ```bash
   npm test
   ```

4. Inicie o servidor em modo desenvolvimento:
   ```bash
   npm run dev
   ```

---

## ⚙️ Tecnologias utilizadas

- [Node.js 22](https://nodejs.org)
- [Fastify](https://www.fastify.io/)
- [TypeScript](https://www.typescriptlang.org/)
- [Zod](https://zod.dev/) — Validação de dados
- [Knex.js](https://knexjs.org/) — Query Builder
- [SQLite3](https://www.sqlite.org/) ou [PostgreSQL](https://www.postgresql.org/) — Banco de dados
- [Dotenv](https://github.com/motdotla/dotenv) — Variáveis de ambiente
- [Vitest](https://vitest.dev/) — Testes automatizados
- [Supertest](https://github.com/visionmedia/supertest) — Testes end-to-end
- [ESLint](https://eslint.org/) — Padronização de código

---

## 📦 Rotas e funcionalidades

### 👤 Usuários

- `POST /users`  
  Criação de usuário com os dados: `name`, `email`, `username`, `password`.

- `POST /users/sessions`  
  Autenticação de usuário. Envie `username` e `password`.  
  A resposta contém um **cookie `sessionId`** usado para identificar o usuário nas próximas requisições.

---

### 🍽️ Alimentos

- `POST /foods`  
  Criação de alimento. Campos: `name`, `description`, `date`, `isItOnDiet` (true/false).

- `GET /foods`  
  Lista todos os alimentos do usuário autenticado.

- `GET /food/:foodId`  
  Retorna os dados de um alimento específico.

- `PUT /food/:foodId`  
  Atualiza um alimento. Campos esperados: `name`, `description`, `date`, `isItOnDiet`.  
  Retorna status **204** em caso de sucesso.

- `DELETE /food/:foodId`  
  Remove um alimento. Retorna status **204**.

---

### 📊 Métricas

- `GET /food/metrics`  
  Retorna métricas da dieta do usuário:
  - `totalFoods`: Total de alimentos registrados
  - `totalDietFoods`: Alimentos dentro da dieta
  - `totalOutDietFoods`: Alimentos fora da dieta
  - `foodsWithinDiet`: Porcentagem de alimentos dentro da dieta

---

## 🔐 Autenticação

- A API utiliza autenticação por **cookie (`sessionId`)** retornado no login.
- Este cookie deve ser enviado em todas as requisições protegidas.

---

## 📌 Observações

- A aplicação é compatível com **SQLite3** ou **PostgreSQL** como banco de dados.
- Código organizado com **padronização ESLint** e cobertura de testes com **Vitest**.

---

## 💡 Contribuição

Sinta-se à vontade para abrir issues, contribuir com melhorias ou sugerir funcionalidades.

---

## 🧑‍💻 Autor

Desenvolvido com 💚 por **[Alfiado Constantino]**

---

## 📝 Licença

Este projeto está licenciado sob a [MIT License](LICENSE).