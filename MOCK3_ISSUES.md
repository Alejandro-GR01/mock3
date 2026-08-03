# MOCK3 — Vertical Slices (Tracer Bullets)
### Desglose de Issues para Implementación
### Generado: 25 de Julio, 2026

---

## Desglose Propuesto

### SLICE 1: Project Scaffolding + DB Connection
- **Type:** AFK
- **Blocked by:** None — can start immediately
- **User stories covered:** N/A (infraestructura base)

**What to build:**
Configurar ambos proyectos (backend y frontend) con toda la infraestructura base:
- Backend: Express v5 + TypeScript + ESM, conexión a PostgreSQL con Drizzle ORM, configuración de variables de entorno con Zod, health check endpoint
- Frontend: Vite 6 + React 19 + TypeScript, Tailwind CSS v4, Clerk provider, estructura de carpetas MVC

**Acceptance criteria:**
- [ ] Backend arranca en `npm run dev` sin errores
- [ ] Frontend arranca en `npm run dev` sin errores
- [ ] PostgreSQL connection OK (query de test exitosa)
- [ ] Health check endpoint responde `200 OK`
- [ ] Variables de entorno validadas con Zod (faltan → error claro)
- [ ] Estructura de carpetas MVC creada en ambos proyectos
- [ ] ESLint + TypeScript strict mode configurados

---

### SLICE 2: Database Schema + Migrations
- **Type:** AFK
- **Blocked by:** Slice 1
- **User stories covered:** N/A (modelo de datos)

**What to build:**
Definir el esquema completo de la base de datos con Drizzle ORM y generar migraciones:
- Tabla `users` (id, clerk_user_id, email, plan, max_slots, created_at)
- Tabla `mocks` (id, user_id, slug, name, path, methods JSONB, is_active, created_at)
- Tabla `api_keys` (id, user_id, key_hash, key_prefix, is_active, expires_at, created_at)
- Tabla `request_logs` (id, user_id, mock_id, method, ip_address, user_agent, timestamp)
- Índice compuesto `(user_id, timestamp)` en `request_logs` — CRÍTICO
- Relaciones FK entre tablas
- Drizzle Kit para generación y ejecución de migraciones

**Acceptance criteria:**
- [ ] 4 tablas creadas en PostgreSQL exitosamente
- [ ] FK constraints funcionales (no se puede insertar mock sin user válido)
- [ ] Índice compuesto `(user_id, timestamp)` creado
- [ ] `drizzle-kit generate` produce migración limpia
- [ ] `drizzle-kit push` aplica cambios a la DB
- [ ] Tipos TypeScript generados automáticamente desde el schema

---

### SLICE 3: Clerk Auth Integration
- **Type:** AFK
- **Blocked by:** Slice 1, 2
- **User stories covered:** 1, 2, 3, 4, 5, 6, 7, 8

**What to build:**
Integrar Clerk para autenticación completa del dashboard:
- Backend: `clerkMiddleware()` configurado, sincronización automática de usuario con tabla `users` al hacer login
- Frontend: `<SignIn />` con GitHub + Google OAuth, `<UserButton />`, protección de rutas privadas
- Middleware de protección de rutas que verifica JWT de Clerk en cada request
- Sync: cuando un usuario hace login por primera vez, se crea su registro en la tabla `users`

**Acceptance criteria:**
- [ ] Login con GitHub OAuth funciona end-to-end
- [ ] Login con Google OAuth funciona end-to-end
- [ ] Al hacer login, se crea registro en tabla `users` con `clerk_user_id`
- [ ] Al hacer login, si ya existe el usuario, NO se duplica
- [ ] Rutas protegidas redirigen a login si no hay sesión
- [ ] `<UserButton />` muestra email del usuario
- [ ] Logout destruye la sesión correctamente
- [ ] Backend rechaza requests sin JWT válido con 401

---

### SLICE 4: Mock CRUD Backend
- **Type:** AFK
- **Blocked by:** Slice 2, 3
- **User stories covered:** 9, 10, 11, 12, 13, 14, 15, 16, 17

