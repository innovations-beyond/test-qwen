# AGENTS.md

## Repository Intent
- Joelle's Pastries: dessert catering and à la carte delivery platform.
- Hybrid model: self-serve online ordering for individual desserts + quote-based flow for event catering.

## Architecture
- `backend/` — Django 5.2 REST API (DRF, PostgreSQL, Stripe, SendGrid)
- `web/` — Next.js 15 public website (menu, catering info, quote wizard)
- `mobile/` — Expo/React Native app (ordering, accounts)
- `admin/` — React + Vite admin dashboard (orders, quotes, menu, settings)

## Execution Rules
- Run backend via Docker Compose: `docker compose up backend`
- Frontend dev servers run independently or via Docker Compose
- Default backend port: 8000, Web: 3000, Admin: 5173

## Architecture Rules
- Backend: single Django app (`pastries`) unless explicitly expanded
- Shared model primitives in `backend/pastries/models.py`
- API/business logic separation:
  - models: schema and relationships
  - serializers: validation and transformation
  - views: HTTP boundary and orchestration

## Security & Configuration
- Env-based configuration in settings
- No hard-coded secrets
- CORS restricted to known frontend origins
- Stripe keys via environment variables only

## Dependency Management
- Backend: Poetry (`backend/pyproject.toml`), explicit version pins
- Frontend: npm with lock files committed
- Keep lock files in sync when upgrading

## Quality Gates
- Python: black, isort, flake8, pytest
- TypeScript: strict mode, typecheck before commit
- Pre-commit hooks for formatting

## Deployment Assumptions
- Single exposed backend port: 8000
- PostgreSQL on internal Docker network
- `DJANGO_DEBUG=1` for development only
- Static files served by WhiteNoise in production
