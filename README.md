# WebComponents Demo (`@diniz/webcomponents`)

> Framework-free frontend: no React, no Vue, no Angular — only pure Vite + TypeScript + native Web Components.

This project is a practical demo of [`@diniz/webcomponents`](https://www.npmjs.com/package/@diniz/webcomponents) using a Vite + Nitro full-stack setup.

It showcases authentication screens, a dashboard layout, and a complete Category CRUD flow with reusable Web Components.

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

## API routes (Nitro)

- `POST /api/signin`
- `POST /api/signup`
- `GET /api/listcategories`
- `POST /api/createcategory`
- `PUT /api/updatecategory`
- `GET /api/category/:id`
- `DELETE /api/deletecategory/:id`

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