**What to build:**
Implementar el CRUD completo de mocks en el backend:
- Controller + Service + Routes para: POST /api/mocks, GET /api/mocks, GET /api/mocks/:id, PUT /api/mocks/:id, DELETE /api/mocks/:id
- Validación con Zod: name requerido, path válido, methods array de enums
- Generación automática de slug único para cada mock
- Free tier limit: verificar que el usuario tenga slots disponibles (max_slots) antes de crear
- Respuesta 403 con `FREE_TIER_LIMIT_REACHED` si no hay slots
- Cada mock almacena su configuración de respuestas por método HTTP en JSONB

**Acceptance criteria:**
- [ ] POST /api/mocks crea un mock y retorna 201 con el mock creado
- [ ] POST /api/mocks falla con 403 si el usuario ya tiene 3 mocks
- [ ] GET /api/mocks retorna solo los mocks del usuario autenticado
- [ ] GET /api/mocks/:id retorna un mock específico (o 404 si no existe)
- [ ] PUT /api/mocks/:id actualiza un mock existente
- [ ] DELETE /api/mocks/:id elimina un mock y retorna 200
- [ ] Slug generado automáticamente es único (nanoid o similar)
- [ ] Validación Zod rechaza requests con campos inválidos
- [ ] Métodos HTTP en JSONB se almacenan con estructura `{ status, headers, body }`

---

### SLICE 5: Mock CRUD Frontend
- **Type:** AFK
- **Blocked by:** Slice 3, 4
- **User stories covered:** 9, 10, 11, 12, 13, 14, 15, 16, 17, 21, 22, 26, 56

**What to build:**
Dashboard completo para gestión de mocks:
- MockList: lista visual de todos los mocks del usuario con cards
- MockForm: formulario de creación/edición con React Hook Form + Zod
- MockEditor: CodeMirror 6 para edición de JSON con syntax highlighting
- MethodBadge: badge coloreado por método HTTP (GET=green, POST=blue, PUT=amber, DELETE=red)
- Optimistic updates con TanStack Query (create, update, delete)
- Toast notifications para success/error
- Empty state cuando no hay mocks
- Contador de slots usados (ej: "2/3 slots")

**Acceptance criteria:**
- [ ] MockList muestra todos los mocks del usuario
- [ ] Crear mock actualiza la lista INMEDIATAMENTE (optimistic)
- [ ] Editar mock actualiza la card en tiempo real
- [ ] Eliminar mock quita la card de la lista al instante
- [ ] Si el servidor falla, la UI revierte al estado anterior
- [ ] CodeMirror editor valida JSON antes de guardar
- [ ] Método HTTP se muestra con color correcto
- [ ] Toast de éxito al crear/editar/eliminar
- [ ] Toast de error si falla la operación
- [ ] Empty state se muestra cuando no hay mocks
- [ ] Contador de slots muestra progreso (0/3, 1/3, 2/3, 3/3)

---

### SLICE 6: API Key Generation + Auth Backend
- **Type:** AFK
- **Blocked by:** Slice 2, 3
- **User stories covered:** 27, 28, 29, 32, 33, 34, 36, 37

**What to build:**
Sistema completo de API keys para autenticación del frontend del usuario:
- Generación de API key: UUID random con prefijo `m3_live_`
- Almacenamiento: SHA-256 hash en DB (nunca texto plano)
- Middleware de autenticación por API key: extrae del header `Authorization: Bearer m3_live_xxxxx`, hashea, busca en DB
- Endpoints protegidos por API key: POST /api/api-keys, GET /api/api-keys, POST /api/api-keys/:id/regenerate
- La key completa se muestra UNA SOLA VEZ después de generarse
- Regeneración: revoca la key anterior, genera nueva

**Acceptance criteria:**
- [ ] POST /api/api-keys genera una nueva key y retorna la key completa UNA vez
- [ ] La key completa tiene formato `m3_live_<random>`
- [ ] En la DB solo se almacena el hash SHA-256 de la key
- [ ] GET /api/api-keys retorna las keys del usuario (solo prefijo, nunca la key completa)
- [ ] POST /api/api-keys/:id/regenerate revoca la anterior y genera nueva
- [ ] Middleware de API key rechaza keys inválidas con 401
- [ ] Middleware de API key rechaza keys revocadas con 401
- [ ] La misma key no se puede generar dos veces

