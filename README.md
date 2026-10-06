# Joelle's Pastries

Dessert catering and à la carte dessert delivery platform.

## Services

- **À la carte ordering** — browse the dessert menu, order online, get delivery or pickup
- **Event catering** — request a quote for full dessert catering (dessert stations, cake cutting, buffets)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Django 5.2, DRF, PostgreSQL, Stripe, SendGrid |
| Web | Next.js 15 (App Router) |
| Mobile | Expo / React Native |
| Admin | React + Vite |
| Infra | Docker Compose |

## Project Structure

```
test-qwen/
├── backend/       # Django REST API
├── web/           # Next.js public website
├── mobile/        # Expo/React Native app
├── admin/         # React + Vite admin panel
├── docker-compose.yml
└── .env.example
```

## Quick Start

```bash
cp .env.example .env
# Edit .env with your keys

docker compose up --build
```

| Service | URL |
|---------|-----|
| Web | http://localhost:3000 |
| Mobile (Expo) | Scan QR from `docker compose logs mobile` |
| Admin | http://localhost:5173 |
| API | http://localhost:8000/api/ |

## Development

### Backend

```bash
docker compose exec backend python manage.py migrate
docker compose exec backend python manage.py createsuperuser
docker compose exec backend pytest
```

### Web

```bash
cd web && npm install && npm run dev
```

### Mobile

```bash
cd mobile && npm install && npx expo start
```

### Admin

```bash
cd admin && npm install && npm run dev
```

## License

Private — Joelle's Pastries
