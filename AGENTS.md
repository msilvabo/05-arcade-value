<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# Arcade Vault - Developer & Agent Guide

## 1. Overview
Plataforma web para jugar online y competir por la mayor cantidad de puntos. El proyecto adopta una metodología **Spec-Driven Design** (SDD) con flujos orientados a `/spec` y `/spec-impl` siguiendo las pautas de `Klerith/fernando-skills`.

## 2. Tech Stack & Dependencies
- **Framework:** Next.js 16 (v16.4.2) con App Router (`app/`).
- **Librería de UI:** React 19 (v19.3.0), React DOM 19 (v19.3.0).
- **Lenguaje:** TypeScript 5 (v5.x), target `ES2017`, `moduleResolution: "bundler"`, paths `@/* -> ./*`.
- **Estilos:** Tailwind CSS v4 (`@tailwindcss/turbopack`, `@import "tailwindcss"` en `app/globals.css`).
- **Linter:** ESLint 9 con `eslint-config-next` (`eslint.config.mjs`).
- **Testing:** No hay framework de pruebas configurado actualmente.

## 3. Project Structure
```text
.
├── app/                  # App Router de Next.js
│   ├── favicon.ico
│   ├── globals.css       # Configuración global de Tailwind v4 y variables CSS
│   ├── layout.tsx        # Layout raíz con fuentes Geist
│   └── page.tsx          # Página principal inicial
├── public/               # Archivos estáticos (SVG, logos, etc.)
├── eslint.config.mjs     # Configuración de ESLint (flat config)
├── next.config.ts        # Configuración de Next.js
├── package.json          # Dependencias y scripts
├── tsconfig.json         # Configuración de TypeScript con alias @/*
├── README.md             # Documentación general del proyecto
└── AGENTS.md             # Guía e instrucciones para agentes de IA
```

## 4. Available Commands
Todos los comandos se ejecutan con `npm`:

| Comando | Acción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo (`next dev`) |
| `npm run build` | Compila la aplicación para producción (`next build`) |
| `npm run start` | Inicia el servidor de producción compilado (`next start`) |
| `npm run lint` | Ejecuta el linter ESLint (`eslint`) |

## 5. Development Guidelines & Conventions
- **Preservar el bloque Next.js en AGENTS.md:** Mantener siempre intacto el bloque `<!-- BEGIN:nextjs-agent-rules -->` a `<!-- END:nextjs-agent-rules -->`.
- **Next.js 16 App Router:** Todo el enrutamiento se maneja dentro de `app/`. Respetar Server Components por defecto; usar `"use client"` únicamente cuando sea estrictamente necesario (hooks interactivos, estado del cliente, APIs del navegador).
- **Estilos:** Utilizar Tailwind CSS v4 con las clases de utilidad estándar.
- **Rutas de importación:** Usar el alias `@/` para importar módulos relativos a la raíz del repositorio (ej. `@/app/...`, `@/components/...`).
- **TypeScript:** Modo estricto habilitado (`strict: true`). No ignorar errores de tipos ni usar `any` sin justificación.
- **Metodología Spec-Driven:** Para nuevas características o mecánicas de juego, definir primero la especificación (`/spec`) antes de la implementación (`/spec-impl`).