---

### SLICE 7: API Key Management Frontend
- **Type:** AFK
- **Blocked by:** Slice 3, 6
- **User stories covered:** 27, 28, 29, 30, 31, 32

**What to build:**
Interfaz para gestionar API keys:
- ApiKeyList: lista de keys activas con prefijo y fecha de creación
- ApiKeyGenerator: botón para generar nueva key
- Botón de regenerar (revocar + crear nueva) con confirmación
- Botón de copiar al portapapeles (clipboard API)
- Modal de confirmación antes de regenerar
- La key completa se muestra en un toast/dialog UNA SOLA VEZ

**Acceptance criteria:**
- [ ] ApiKeyList muestra keys con prefijo (ej: "m3_live_8f...") y fecha
- [ ] Botón "Generate Key" crea una nueva key
- [ ] Key completa se muestra en un dialog después de generarla
- [ ] Botón "Copy" copia la key al portapapeles
- [ ] Toast confirma "Key copied to clipboard"
- [ ] Botón "Regenerate" muestra confirmación antes de proceder
- [ ] Después de regenerar, la key anterior deja de funcionar
- [ ] No se muestra la key completa en la lista (solo prefijo)

---

### SLICE 8: Public Mock Endpoint
- **Type:** AFK
- **Blocked by:** Slice 4, 6
- **User stories covered:** 33, 34, 35, 36, 37, 38

**What to build:**
El endpoint público que el frontend del usuario consume:
- Ruta dinámica: `* /mocks/{*path}` que matchea cualquier método HTTP
- Autenticación por API key (middleware de Slice 6)
- Busca el mock por path + API key, verifica que pertenece al usuario de la API key
- Retorna la respuesta configurada (status, headers, body) para el método HTTP solicitado
- CORS configurado para permitir requests desde cualquier origen (con API key válida)
- Respuestas de error: 401 (key inválida), 403 (mock no existe o no pertenece al usuario), 404 (mock no encontrado)

**Acceptance criteria:**
- [ ] GET /mocks/products retorna el JSON configurado para GET
- [ ] POST /mocks/products retorna el JSON configurado para POST
- [ ] PUT /mocks/products/:id retorna el JSON configurado para PUT
- [ ] DELETE /mocks/products/:id retorna el JSON configurado para DELETE
- [ ] Request sin API key retorna 401
- [ ] Request con API key inválida retorna 401
- [ ] Request con API key válida pero mock de otro usuario retorna 403
- [ ] Request a mock inexistente retorna 404
- [ ] Headers CORS incluidos en la respuesta
- [ ] Status code configurado por el usuario se respeta exactamente

---

### SLICE 9: Rate Limiting + Request Logging
- **Type:** AFK
- **Blocked by:** Slice 2, 8
- **User stories covered:** 39, 40, 41, 42, 43

**What to build:**
Rate limiting por usuario (compartido entre todas sus API keys) con ventana deslizante:
- Middleware que cuenta requests por usuario en la última hora
- Query: `SELECT COUNT(*) FROM request_logs WHERE user_id = X AND timestamp > NOW() - INTERVAL '1 hour'`
- Si COUNT >= 300 → respuesta 429 con `RATE_LIMIT_EXCEEDED` (sin `retryAfter` — ver spec rate-limiting §Design Decisions)
- Logging: cada request válido se registra en `request_logs`
- Cleanup job: cada 28 horas borra registros con más de 28 horas (buffer de 4h para dashboard 24h)
- Headers de respuesta: `X-RateLimit-Limit: 300`, `X-RateLimit-Remaining: <n>`, `X-RateLimit-Reset: <timestamp>`

