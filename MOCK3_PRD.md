# MOCK3 — Product Requirements Document (PRD)
### Versión: `v0.0.0` (MVP)
### Fecha: 25 de Julio, 2026
### Estado: Aprobado para implementación

---

## 1. Problem Statement

Los desarrolladores frontend necesitan simular APIsREST durante el desarrollo de sus aplicaciones, pero las herramientas existentes (Mockoon, WireMock, JSON Server) requieren instalación local, no ofrecen endpoints públicos accesibles desde cualquier dispositivo, y no permiten compartir mocks con equipos de desarrollo de forma sencilla.

Mock3 resuelve esto ofreciendo una plataforma web donde los desarrolladores crean endpoints mock instantáneos, accesibles vía API key, sin necesidad de infraestructura local.

---

## 2. Solution

Mock3 es un Micro-SaaS de desarrollo enfocado en la simulación instantánea de APIs (Mocking) con una arquitectura Web2.5. El usuario se registra, crea hasta 3 endpoints mock gratuitos, configura las respuestas JSON para cada método HTTP, y accede a esos endpoints desde su frontend particular utilizando una API key generada por la plataforma.

En esta fase `v0.0.0`, el enfoque es **100% adquisición de usuarios y validación del core loop**. No se implementarán pasarelas de pago ni planes Pro funcionales en el backend, solo los muros de pago (Paywalls) visuales como estrategia de conversión futura.

---

## 3. User Stories

### 3.1 Autenticación y Cuenta

1. As a developer, I want to sign up using my GitHub account, so that I can access the dashboard without creating a new password.
2. As a developer, I want to sign up using my Google account, so that I have a quick alternative authentication method.
3. As a developer, I want to sign up using a Web3 wallet (MetaMask/Phantom), so that I can authenticate with my crypto identity.
4. As a developer, I want to sign in with a single click using OAuth, so that I can access the platform instantly.
5. As a developer, I want to see my current plan (Free) and remaining mock slots (e.g., 2/3 used), so that I know my usage at a glance.
6. As a developer, I want to log out securely, so that my session is terminated and my account is protected.
7. As a developer, I want my session to persist across browser tabs, so that I don't have to log in repeatedly.
8. As a developer, I want to see my profile information (email, plan), so that I can verify my account details.

### 3.2 Gestión de Mocks (CRUD)

9. As a developer, I want to create a new mock endpoint with a name/description, so that I can identify it later.
10. As a developer, I want to define a path for my mock (e.g., "products", "users/:id"), so that the endpoint is accessible at that route.
11. As a developer, I want to select which HTTP methods are enabled for each mock (GET, POST, PUT, DELETE), so that I can simulate a real API.
12. As a developer, I want to see a list of all my mocks with their paths and methods, so that I can manage them efficiently.
13. As a developer, I want to edit an existing mock's configuration, so that I can update its behavior without recreating it.
14. As a developer, I want to delete a mock I no longer need, so that I can free up a slot for a new one.
15. As a developer, I want to see a visual indicator when I've reached my 3-mock limit, so that I know I can't create more without upgrading.
16. As a developer, I want to see my mock's slug/identifier, so that I can construct the full URL to access it.
17. As a developer, I want to see when each mock was created, so that I can track my history.

### 3.3 Simulación de Respuestas

18. As a developer, I want to configure the response body (JSON) for each HTTP method on each mock, so that my frontend receives the expected data structure.
19. As a developer, I want to configure the HTTP status code for each response (200, 201, 404, 500, etc.), so that I can simulate different scenarios.
20. As a developer, I want to configure custom response headers (Content-Type, CORS headers), so that my frontend handles them correctly.
21. As a developer, I want to use a JSON editor (CodeMirror) with syntax highlighting to write my mock responses, so that I can catch syntax errors easily.
22. As a developer, I want to preview the JSON response in real-time while editing, so that I can verify the structure before saving.
23. As a developer, I want to simulate error responses (404 Not Found, 500 Server Error, 429 Rate Limited), so that I can test my frontend's error handling.
24. As a developer, I want to simulate a "not found" response when accessing a non-existent mock, so that the API behaves realistically.
25. As a developer, I want each method (GET, POST, PUT, DELETE) to have its own independent response configuration, so that I can simulate different behaviors per method.
26. As a developer, I want to validate that my response body is valid JSON before saving, so that broken responses don't reach my frontend.

