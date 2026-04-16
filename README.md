# Developer Portfolio Backend Starter

Express + Prisma + PostgreSQL starter template for a portfolio website with admin panel.

## Included
- Express REST API
- Prisma ORM
- PostgreSQL
- JWT authentication
- Swagger API docs
- Basic admin/content management structure
- Contact message endpoint for public site

## Quick start

```bash
npm install
cp .env.example .env
npm run prisma:generate
npm run prisma:migrate
npm run prisma:seed
npm run dev
```

## Default URLs
- API: `http://localhost:5000/api`
- Health: `http://localhost:5000/health`
- Swagger: `http://localhost:5000/api/docs`

## Default admin
Uses values from `.env`:
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`

## Suggested frontend integration
Your CRA frontend can use Axios to call:
- `POST /api/v1/auth/login`
- `GET /api/v1/portfolio`
- `POST /api/v1/messages`
- protected admin routes under `/api/v1/admin/*`