**Acceptance criteria:**
- [ ] Primer request de un usuario nuevo cuenta como 1
- [ ] Request #501 en la hora retorna 429
- [ ] Después de 1 hora, el conteo se resetea (ventana deslizante)
- [ ] Headers `X-RateLimit-*` presentes en cada respuesta
- [ ] Request logs se guardan en tabla `request_logs`
- [ ] Cleanup job borra registros viejos (>28 horas)
- [ ] Rate limiting es por usuario (compartido entre todas sus keys), NO por IP ni por key
- [ ] Un usuario con 2 PCs usando la misma key comparte límite

---

### SLICE 10: Usage Dashboard Backend
- **Type:** AFK
- **Blocked by:** Slice 2, 3, 9
- **User stories covered:** 44, 45, 46, 47, 48

**What to build:**
Endpoints de estadísticas de uso:
- GET /api/usage: retorna stats generales (total hoy, remaining, mocks count)
- GET /api/usage/current: retorna uso de la hora actual (count, limit, remaining)
- GET /api/usage/mocks: retorna ranking de mocks más usados
- Queries optimizadas con índices existentes
- Cache de 30 segundos para no sobrecargar la DB

**Acceptance criteria:**
- [ ] GET /api/usage retorna `{ today: N, remaining: M, totalMocks: 3 }`
- [ ] GET /api/usage/current retorna `{ count: 42, limit: 300, remaining: 258, resetAt: "..." }`
- [ ] GET /api/usage/mocks retorna array ordenado por uso descendente
- [ ] Datos son consistentes con la tabla `request_logs`
- [ ] Response time < 100ms con índice adecuado

---

### SLICE 11: Usage Dashboard Frontend
- **Type:** AFK
- **Blocked by:** Slice 3, 10
- **User stories covered:** 44, 45, 46, 47, 48

**What to build:**
Dashboard visual de uso:
- UsageStats: cards con métricas clave (requests hoy, remaining, mocks)
- UsageChart: gráfico de uso por hora (puede ser un chart simple o sparkline)
- MockUsageRanking: tabla de mocks más usados
- Indicador visual de proximidad al límite (amarillo >80%, rojo >95%)
- Auto-refresh cada 30 segundos

**Acceptance criteria:**
- [ ] UsageStats muestra 3 cards: Requests Hoy, Remaining, Mocks Activos
- [ ] Indicador de remaining cambia de color según proximidad al límite
- [ ] MockUsageRanking muestra top 5 mocks por uso
- [ ] Datos se actualizan cada 30 segundos automáticamente
- [ ] Loading states mientras se cargan datos
- [ ] Empty state si no hay datos de uso

---

### SLICE 12: Dashboard Layout + Navigation + Theme
- **Type:** AFK
- **Blocked by:** Slice 1
- **User stories covered:** 49, 50, 51, 52, 53, 54, 55

**What to build:**
Shell del dashboard con navegación y tema visual:
- Layout: sidebar + topbar + content area
- Sidebar: navegación con iconos Lucide (Dashboard, Mocks, API Keys, Usage, Settings)
- Topbar: UserButton de Clerk, breadcrumbs
- React Router v7+ con rutas anidadas
- Dark mode como tema principal (Industrial Workspace palette)
- shadcn/ui configurado con CSS variables de la paleta
- Componentes UI reutilizables: Button, Card, Input, Badge, Dialog, Toast, Sheet
- Responsive: sidebar colapsable en mobile
- Loading spinner global

**Acceptance criteria:**
- [ ] Sidebar muestra 5 items de navegación con iconos
- [ ] Click en un item navega a la ruta correcta
- [ ] Topbar muestra UserButton de Clerk
- [ ] Dark mode activo por defecto
- [ ] Colores coinciden con la paleta Industrial Workspace
- [ ] Tipografía: Inter para UI, JetBrains Mono para código
- [ ] Sidebar colapsable en pantallas < 768px
- [ ] Toast notifications funcionan
- [ ] Rutas protegidas redirigen a /auth

---

### SLICE 13: Paywall Modal + Error Handling
- **Type:** AFK
- **Blocked by:** Slice 4, 5
- **User stories covered:** 57, 58, 59