### 3.4 Gestión de API Keys

27. As a developer, I want to generate an API key for my account, so that my frontend can authenticate with Mock3's endpoints.
28. As a developer, I want to see my active API keys with their prefix (first 8 characters), so that I can identify them without exposing the full key.
29. As a developer, I want to regenerate (revoke + create new) my API key, so that I can rotate credentials if compromised.
30. As a developer, I want to copy my API key to the clipboard with one click, so that I can quickly paste it into my frontend configuration.
31. As a developer, I want to see when each API key was created, so that I can track key age.
32. As a developer, I want the API key to be shown ONLY once after generation, so that the full key is never stored in plaintext in the database.

### 3.5 Consumo de Endpoints Mock

33. As a developer, I want to call my mock endpoints from my frontend using the API key in the Authorization header, so that Mock3 returns the configured response.
34. As a developer, I want to receive the exact JSON response I configured, with the exact status code I set, so that my frontend behaves as expected.
35. As a developer, I want to receive proper CORS headers when calling mocks from my frontend, so that cross-origin requests work correctly.
36. As a developer, I want to receive a 401 Unauthorized response if I use an invalid API key, so that security is enforced.
37. As a developer, I want to receive a 403 Forbidden response if my mock doesn't exist or belongs to another user, so that data isolation is maintained.
38. As a developer, I want all HTTP methods (GET, POST, PUT, PATCH, DELETE) to work on my mock endpoint, so that I can simulate a full REST API.

### 3.6 Rate Limiting

39. As a developer, I want a clear limit of 300 requests per hour per user, so that I understand my usage constraints.
40. As a developer, I want to receive a 429 Too Many Requests response with clear messaging when I exceed the limit, so that I know why the request failed.
41. As a developer, I want the rate limit to be per user (not per IP), so that using multiple devices doesn't bypass my limit.
42. As a developer, I want the rate limit window to be sliding (rolling hour), not fixed, so that usage resets smoothly over time.
43. As a developer, I want to see my current request count in the usage dashboard, so that I can monitor my consumption.

### 3.7 Dashboard de Usage

44. As a developer, I want to see how many requests I've made today, so that I can track my daily usage.
45. As a developer, I want to see how many requests I've made in the current hour, so that I can avoid hitting the rate limit.
46. As a developer, I want to see which of my mocks are most used, so that I can prioritize my development.
47. As a developer, I want to see a chart of my usage over time, so that I can identify patterns.
48. As a developer, I want to see my remaining requests before hitting the limit, so that I can plan accordingly.

### 3.8 UI/UX del Dashboard

49. As a developer, I want a dark-themed interface similar to VS Code, so that the environment feels familiar and reduces eye strain.
50. As a developer, I want a sidebar navigation to access Dashboard, Mocks, API Keys, Usage, and Settings, so that navigation is intuitive.
51. As a developer, I want to see HTTP methods color-coded (GET=green, POST=blue, PUT=amber, DELETE=red), so that I can quickly identify them.
52. As a developer, I want the interface to use monospace fonts for code and JSON, so that readability is optimal.
53. As a developer, I want responsive design that works on different screen sizes, so that I can manage mocks from any device.
54. As a developer, I want loading states and spinners during API calls, so that I know the system is working.
55. As a developer, I want toast notifications for success/error actions, so that I get immediate feedback.
56. As a developer, I want optimistic updates when creating/editing/deleting mocks, so that the UI feels instant.

### 3.9 Paywall y Conversión (Visual)

