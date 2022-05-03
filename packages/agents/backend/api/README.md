# Local Setup

- Run Postgres + Postgrest + Graphql stack locally:

```
  yarn workspace @connext/backend-api docker:postgrest:up
```

- Run database migrations:

  ```sh
  yarn workspace @connext/backend-api dbmate up
  ```

- Install [`dbmate`](https://github.com/amacneil/dbmate) (instructions for Mac OS):

  ```sh
  brew install dbmate
  ```

- Create `.env` to point at local database (or export DATABASE_URL):

```sh
# DB
# Parameters used by bakend db
POSTGRES_DB=connext
POSTGRES_USER=postgres
POSTGRES_PASSWORD=qwerty
POSTGRES_HOST_AUTH_METHOD=scram-sha-256
DATABASE_URL=postgres://postgres:qwerty@db:5432/connext
#Backend REST API Endpoint
BACKEND_URI=http://127.0.0.1:3000
```

- Create `config.json` to indicate chains and optionally override subgraph URLs:

```json
{
  "logLevel": "debug"
}
```

- Run api:

```sh
yarn workspace @connext/backend-api dev
```

# Updating DB Schema

In order to update the database schema, create a new migration:

```sh
yarn workspace @connext/backend-api dbmate new migration_name
```

Edit the migration file and run the migration:

```sh
yarn workspace @connext/backend-api dbmate up
```

Create the Typescript schema using [Zapatos](https://jawj.github.io/zapatos/):

```sh
yarn workspace @connext/backend-api zapatos
```
