# AGENTS.md




This file is the working guide for Codex and other coding agents in this repository.

## Project Shape

- Product: `玄乎儿分光镜`, an AI-powered fortune telling and digital feng shui ornament app.
- Frontend: Next.js Pages Router in `frontend/`, served on external port `4000`.
- Backend: Strapi 5 in `backend/`, reachable only inside the Docker network.
- Database: PostgreSQL 17 managed by Docker Compose volumes.
- Public entrypoint: `http://localhost:4000`.
- Backend proxy: browser requests to `/api`, `/admin`, `/uploads`, and Strapi admin paths are proxied by Next.js to Strapi.
- MCP server: optional tooling under `mcp-server/`, default API base is `http://localhost:4000/api`.

## Development Workflow

- Do not require host Node.js, npm, pnpm, or PostgreSQL for normal development.
- Use Docker Compose for local development:

```bash
docker compose -f docker-compose.dev.yml up --build
```

- Use Docker Compose for production-like local runs:

```bash
docker compose up -d
```

- Only the frontend should publish a host port. Keep backend and database internal unless the user explicitly asks otherwise.

## Deployment

- GitHub Actions builds and publishes Docker images to Docker Hub.
- `dev` branch publishes `dev`.
- `main` branch publishes `latest`.
- `v*` tags publish version tags.
- Server deployments should generally pull images instead of building on the server:

```bash
./scripts/deploy.sh
```

- `scripts/deploy.sh` backs up the production database before pulling and restarting images.

## Environment Rules

- Copy `example.env` to `.env` before running.
- Required AI settings:

```bash
OPENAI_API_KEY=...
OPENAI_BASE_URL=https://api.deepseek.com/v1
```

- Keep frontend API variables empty by default so the app uses same-origin proxying:

```bash
NEXT_PUBLIC_API_BASE_URL=
DEV_NEXT_PUBLIC_API_BASE_URL=
```

- `BACKEND_INTERNAL_URL` should normally be `http://backend:11337`.

## Frontend Conventions

- Use functional React components and hooks.
- Follow existing MUI patterns in `frontend/components/` and `frontend/styles/`.
- Prefer same-origin API calls such as `/api/...`; do not reintroduce browser calls to `localhost:11337`.
- Keep visual changes consistent with the existing fortune-telling themes and responsive layouts.
- Existing static assets live in `frontend/public/`.

## Backend Conventions

- Follow Strapi 5 patterns in `backend/src/api/**`.
- Keep custom business logic near the relevant API controller/service.
- Do not expose Strapi directly on a host port by default.
- Preserve public endpoints that are intentionally unauthenticated, such as `/api/get-tips`.
- Keep secrets in environment variables, not source files.

## AI Integration

- DeepSeek is accessed through OpenAI-compatible configuration.
- The key prompt file is `backend/src/api/anything-request/controllers/prompts/fortune-telling-prompt.js`.
- Preserve Chinese traditional terminology and the playful product tone when editing fortune-telling output.
- Handle AI failures gracefully; avoid changes that make the UI hang indefinitely during streaming responses.

## Docker Notes

- `docker-compose.yml`: default deployment with bundled PostgreSQL.
- `docker-compose.dev.yml`: Docker-only local development with source mounts and dependency volumes.
- `backend/.dockerignore` and `frontend/.dockerignore` should keep local build output, dependencies, uploads, logs, and env files out of image contexts.

## Editing Guidance

- Keep README product storytelling intact unless the user explicitly asks to rewrite it.
- Update README deployment snippets only when they are wrong or stale.
- Prefer small, targeted edits over broad rewrites.
- Avoid adding more compose files unless there is a strong reason.

## Reference


可参考的色系：https://github.com/zerosoul/chinese-colors