57. As a developer, I want to see a paywall modal when I try to create a 4th mock, so that I'm aware of the upgrade option.
58. As a developer, I want the paywall modal to use Amber Gold color (#CCA700) to indicate premium features, so that the visual hierarchy is clear.
59. As a developer, I want the paywall to mention connecting a wallet for future upgrade, so that I understand the upgrade path.

---

## 4. Implementation Decisions

### 4.1 Stack Tecnológico

#### Backend
- **Runtime:** Node.js v26 con ES Modules (`"type": "module"`)
- **Framework:** Express.js v5
- **ORM:** Drizzle ORM (NO TypeORM — Drizzle es más rápido, tiene mejor tipado TypeScript, y es ESM-native)
- **Base de Datos:** PostgreSQL (local por ahora, migrable a Neon/Supabase)
- **Auth:** Clerk SDK (`@clerk/express`) — delega autenticación, JWT, OAuth, Sybil protection
- **Validación:** Zod (schemas compartidos con frontend)
- **Arquitectura:** MVC (Model-Service-Controller)

#### Frontend
- **Framework:** React 19 + TypeScript
- **Bundler:** Vite 6
- **Routing:** React Router v7+ (route config helpers: `route`, `index`, `layout` desde `@react-router/dev/routes`)
- **UI State:** Zustand (con devtools y persist middleware)
- **Server State:** TanStack Query v5 (con optimistic updates)
- **Forms:** React Hook Form + Zod (zodResolver para validación)
- **HTTP Client:** Axios (instancia tipada con interceptores)
- **Styling:** Tailwind CSS v4 (CSS variables para shadcn/ui)
- **Componentes:** shadcn/ui (style: "new-york", iconLibrary: "lucide")
- **Iconos:** Lucide React (tree-shakeable, 1,700+ iconos consistentes)
- **JSON Editor:** CodeMirror 6 (syntax highlighting, validación JSON)
- **Auth:** Clerk (`<SignIn />`, `<UserButton />`)

### 4.2 Arquitectura Backend — MVC

```
mock3-backend/
├── src/
│   ├── models/              ← Esquemas Drizzle (types de DB)
│   ├── controllers/         ← Recibe request, valida, delega al service
│   ├── services/            ← Lógica de negocio pura
│   ├── routes/              ← Definición de endpoints Express
│   ├── middlewares/         ← Auth (Clerk), API Key, Rate Limit, Error Handler
│   ├── db/
│   │   ├── schema.ts        ← Drizzle schema (users, mocks, api_keys, request_logs)
│   │   ├── index.ts         ← Conexión a PostgreSQL
│   │   └── migrations/      ← Drizzle Kit
│   ├── config/
│   │   └── env.ts           ← Variables de entorno con Zod
│   ├── types/
│   │   └── index.ts         ← Interfaces compartidas
│   ├── utils/
│   │   ├── crypto.ts        ← SHA-256 para API keys
│   │   └── errors.ts        ← Clases de error custom
│   └── app.ts               ← Setup de Express
```

### 4.3 Arquitectura Frontend — MVC

```
mock3-dashboard/
├── src/
│   ├── components/ui/       ← shadcn/ui (copy-paste)
│   ├── models/              ← Interfaces de datos
│   ├── views/               ← Componentes de UI y páginas
│   ├── controllers/         ← Lógica de orquestación
│   ├── services/            ← Llamadas HTTP (Axios)
│   ├── hooks/               ← Custom hooks globales
│   ├── stores/              ← Zustand stores (UI state)
│   ├── queries/             ← TanStack Query (server state + optimistic)
│   ├── validations/         ← Schemas Zod
│   ├── config/              ← Configuración (Clerk, QueryClient, Axios)
│   ├── routes/              ← React Router config
│   ├── lib/
│   │   ├── utils.ts         ← cn() helper de shadcn
│   │   └── http-colors.ts   ← Colores semánticos HTTP
│   ├── App.tsx
│   └── main.tsx
```

### 4.4 Modelo de Base de Datos

#### Tabla `users`
```
id:              UUID (PK, default random)
clerk_user_id:   VARCHAR(255) UNIQUE NOT NULL
email:           VARCHAR(255) — extraído de Clerk (opcional)
plan:            VARCHAR(20) DEFAULT 'free' — enum: 'free', 'pro'
max_slots:       INTEGER DEFAULT 3
created_at:      TIMESTAMP DEFAULT now()
```

#### Tabla `mocks`
```
id:              UUID (PK, default random)
user_id:         UUID FK → users(id) NOT NULL
slug:            VARCHAR(255) UNIQUE NOT NULL — identificador del endpoint
name:            VARCHAR(255) — nombre descriptivo
path:            VARCHAR(255) NOT NULL — ruta interna (ej: "products", "users/:id")
methods:         JSONB NOT NULL — { GET: {status, headers, body}, POST: {...}, ... }
is_active:       BOOLEAN DEFAULT true
created_at:      TIMESTAMP DEFAULT now()
```

#### Tabla `api_keys`
```
id:              UUID (PK, default random)
user_id:         UUID FK → users(id) NOT NULL
key_hash:        VARCHAR(255) NOT NULL — SHA-256 de la API key
key_prefix:      VARCHAR(10) NOT NULL — primeros 8 chars para identificación
is_active:       BOOLEAN DEFAULT true
expires_at:      TIMESTAMP nullable — null = sin expiración
created_at:      TIMESTAMP DEFAULT now()
```

#### Tabla `request_logs`
```
id:              UUID (PK, default random)
user_id:         UUID FK → users(id) NOT NULL
mock_id:         UUID FK → mocks(id) NOT NULL
method:          VARCHAR(10) NOT NULL
ip_address:      VARCHAR(45) — IPv4 o IPv6
user_agent:      VARCHAR(500) nullable
timestamp:       TIMESTAMP DEFAULT now()

INDEX: idx_request_logs_user_time ON (user_id, timestamp) — CRÍTICO para rate limiting
```

### 4.5 Sistema de Autenticación — Dos capas

#### Capa 1: Dashboard (Clerk JWT)
- El dashboard de Mock3 se autentica exclusivamente con Clerk
- `clerkMiddleware()` verifica el JWT en cada request al backend
- Clerk maneja OAuth (GitHub, Google, Web3), sesiones, refresh tokens
- El `clerkUserId` se sincroniza con la tabla `users` al hacer login

#### Capa 2: Frontend del usuario (API Key)
- El frontend del usuario consume los endpoints mock con una API Key
- La API Key es un UUID generado por Mock3 (NO es un JWT)
- Se almacena como SHA-256 hash en la DB (nunca en texto plano)
- Se muestra al usuario UNA SOLA VEZ después de generarse
- Se envía vía header: `Authorization: Bearer m3_live_xxxxx`

#### Flujo de autenticación por capa:
```
Dashboard → Clerk JWT → clerkMiddleware() → Controller
Frontend usuario → API Key → apikeyMiddleware() → Controller → /mocks/{*path}
```

### 4.6 Modelo de Negocio — Free Tier

- **3 endpoints mock** por usuario (hard limit, no negociable)
- **300 requests por hora** por usuario (ventana deslizante, compartidas entre TODAS sus API keys)
- **Sin plan Pro** en esta versión — solo paywall visual como conversión futura
- Si el usuario intenta crear un 4to mock → respuesta 403 con `FREE_TIER_LIMIT_REACHED`
- Si el usuario excede 300 req/hora → respuesta 429 con `RATE_LIMIT_EXCEEDED`

### 4.7 Rate Limiting

- **Por usuario**, NO por API key ni por IP (un usuario con 2 PCs no duplica su límite; crear más API keys tampoco lo aumenta)
- **Ventana deslizante** de 1 hora (no ventana fija)
- **Implementación:** Query a `request_logs` con `COUNT(*) WHERE user_id = X AND timestamp > NOW() - INTERVAL '1 hour'`
- **Índice compuesto:** `(user_id, timestamp)` para performance O(log n)
- **Limpieza de logs:** Job cada 28 horas que borra registros con más de 28 horas de antigüedad (buffer de 4h sobre el window de 24h del dashboard)
- **Respuesta cuando se excede:** HTTP 429 con `{ error: 'RATE_LIMIT_EXCEEDED', message: '...' }` y headers `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `X-RateLimit-Reset`

### 4.8 CORS

- **Dashboard:** `Access-Control-Allow-Origin` = URL del dashboard (configurable por env)
- **Frontend del usuario:** Las llamadas al endpoint mock van directamente al backend de Mock3. Si el frontend del usuario está en un dominio diferente, se configura CORS dinámico basado en la API key válida
- **Headers permitidos:** `Content-Type`, `Authorization`
- **Métodos permitidos:** `GET, POST, PUT, PATCH, DELETE, OPTIONS`
- **Credentials:** `true` para el dashboard, `false` para endpoints mock

### 4.9 Endpoints del Backend

#### Dashboard (autenticados con Clerk JWT):
```
POST   /api/mocks                    → Crear un nuevo endpoint mock
GET    /api/mocks                    → Listar mis endpoints mock
GET    /api/mocks/:id                → Ver un endpoint mock específico
PUT    /api/mocks/:id                → Editar la configuración de un mock
DELETE /api/mocks/:id                → Eliminar un endpoint mock
POST   /api/api-keys                 → Generar nueva API Key
GET    /api/api-keys                 → Listar mis API Keys
POST   /api/api-keys/:id/regenerate  → Regenerar una API Key
GET    /api/usage                    → Obtener stats de uso
GET    /api/usage/current            → Obtener uso de la hora actual
```

#### Endpoints Mock del usuario (autenticados con API Key):
```
*      /mocks/{*path}                    → Devuelve lo que el usuario configuró para ese método
```

#### Endpoints públicos (sin auth):
```
GET    /api/health                   → Health check
```

### 4.10 Diseño Visual — Industrial Workspace

#### Paleta de Colores (Dark Mode — Producción Principal):
```
Fondos:
  Activity Bar:   #181818
  Sidebar:        #1F1F1F
  Editor/Workspace: #252526
  Terminal/Consola: #1E1E1E
  Bordes:         #2B2B2B

Colores de Acento:
  Cobalt Blue:    #007ACC (botones primarios, pestañas activas, focus rings)
  Amber Gold:     #CCA700 (premium/pro, paywalls, llamadas de atención)

Colores HTTP:
  GET:    text-emerald-500, bg-emerald-500/10
  POST:   text-blue-400, bg-blue-400/10
  PUT:    text-amber-500, bg-amber-500/10
  PATCH:  text-orange-400, bg-orange-400/10
  DELETE: text-red-500, bg-red-500/10

Colores de Estado:
  Success:  text-emerald-500
  Warning:  text-amber-500
  Error:    text-red-500
  Info:     text-blue-400
```

#### Tipografía:
```
UI General:      Inter, system-ui, sans-serif
Código/JSON:     JetBrains Mono, ui-monospace, monospace

Pesos de fuente:
  Títulos de sección: 13px, font-semibold (600), tracking-wide
  Navegación/etiquetas: 12px, font-medium (500)
  Rutas API/métodos: 11-12px, font-bold (700)
  Editor JSON: 12px, font-normal (400), leading-relaxed
  Footer: 11px, font-normal (400)
```

### 4.11 Optimistic Updates (TanStack Query v5)

- **CREATE mock:** El mock aparece en la lista INMEDIATAMENTE con un `temp-id`. Si el servidor falla, se revierte el caché al estado anterior.
- **UPDATE mock:** Los campos se actualizan optimísticamente en el caché. Si falla, se revierte.
- **DELETE mock:** El mock se elimina optimísticamente de la lista. Si falla, se revierte.
- **Patrón:** `onMutate` → cancelQueries → snapshot previous → setQueryData optimístico → return snapshot → onError rollback → onSettled invalidateQueries
- **Query Keys:** Estructura consistente: `['mocks']`, `['mocks', 'list']`, `['mocks', 'detail', id]`

### 4.12 Validación (Zod)

- **Schemas compartidos:** Los schemas de validación se definen una vez y se reutilizan en backend (Drizzle) y frontend (React Hook Form)
- **Mock creation schema:** name (min 1), path (min 1, pattern), methods (array of enums), responseBody (valid JSON string)
- **API Key schema:** validación de formato
- **Response validation:** Cada respuesta de la API se valida con Zod antes de enviar al frontend

### 4.13 Componentes shadcn/ui

Componentes instalados para el dashboard:
```
button, card, input, label, select, dialog, dropdown-menu,
badge, separator, sheet, tabs, toast, tooltip, table,
command, popover, form
```

Todos configurados con la paleta "Industrial Workspace" vía CSS variables.

---

## 5. Testing Decisions

### 5.1 Backend

- **Unit tests:** Services (lógica de negocio aislada de HTTP)
- **Integration tests:** Controllers + DB (Drizzle + PostgreSQL de test)
- **E2E tests:** Endpoints completos con autenticación mockeada
- **Rate limiting tests:** Verificar que el conteo funciona con ventana deslizante
- **Framework:** Vitest (compatible con ESM nativo)

### 5.2 Frontend

- **Unit tests:** Custom hooks, stores Zustand, utilidades
- **Component tests:** Componentes aislados con React Testing Library
- **Integration tests:** Flujos completos (login → crear mock → ver mock)
- **Framework:** Vitest + React Testing Library

### 5.3 Criterios de calidad

- Cero `any` en TypeScript — todo tipado
- Cero errores de ESLint
- Coverage mínimo: 80% en services y controllers
- Todos los endpoints deben tener al menos un test de integración
- Los schemas Zod deben tener tests de validación (casos válidos e inválidos)

---

## 6. Out of Scope (v0.0.0)

- Pasarelas de pago (Stripe, crypto wallets para upgrade)
- Planes Pro funcionales en el backend
- WebSockets o tiempo real
- Colaboración de equipo (sharing mocks entre usuarios)
- Importación/exportación de mocks
- Templates de respuestas predefinidas
- Testing de endpoints desde la UI (como Postman)
- Documentación automática de la API (OpenAPI/Swagger)
- Rate limiting por IP (solo por usuario)
- Multi-tenancy avanzado
- Analytics detallados beyond basic usage
- Mobile app nativa
- CI/CD pipeline (se asume que elContribuidor lo configura)
- Deployment automático

---

## 7. Further Notes

### 7.1 Filosofía del proyecto
Mock3 es un proyecto **open source** destinado a la comunidad de desarrolladores. La experiencia de setup debe ser MÍNIMA: clonar, instalar dependencias, configurar env vars, y ejecutar. No debe requerir infraestructura externa más allá de una DB PostgreSQL local.

### 7.2 Seguridad
- API keys NUNCA se almacenan en texto plano (solo hashes SHA-256)
- Clerk maneja toda la complejidad de auth (JWT, refresh, revocación)
- CORS está configurado por origen, no `*`
- Rate limiting previene abuso de la capa gratuita
- Logging de requests permite debugging y detección de anomalías

### 7.3 Performance
- Índice compuesto `(user_id, timestamp)` en `request_logs` — crítico para rate limiting
- Limpieza de logs cada 28 horas para mantener la DB ligera (elimina registros con más de 28h de antigüedad)
- TanStack Query cache reduces llamadas al backend
- Optimistic updates hacen la UI percibida como instantánea
- Tree-shaking en Lucide y shadcn reduce bundle size

### 7.4 Escalabilidad futura
- La estructura MVC permite migrar a microservicios separando controllers
- El modelo de API keys permite agregar planes Pro con diferentes límites
- Los schemas Zod se reutilizan entre frontend y backend
- La DB está normalizada y lista para agregar tablas (payments, teams, etc.)

### 7.5 Stack tecnológico consolidado

```
┌─────────────────────────────────────────────────────────┐
│              MOCK3 — STACK CONSOLIDADO                   │
├─────────────────────────────────────────────────────────┤
│                                                         │
│  BACKEND:                                               │
│  Node.js v26 + Express.js v5 + Drizzle ORM             │
│  PostgreSQL + Clerk SDK (@clerk/express)                │
│  Arquitectura MVC                                       │
│                                                         │
│  FRONTEND:                                              │
│  React 19 + TypeScript + Vite 6                         │
│  React Router v7+                                       │
│  Zustand (UI state) + TanStack Query v5 (server state)  │
│  React Hook Form + Zod (forms)                          │
│  Axios (HTTP) + Tailwind CSS v4                         │
│  shadcn/ui + Lucide React + CodeMirror 6                │
│  Clerk (<SignIn />, <UserButton />)                     │
│                                                         │
│  SEGURIDAD:                                             │
│  Dashboard → Clerk JWT | Frontend → API Key (SHA-256)   │
│  Rate limiting: 300 req/hora por usuario                │
│  CORS: configurable por origen                          │
│                                                         │
│  FREE TIER:                                             │
│  3 endpoints mock + 300 req/hora                        │
│  Sin plan Pro (paywall visual)                          │
│                                                         │
│  DISEÑO:                                                │
│  Industrial Workspace (VS Code + Postman fusion)        │
│  Dark mode: Cobalt Blue (#007ACC) + Amber Gold (#CCA700)│
│  Tipografía: Inter (UI) + JetBrains Mono (código)       │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

---

*Documento generado como parte de la fase de grill-me y planificación arquitectónica del proyecto Mock3.*
*Todas las decisiones han sido verificadas con documentación actualizada via Context7 MCP.*
