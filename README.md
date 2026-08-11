# myTask

Personal daily task and planning app (backend only) built with Spring Boot.

## Tech stack

- Java 21
- Spring Boot 3.x (Web, Data JPA, Validation)
- Flyway migrations
- PostgreSQL (runtime)
- H2 (tests)
- Lombok
- OpenAPI/Swagger UI (springdoc)

## Run locally

### 1) Start PostgreSQL

```bash
docker compose up -d
```

Postgres defaults from `docker-compose.yml`:

- DB: `mytask`
- User: `mytask`
- Password: `mytask`
- Port: `5432`

### 2) Run the app

```bash
mvn spring-boot:run
```

The default profile uses PostgreSQL via `application.yml`/`application-dev.yml`.

You can override DB settings with env vars:

- `DB_URL`
- `DB_USERNAME`
- `DB_PASSWORD`

## API docs

- Swagger UI: `http://localhost:8080/swagger-ui.html`
- OpenAPI JSON: `http://localhost:8080/v3/api-docs`

## Main endpoints

### Tasks

- `POST /api/tasks`
- `GET /api/tasks/{id}`
- `GET /api/tasks?status=&priority=&source=&dueDateFrom=&dueDateTo=`
- `PUT /api/tasks/{id}`
- `DELETE /api/tasks/{id}`
- `GET /api/tasks/stale?days=3`
- `GET /api/tasks/overdue`

### Plans

- `POST /api/plans`
- `GET /api/plans/{id}`
- `GET /api/plans`
- `PUT /api/plans/{id}`
- `DELETE /api/plans/{id}`
- `GET /api/plans/today`
- `POST /api/plans/generate?date=YYYY-MM-DD`

`/api/plans/generate` is currently a stub that returns overdue + high-priority candidate tasks.

## Test

```bash
mvn test
```

Tests run with H2 in PostgreSQL compatibility mode using the `test` profile.
