# WebComponents Demo (`@diniz/webcomponents`)

> Framework-free frontend: no React, no Vue, no Angular — only pure Vite + TypeScript + native Web Components.

This project is a practical demo of [`@diniz/webcomponents`](https://www.npmjs.com/package/@diniz/webcomponents) using a Vite + Nitro full-stack setup.

It showcases authentication screens, a dashboard layout, and complete Category, Expense, and Income CRUD flows with reusable Web Components.

## Tech stack

- Frontend: Pure Vite + TypeScript + native Custom Elements (no frontend framework)
- UI library: `@diniz/webcomponents`
- Backend: Nitro server API routes
- Database/ORM: SQLite + Prisma
- Auth: better-auth (email/password)

## Components used from `@diniz/webcomponents`

The demo uses the following components and utilities:

### UI Components

- `ui-button`
- `ui-input`
- `ui-toast`
- `ui-modal`
- `ui-table`
- `ui-card`
- `ui-layout`
- `ui-layout-header`
- `ui-layout-sidebar`
- `ui-layout-main`
- `ui-pagination`


### Utilities

- `createRouter` (root and nested dashboard routing)
- `applyTheme('shadcn')`
- `getFormValues`
- `queryElement`
- `getPathParams`
- `http` helper (`get`/`post`)
- `getIconSvg`

## Features demonstrated

- Framework-free SPA architecture with native Web Components only
- SPA routing with route-level lazy loading
- Route guard using local storage token (`/dashboard/*` protected)
- Theme application via component library (`shadcn`)
- Login flow with loading states and inline error feedback
- Signup flow with toast feedback and redirect
- Dashboard shell using layout web components
- Category CRUD:
	- List categories in `ui-table`
	- Create/Edit category form with validation
	- Delete confirmation using `ui-modal`
	- Success/error messaging with `ui-toast`
- Expense CRUD:
	- List expenses with category and date
	- Create/Edit expense form with amount/date validation
	- Delete expense with confirmation modal
- Income CRUD:
	- List incomes with amount and date
	- Create/Edit income form with amount/date validation
	- Delete income with confirmation modal
- Backend API integration with typed frontend usage
- Persistent data in SQLite via Prisma migrations

## Why no framework?

- Standards-based UI: built on native Custom Elements instead of framework runtime abstractions
- Lower overhead: minimal client runtime with fast startup and straightforward bundles via Vite
- Simpler stack: fewer concepts to learn, easier debugging, and clean interoperability with any backend

## App routes

- `/` → Login
- `/signup` → Signup
- `/dashboard/categories` → Category list
- `/dashboard/categories/save` → Create category
- `/dashboard/categories/:id` → Edit category
- `/dashboard/expenses` → Expense list
- `/dashboard/expenses/save` → Create expense
- `/dashboard/expenses/:id` → Edit expense
- `/dashboard/incomes` → Income list
- `/dashboard/incomes/save` → Create income
- `/dashboard/incomes/:id` → Edit income

## API routes (Nitro)

- `POST /api/signin`
- `POST /api/signup`
- `GET /api/listcategories`
- `POST /api/createcategory`
- `PUT /api/updatecategory`
- `GET /api/category/:id`
- `DELETE /api/deletecategory/:id`
- `GET /api/listexpenses`
- `POST /api/createexpense`
- `PUT /api/updateexpense`
- `GET /api/expense/:id`
- `DELETE /api/deleteexpense/:id`
- `GET /api/listincomes`
- `POST /api/createincome`
- `PUT /api/updateincome`
- `GET /api/income/:id`
- `DELETE /api/deleteincome/:id`

## Getting started

```bash
npm install
npm run migrate
npm run dev
```

Open the app in your browser (Vite default: `http://localhost:5173`).

## Database and migrations

- Prisma schema: `prisma/schema.prisma`
- SQLite file: `data/app.db`
- Migrations: `prisma/migrations/*`
- Apply pending migrations: `npm run migrate`

## Build and preview

```bash
npm run build
npm run preview
```

For deployment options, see the [Nitro documentation](https://v3.nitro.build/deploy).

## Free fullstack deploy (Render + Turso)

This app can run as a single fullstack service on Render (free web service), with Turso as the free persistent SQLite/libSQL database.

### 1) Create a Turso database

- Create a DB in Turso and get:
	- `DATABASE_URL` (libsql URL)
	- `TURSO_AUTH_TOKEN`
- In Render, set `DATABASE_URL` to include the token, for example:

```bash
DATABASE_URL=libsql://your-db-name-your-org.turso.io?authToken=YOUR_TURSO_AUTH_TOKEN
```

### 2) Create Render Web Service

- Runtime: Node
- Build command:

```bash
npm ci && npx prisma generate && npm run build
```

- Start command:

```bash
node .output/server/index.mjs
```

- Environment variables:
	- `NODE_ENV=production`
	- `HOST=0.0.0.0`
	- `PORT=10000`
	- `DATABASE_URL=<your libsql url with authToken>`
	- `BETTER_AUTH_SECRET=<long-random-secret>`
	- `BETTER_AUTH_URL=https://<your-render-service>.onrender.com`

### 3) Enable CI/CD with GitHub Actions

This repository includes [Deploy workflow](.github/workflows/deploy-render.yml) that:

- Runs on push to `main` (and manual dispatch)
- Installs deps, generates Prisma client, and builds
- Triggers Render deploy hook

Add this GitHub secret in your repo:

- `RENDER_DEPLOY_HOOK_URL`: from Render service settings (Deploy Hook)

After setting the secret, every push to `main` deploys automatically.

## Docker deployment

This repository includes a production multi-stage Docker build in `DockerFile`.

Build image:

```bash
docker build -f DockerFile -t webcomponentsdemo:latest .
```

Run container:

```bash
docker run --rm -p 3000:3000 \
	-e NODE_ENV=production \
	-e HOST=0.0.0.0 \
	-e PORT=3000 \
	-e DATABASE_URL="libsql://<db>.turso.io?authToken=<token>" \
	-e BETTER_AUTH_SECRET="<long-random-secret>" \
	-e BETTER_AUTH_URL="http://localhost:3000" \
	webcomponentsdemo:latest
```