**What to build:**
Paywall visual y manejo centralizado de errores:
- PaywallModal: se muestra cuando el usuario intenta crear un 4to mock
- Estilo Amber Gold (#CCA700) para indicar premium
- Mensaje: "Upgrade to Pro to create unlimited mocks"
- Mención de wallet connection para upgrade futuro
- Error handler global en backend: todas las respuestas de error siguen formato consistente
- Error handler en frontend: interceptor de Axios que muestra toast de error

**Acceptance criteria:**
- [ ] PaywallModal aparece al intentar crear mock sin slots
- [ ] Modal usa color Amber Gold para elementos premium
- [ ] Botón "Upgrade" está presente (pero no funcional en v0.0.0)
- [ ] Backend retorna errores en formato `{ error: "CODE", message: "..." }`
- [ ] Frontend intercepta errores de Axios y muestra toast
- [ ] Errores 401 redirigen a login
- [ ] Errores 429 muestran "Rate limit exceeded" con retry time

---

## Grafo de Dependencias

```
Slice 1 (Scaffolding)
  ├── Slice 2 (Schema)
  │     ├── Slice 3 (Clerk Auth)
  │     │     ├── Slice 4 (Mock CRUD Backend)
  │     │     │     ├── Slice 5 (Mock CRUD Frontend)
  │     │     │     │     └── Slice 13 (Paywall + Errors)
  │     │     │     └── Slice 8 (Public Mock Endpoint)
  │     │     │           └── Slice 9 (Rate Limiting)
  │     │     │                 └── Slice 10 (Usage Backend)
  │     │     │                       └── Slice 11 (Usage Frontend)
  │     │     ├── Slice 6 (API Key Backend)
  │     │     │     ├── Slice 7 (API Key Frontend)
  │     │     │     └── Slice 8 (Public Mock Endpoint)
  │     │     └── Slice 10 (Usage Backend)
  │     └── Slice 9 (Rate Limiting)
  └── Slice 12 (Layout + Theme)
```

## Orden de Implementación Recomendado

```
FASE 1: Cimientos (Slices 1-2)
  → Scaffolding + Schema + Migrations

FASE 2: Auth (Slice 3)
  → Clerk Integration completa

FASE 3: Core Business (Slices 4-5)
  → Mock CRUD backend + frontend con optimistic updates

FASE 4: API Keys (Slices 6-7)
  → Generación + UI de API keys

FASE 5: Endpoint Público (Slice 8)
  → El mock endpoint que el usuario consume

FASE 6: Protección (Slices 9-10)
  → Rate limiting + Usage backend

FASE 7: Dashboard (Slices 11-12)
  → Layout + Usage dashboard

FASE 8: Polish (Slice 13)
  → Paywall + Error handling
```

---

## Resumen

| Slice | Título | Type | Blocked by | User Stories |
|-------|--------|------|------------|--------------|
| 1 | Project Scaffolding + DB | AFK | None | — |
| 2 | Database Schema + Migrations | AFK | 1 | — |
| 3 | Clerk Auth Integration | AFK | 1, 2 | 1-8 |
| 4 | Mock CRUD Backend | AFK | 2, 3 | 9-17 |
| 5 | Mock CRUD Frontend | AFK | 3, 4 | 9-17, 21, 22, 26, 56 |
| 6 | API Key Backend | AFK | 2, 3 | 27-29, 32-37 |
| 7 | API Key Frontend | AFK | 3, 6 | 27-32 |
| 8 | Public Mock Endpoint | AFK | 4, 6 | 33-38 |
| 9 | Rate Limiting | AFK | 2, 8 | 39-43 |
| 10 | Usage Backend | AFK | 2, 3, 9 | 44-48 |
| 11 | Usage Frontend | AFK | 3, 10 | 44-48 |
| 12 | Layout + Theme | AFK | 1 | 49-55 |
| 13 | Paywall + Errors | AFK | 4, 5 | 57-59 |

**Total: 13 slices | Todas AFK (sin intervención humana requerida)**

---

*Documento generado como parte de la fase de planificación del proyecto Mock3.*
*Cada slice es un tracer bullet que corta por todas las capas (schema → API → UI → tests).*
