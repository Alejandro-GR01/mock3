<img src="mock3-dashboard/public/logo-mock3.png" alt="Mock3 Logo" width="80">

# Mock3

**Endpoints mock REST instantáneos para desarrollo frontend. Sin instalación local. Sin infraestructura.**

Mock3 es un Micro-SaaS que permite a desarrolladores crear endpoints REST mock accesibles desde
**cualquier frontend, desde cualquier lugar** — apps mobile, dashboards web, pipelines de CI,
smart TVs, lo que se te ocurra. Pensalo como "Mockoon como servicio web" con autenticación por
API key, rate limiting, y un dashboard estilo workspace profesional.

```
Free tier: 3 endpoints mock + 300 requests/hora por usuario
```

---

## Vista Previa

<div align="center">
  <img src="mock3-dashboard/public/screenshots/dashboard.png" alt="Mock3 Dashboard" style="max-width: 500px; width: 100%; height: auto; border-radius: 4px;">
</div>

---

## Indice

- [Descripcion General](#descripcion-general)
- [Vista Previa](#vista-previa)
- [Arquitectura](#arquitectura)
- [Como Empezar](#como-empezar)
  - [Requisitos](#requisitos)
  - [Empezar con Docker Compose (recomendado)](#empezar-con-docker-compose-recomendado)
    - [1. Clonar el Proyecto](#1-clonar-el-proyecto)
    - [2. Configurar las Variables de Entorno (.env)](#2-configurar-las-variables-de-entorno-env)
    - [3. Levantar el Stack](#3-levantar-el-stack)
    - [4. Verificar que Funciona](#4-verificar-que-funciona)
  - [Empezar de Forma Tradicional (sin Docker)](#empezar-de-forma-tradicional-sin-docker)
    - [1. Backend — Paso a Paso](#1-backend--paso-a-paso)
    - [2. Frontend — Paso a Paso](#2-frontend--paso-a-paso)
  - [Produccion (cloud o VPS)](#produccion-cloud-o-vps)
- [Uso del Dashboard](#uso-del-dashboard)
  - [Registrarse e Iniciar Sesion](#1-registrarse-e-iniciar-sesion)
  - [Crear un Endpoint Mock](#2-crear-un-endpoint-mock)
  - [Configurar Respuestas por Metodo](#3-configurar-respuestas-por-metodo)
  - [Generar una API Key](#4-generar-una-api-key)
  - [Copiar la URL del Endpoint](#5-copiar-la-url-del-endpoint)
  - [Gestionar API Keys](#6-gestionar-api-keys)
  - [Panel de Uso](#7-panel-de-uso)
  - [Atajos de Teclado](#8-atajos-de-teclado)
  - [Buscar Mocks](#9-buscar-mocks)
  - [Guide — Documentacion In-App](#10-guide--documentacion-in-app)
  - [Settings — Plan, Perfil y Danger Zone](#11-settings--plan-perfil-y-danger-zone)
- [Como Consumir los Mocks](#como-consumir-los-mocks)
  - [Estructura de la URL](#estructura-de-la-url)
  - [Autenticacion Bearer Token](#autenticacion-api-key-como-bearer-token)
  - [Contrato de Respuesta](#contrato-de-respuesta)
  - [Rate Limiting](#rate-limiting)
  - [Codigos de Error](#codigos-de-error)
- [Ejemplos por Tecnologia](#ejemplos-por-tecnologia)
  - [cURL](#curl)
  - [JavaScript / TypeScript (fetch)](#javascript--typescript-fetch)
  - [Axios](#axios)
  - [React](#react)
  - [Vue](#vue)
  - [Angular](#angular)
  - [Swift (iOS)](#swift-ios)
  - [Kotlin (Android)](#kotlin-android)
  - [Python](#python)
  - [Go](#go)
- [Seguridad](#seguridad)
- [Stack Tecnologico](#stack-tecnologico)
- [Estructura del Proyecto](#estructura-del-proyecto)
  - [Backend — Express MVC](#backend--express-mvc)
  - [Frontend Dashboard — React SPA](#frontend-dashboard--react-spa)
- [Arquitectura de Autenticacion — Dos Capas](#arquitectura-de-autenticacion--dos-capas)
- [API Reference](#api-reference)
  - [Endpoints del Dashboard (Clerk JWT)](#endpoints-del-dashboard-clerk-jwt)
  - [Endpoints Mock Publicos (API Key)](#endpoints-mock-publicos-api-key)
- [Licencia](#licencia)

---

## Descripcion General

Mock3 resuelve un problema simple: **todo desarrollador frontend necesita datos falsos para
desarrollar**. En vez de tener Mockoon corriendo localmente, levantart un JSON Server, o hardcodear
datos de prueba que terminan en produccion, Mock3 te da:

| Feature                    | Que significa                                                      |
| -------------------------- | ------------------------------------------------------------------ |
| **Endpoints instantaneos** | Crea un mock, obtenes una URL. Te toma 30 segundos.                |
| **Auth por API key**       | `Authorization: Bearer m3_live_xxxxx` — estandar de la industria   |
| **Respuestas por metodo**  | Configura JSON distinto + status por GET, POST, PUT, DELETE, PATCH |
| **Status codes custom**    | Cualquier HTTP status: 200, 201, 404, 500, lo que necesites        |
| **300 req/hora free**      | Ventana deslizante, compartidas entre todas tus API keys           |
| **CORS abierto**           | `Access-Control-Allow-Origin: *` en todos los endpoints mock       |
| **Framework-agnostico**    | Funciona con CUALQUIER lenguaje o plataforma que haga HTTP         |

Mock3 arranca como **v0.0.0** enfocado 100% en adquisicion de usuarios y validacion del core loop.
Sin planes de pago funcionales — solo paywall visual como estrategia de conversion futura.

---

## Arquitectura

El proyecto se divide en **dos aplicaciones independientes**:

```
mock3-backend/     → Express MVC backend (Node.js v26 + ESM)
mock3-dashboard/   → React 19 SPA (Vite 6 + shadcn/ui)
```

El backend expone dos caras completamente distintas:

```
┌──────────────────────────────────────────────────────────────┐
│                     Mock3 Backend                              │
│  (Node.js + Express + PostgreSQL + Drizzle ORM)                │
│                                                               │
│  Dashboard API (Clerk JWT)      Mock Endpoint (API Key)       │
│  ┌──────────────────────┐   ┌────────────────────────────┐    │
│  │ /api/mocks/*         │  │ /mocks/{*path}             │    │
│  │ /api/api-keys/*      │   │ Authorization: Bearer      │    │
│  │ /api/usage/*         │   │ CORS: *                    │    │
│  │ CORS: restringido    │  │ Rate limited: 300/h        │    │
│  └──────────────────────┘   └────────────────────────────┘    │
└──────────────────────────────────────────────────────────────┘
         ↕ Clerk JWT                        ↕ API Key
    ┌──────────────────┐          Tu frontend (cualquier tecnologia)
    │   Dashboard      │          ┌──────────────────────────────┐
    │   (React SPA)    │          │ React / Vue / Angular        │
    └──────────────────┘          │ Swift / Kotlin / Go          │
                                  │ cURL / Python / lo que sea   │
                                  └──────────────────────────────┘
```

**Las dos capas de autenticacion JAMAS se mezclan.** Los endpoints del dashboard no aceptan
API keys, y los endpoints mock no aceptan JWTs de Clerk. Esta separacion es fundamental para
la seguridad del sistema.

---

## Como Empezar

### Requisitos

| Herramienta                 | Version              | Notas                                                                                    |
| --------------------------- | -------------------- | ---------------------------------------------------------------------------------------- |
| **Docker + Docker Compose** | `>= 24` / Compose v2 | **Metodo recomendado** — levanta todo el stack (DB + backend + frontend) en contenedores |
| Node.js                     | `>= v22`             | Solo para desarrollo sin Docker                                                          |
| pnpm                        | `>= 9`               | Solo para desarrollo sin Docker (ambos proyectos usan pnpm, NO npm)                      |
| PostgreSQL                  | `>= 15`              | Solo para desarrollo sin Docker                                                          |

> **Recomendado:** Docker Compose. No necesitas Node, pnpm ni PostgreSQL instalados localmente —
> todo corre en contenedores. El unico requisito externo es una cuenta de Clerk.

> **⚠️ Dependencia de internet:** El stack corre **100% en tu maquina**, pero la autenticacion
> usa **Clerk**, que es un servicio SaaS en la nube. Esto significa que para **registrarte e
> iniciar sesion** en el dashboard necesitas conexion a internet. Todo lo demas (crear mocks,
> API keys, consumo de endpoints, base de datos) funciona localmente sin problema — el unico
> punto que toca la nube es el login de Clerk.

---

### Empezar con Docker Compose (recomendado)

#### 1. Clonar el Proyecto

```bash
git clone https://github.com/Alejandro-GR01/mock3.git
cd mock3
```

#### 2. Configurar las Variables de Entorno (.env)

Crea el archivo `.env` en la **raiz del repo** (ya esta en `.gitignore`, no se commitea).
Este es el UNICO archivo que necesitas configurar para el stack completo:

```env
# PostgreSQL (valores por defecto — podes cambiarlos)
POSTGRES_USER=mock3_user
POSTGRES_PASSWORD=mock3_pass
POSTGRES_DB=mock3_db

# Clerk authentication — obtenelas de https://dashboard.clerk.com
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx

# URL del frontend (para CORS del backend — debe coincidir con el puerto del compose)
FRONTEND_URL=http://localhost:8080

# URL base que se inyecta en el frontend (build-time) y se muestra en las tarjetas de mock
VITE_API_URL=http://localhost:8080

# Puerto interno del backend dentro de la red Docker (default 3001).
# Si lo cambias, tambien actualiza `proxy_pass http://backend:<PORT>` en
# mock3-dashboard/nginx.conf (2 lugares). No confundir con el puerto externo
# del frontend (8080), que se configura en el `ports: "8080:80"` del compose.
# PORT=3001
```

> **Tip:** el `PORT` solo importa si tenes un conflicto con otro proceso en tu host.
> El default `3001` no se expone al host (es interno a Docker), asi que en el 99% de
> los casos no necesitas tocarlo. La plataforma cloud lo asigna automaticamente
> en deploy separado.

> **Clerk keys — ruta paso a paso:**
>
> 1. Anda a **https://dashboard.clerk.com** y registrate (o inicia sesion)
> 2. Toca **"Add application"** → ponele un nombre (ej: `mock3`) → **Create application**
> 3. En el panel izquierdo anda a **"API Keys"** (o "Developers → API Keys")
> 4. Copia `CLERK_PUBLISHABLE_KEY` (empieza con `pk_test_` o `pk_live_`) y `CLERK_SECRET_KEY`
>    (empieza con `sk_test_` o `sk_live_`) → pegalas en tu `.env`
>
> ⚠️ La `CLERK_SECRET_KEY` es un secreto — nunca la compartas, no la commitees ni la pegues
> en chats. Si alguna vez se filtra, regenerala desde el dashboard de Clerk.

> **¿Por que solo estas variables?** En local los 3 servicios comparten la **red interna de
> Docker**: el backend se conecta a la DB por el nombre del servicio (`db:5432`) y el frontend
> habla con el backend via el proxy de Nginx. Por eso NO necesitas `DATABASE_URL` ni URLs
> publicas — el `docker-compose.yml` ya las resuelve solo.

#### 3. Levantar el Stack

```bash
docker compose up --build
```

El primer arranque construye las imagenes (puede tardar unos minutos) y luego:

1. Arranca **PostgreSQL** con las tablas ya creadas (`drizzle-kit push` automatico)
2. Arranca el **backend** en la red interna
3. Arranca el **frontend** (Nginx) expuesto en `:8080`

**Imagenes oficiales de Docker:** el stack usa exclusivamente imagenes oficiales y verificadas:

| Imagen               | Uso                                                                       |
| -------------------- | ------------------------------------------------------------------------- |
| `postgres:16-alpine` | Base de datos (imagen oficial de PostgreSQL)                              |
| `node:22-alpine`     | Build + runtime del backend y build del frontend (imagen oficial de Node) |
| `nginx:1.27-alpine`  | Servidor web del frontend (imagen oficial de Nginx)                       |

No hay imagenes de terceros ni repositorios no oficiales — todo sale de Docker Hub (libreria
oficial), lo que garantiza que el stack es reproducible y sin sorpresas.

#### 4. Verificar que Funciona

| Servicio                 | URL                                              |
| ------------------------ | ------------------------------------------------ |
| **Dashboard (frontend)** | http://localhost:8080                            |
| **Health check**         | http://localhost:8080/api/health (via proxy)     |
| **Backend API**          | Solo red interna de Docker (no expuesto al host) |
| **PostgreSQL**           | Solo red interna de Docker (no expuesto al host) |

```bash
curl http://localhost:8080/api/health
# Esperado: {"status":"ok","database":"connected",...}
```

Comportamiento del stack:

- El frontend (Nginx) sirve el SPA y **proxea** `/api/*` y `/mocks/*` al backend por la red
  interna de Docker — mismo-origen, sin problemas de CORS. El browser solo ve `:8080`; el
  backend y la DB no exponen puertos al host.
- Los datos persisten en el volumen `pgdata` — reiniciar el stack NO borra la base.
- Detener: `Ctrl+C` (o `docker compose down`). Para borrar TODO (incluida la base):
  `docker compose down -v`.

> **Ojo:** los cambios en `mock3-backend/src/` requieren rebuild: `docker compose up -d --build backend`.

---

### Empezar de Forma Tradicional (sin Docker)

Para desarrollo con hot reload (Vite) y control manual de cada proceso. Requiere Node.js >= v22,
pnpm >= 9 y PostgreSQL >= 15 instalados localmente. Cada proyecto tiene su propio `.env`.

#### 1. Backend — Paso a Paso

**Variables de entorno (`mock3-backend/.env`):**

```env
# Conexion a PostgreSQL
DATABASE_URL=postgresql://user:password@localhost:5432/mock3

# Clerk authentication — obtenelas de https://dashboard.clerk.com
# (misma ruta que en la seccion de Docker Compose arriba)
CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_test_xxxxxxxxxxxx

# URL del frontend (para CORS)
FRONTEND_URL=http://localhost:5173

# Puerto del servidor
PORT=3001
```

> **Clerk keys:** si aun no las tenes, anda a **https://dashboard.clerk.com** → "Add application" →
> "API Keys" → copia `CLERK_PUBLISHABLE_KEY` y `CLERK_SECRET_KEY`. La `CLERK_SECRET_KEY`
> es sensible — nunca la compartas ni la commitees.

**Instalacion, migracion y arranque:**

```bash
cd mock3-backend
pnpm install

pnpm run db:migrate    # Aplica migrations (crea las tablas)

pnpm run build         # Compila TypeScript → dist/
node dist/app.js       # (NO uses tsx — tiene que ser JS compilado)
```

> **Importante:** El backend corre desde `dist/`, NO desde `src/`. Cada vez que cambies archivos
> en `mock3-backend/src/`, tenes que ejecutar `pnpm run build` y reiniciar `node dist/app.js`.
> Este es un punto de confusion recurrente — no te olvides.

#### 2. Frontend — Paso a Paso

**Variables de entorno (`mock3-dashboard/.env`):**

```env
# URL base del backend (usada por Axios + display de URLs mock)
VITE_API_URL=http://localhost:3001

# Clerk publishable key
VITE_CLERK_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxx
```

> **Ojo:** `VITE_API_URL` controla TANTO el `baseURL` de Axios para llamadas al dashboard
> COMO la URL base que se muestra en las tarjetas de mock para copiar endpoints. Es una variable
> **build-time** (Vite la inyecta via `import.meta.env`) — si la cambias, tenes que reiniciar
> el Vite dev server.

**Instalacion y arranque (en otra terminal):**

```bash
cd mock3-dashboard
pnpm install
pnpm run dev           # Vite dev server → http://localhost:5173
```

### Produccion (cloud o VPS)

> **⚠️ En produccion TODO cambia:** los servicios ya NO comparten una red Docker local, cada uno
> corre en su propio servidor/plataforma. Por eso en el `.env` de produccion SI hay que
> configurar las variables que en local se resuelven solas.

**Diferencias clave vs local:**

| Aspecto         | Local (Docker Compose)                          | Produccion                                                                                         |
| --------------- | ----------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| Red             | Los 3 servicios comparten la red interna Docker | Cada servicio tiene su propia URL/IP publica                                                       |
| `DATABASE_URL`  | NO se configura — compose la arma (`db:5432`)   | **OBLIGATORIA** — cadena de conexion a tu DB remota (ej: `postgresql://user:pass@host:5432/mock3`) |
| `FRONTEND_URL`  | Solo si accedes desde otro dispositivo          | **OBLIGATORIA** — la URL publica del dashboard (para CORS estricto)                                |
| `VITE_API_URL`  | `http://localhost:8080` (build-time, default)   | **OBLIGATORIA** — URL publica del backend, inyectada al build del frontend                         |
| Puerto expuesto | Solo `:8080` (frontend)                         | Todos los servicios expuestos con HTTPS                                                            |

**Variables requeridas en produccion (`.env` del deploy):**

```env
# Backend
DATABASE_URL=postgresql://usuario:password@host-remoto:5432/mock3   # tu DB en la nube
FRONTEND_URL=https://dashboard.tu-dominio.com                        # para CORS estricto
CLERK_PUBLISHABLE_KEY=pk_live_xxxxxxxxxxxx
CLERK_SECRET_KEY=sk_live_xxxxxxxxxxxx

# Frontend (build-time)
VITE_API_URL=https://api.tu-dominio.com                             # URL publica del backend
```

**Pasos de despliegue:**

1. **Base de datos:** crea una PostgreSQL remota (Render, Neon, Supabase) y copia su connection string
2. **Backend:** deploya `mock3-backend/` (Dockerfile incluido) con las env vars de arriba
3. **Frontend:** build con `VITE_API_URL` apuntando al backend publico, sirve los estaticos (Nginx/CDN)
4. **CORS:** el backend solo acepta origins iguales a `FRONTEND_URL` — debe coincidir EXACTO con la URL del dashboard
5. **HTTPS:** todo por TLS (termina en el proxy/CDN, nunca HTTP plano)

> **Nota sobre keepalive:** al abandonar el cloud (Back4app destruia el contenedor por expiracion
> del custom domain), el proyecto corrio en local. Si volves a produccion, evalua una plataforma
> sin free tier destructivo — la investigacion previa concluyo que **Render** es la mejor opcion
> (URL estable, 750h/mes free).

### Modo `--host` (Red Local)

Para exponer el backend a otros dispositivos en la misma red (ej: probar el dashboard desde el celular):

```bash
# Backend con CORS abierto
npm run build && node dist/app.js --host

# Frontend (en otra terminal)
cd ../mock3-dashboard
npm run dev -- --host
```

**CORS behavior:**

| Flag                      | CORS                                                                                      |
| ------------------------- | ----------------------------------------------------------------------------------------- |
| `node dist/app.js`        | Solo permite `FRONTEND_URL` (del `.env`)                                                  |
| `node dist/app.js --host` | Permite `FRONTEND_URL` + **cualquier dominio** que haga request (se agrega dinámicamente) |

Cuando `--host` está activo, el backend loguea los origins agregados:

```
🔓 CORS: modo abierto — cualquier dominio será permitido
🔓 CORS: agregado al whitelist → http://192.168.1.50:5173
```

---

## Uso del Dashboard

### 1. Registrarse e Iniciar Sesion

Navega a la URL del dashboard. Te va a aparecer la pantalla de login de Clerk.

- **OAuth providers:** GitHub, Google
- **Web3 wallet:** MetaMask / Phantom
- **Email + password** (si lo configuraste en Clerk)

En el primer login, tu cuenta se crea automaticamente en el backend — no hay setup manual.
El flujo internamente es:

```
Login → Clerk setea sesion → getToken() → syncUser() → POST /api/auth/sync → isReady
```

> **Tema dark:** los formularios de Clerk usan el tema `dark` de `@clerk/themes` para
> mantener coherencia visual con el resto del dashboard (Industrial Workspace). El card y los
> inputs heredan la paleta oscura de Mock3.

Hasta que `isReady` no sea `true`, las queries de TanStack Query no se disparan. Esto previene
errores 401 por token faltante.

### 2. Crear un Endpoint Mock

1. Anda a **Mocks** en la barra lateral
2. Toca **"New Mock"**
3. Completa los campos:

| Campo       | Descripcion                     | Ejemplo                       |
| ----------- | ------------------------------- | ----------------------------- |
| **Name**    | Identificador visible           | `Product API`                 |
| **Path**    | La ruta URL (sin slash inicial) | `products` o `users/:id`      |
| **Methods** | Que metodos HTTP habilitar      | GET, POST, PUT, DELETE, PATCH |

4. Toca **Create**

Cada mock tiene un identificador interno (slug) generado automaticamente.

> **Limite del free tier:** Podes crear hasta **3 endpoints mock**. Si intentas crear un 4to,
> recibis un 403 con `FREE_TIER_LIMIT_REACHED`.

**Eliminar un mock:** toca el boton de borrar en la tarjeta del mock. La confirmacion usa el
patron **type-to-confirm** (tenes que escribir el nombre exacto del mock). El delete es un
**soft-delete**: el mock desaparece del listado y deja de servirse, pero sus request logs se
conservan para el panel de uso. Los mocks eliminados no ocupan slots del free tier.

### 3. Configurar Respuestas por Metodo

Despues de crear un mock, configura que responde cada metodo HTTP:

```json
{
  "status": 200,
  "headers": {
    "Content-Type": "application/json"
  },
  "body": "{ \"id\": 1, \"name\": \"Sample Product\", \"price\": 29.99 }"
}
```

| Configuracion   | Descripcion                                                      |
| --------------- | ---------------------------------------------------------------- |
| **Status code** | Codigo HTTP de respuesta (200, 201, 404, 500, etc.)              |
| **Headers**     | Headers personalizados (Content-Type, Cache-Control, etc.)       |
| **Body**        | Payload JSON — validado con resaltado de sintaxis via CodeMirror |

Cada metodo (GET, POST, PUT, DELETE, PATCH) tiene su **propia configuracion independiente**.
Podes devolver datos distintos por metodo — el GET puede devolver una lista y el POST puede
devolver el objeto creado, como si fuera una API de verdad.

El editor de JSON usa CodeMirror 6 con syntax highlighting y validacion en tiempo real.

### 4. Generar una API Key

1. Anda a **API Keys** en la barra lateral
2. Toca **"Generate Key"**
3. (Opcional) Ponele un **nombre** para identificar esta key despues (ej: "Local Dev", "CI Pipeline")
4. (Opcional) Configura una **expiracion en horas** (ej: `24` para 24h, `168` para 7 dias)
5. Toca **Generate**

La key se muestra **UNA SOLA VEZ** en un dialogo — copiala inmediatamente. Mock3 guarda
unicamente un hash SHA-256 de tu key, nunca la key en si. Si la perdes, tenes que regenerarla.

```
Key generada:     m3_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
                      ▼
Guardada en DB:  SHA-256(m3_live_a1b2c3...)
```

> **Principio de seguridad:** Tu API key es como una contrasenia. Mock3 NO puede recuperarla —
> solo regenerarla. Guardala en tu password manager o archivo `.env`.

### 5. Copiar la URL del Endpoint

En cada tarjeta de mock del dashboard, la URL completa del endpoint se muestra asi:

```
https://mock3-api.your-domain.com/mocks/products
│                                    │
└────────  Base URL  ────────────────┘└─ path ┘
```

Toca el boton de copia al lado de la URL.

**De esta URL obtenes dos datos:**

1. **Base URL:** `https://mock3-api.your-domain.com` (o `http://localhost:3001`)
2. **Path:** `products` (lo que ingresaste al crear el mock)

Vas a necesitar estos dos datos mas tu **API key** para consumir el endpoint. El slug es interno y ya no forma parte de la URL publica.

### 6. Gestionar API Keys

El listado de API keys muestra cada key con:

- **Nombre** (o "Untitled Key" si no le pusiste nombre)
- **Badge de expiracion** — muestra el estado: "No expiration", "Expires in Xd", "Expires soon",
  o "Expired"
- **Menu de tres puntos** con opciones:

| Accion         | Descripcion                                                       | Proteccion                                                      |
| -------------- | ----------------------------------------------------------------- | --------------------------------------------------------------- |
| **Regenerate** | Revoca la key actual y genera una nueva con el mismo nombre y TTL | Type-to-confirm — tenes que escribir el nombre exacto de la key |
| **Delete**     | Soft-delete (desactiva la key)                                    | Type-to-confirm — mismo patron que regenerate                   |

Las acciones destructivas (Regenerate y Delete) usan el patron **type-to-confirm** de GitHub:
el boton de confirmacion esta deshabilitado hasta que escribas el nombre exacto de la key.
Esto previene clics accidentales que podrian dejar a tu frontend sin acceso.

Despues de regenerar, la key nueva se muestra en un dialogo aparte con boton de copia (mismo
patron que la creacion).

### 7. Panel de Uso

El panel de uso te muestra datos reales (no datos ficticios):

| Metrica                | Descripcion                                     |
| ---------------------- | ----------------------------------------------- |
| **Requests hoy**       | Total de requests en el dia actual              |
| **Requests esta hora** | Requests en la hora actual (ventana deslizante) |
| **Grafico por hora**   | Distribucion de requests en las ultimas horas   |
| **Keys activas**       | Cantidad de API keys activas                    |
| **Mocks creados**      | Cantidad de endpoints mock (con limite de 3)    |

El grafico usa datos reales de la API (`GET /api/usage/hourly`) y se renderiza con las horas
como eje X y el conteo como eje Y.

### 8. Atajos de Teclado

El dashboard tiene atajos de teclado para operar rapido, sin sacar las manos del teclado:

| Atajo              | Accion                                   | Donde aplica      |
| ------------------ | ---------------------------------------- | ----------------- |
| `N`                | Crear un nuevo mock (abre el formulario) | Pagina de Mocks   |
| `/`                | Enfocar la barra de busqueda de mocks    | Pagina de Mocks   |
| `Cmd+K` / `Ctrl+K` | Abrir la **command palette**             | Todo el dashboard |

**Command palette** (`Cmd+K`): menu de comandos con filtro en vivo. Incluye:

| Grupo        | Comandos                             |
| ------------ | ------------------------------------ |
| **Navigate** | Dashboard, Mocks, API Keys, Settings |
| **Actions**  | New Mock (guia al atajo `N`)         |

- Filtro case-insensitive por nombre del comando (ej: escribi `api` y te muestra "API Keys")
- Navegacion con `ArrowUp` / `ArrowDown` (circular — vuelve al primero al pasar el ultimo)
- `Enter` ejecuta el comando seleccionado
- `Esc` cierra el palette

Los atajos se ignoran cuando el foco esta en un input/textarea/select o contenido editable —
asi no se disparan mientras escribis.

### 9. Buscar Mocks

En la pagina de Mocks hay una barra de busqueda por nombre (atajo `/`):

- Filtra los mocks **client-side** por nombre, case-insensitive
- Muestra un contador "Showing X of Y mocks" mientras filtras
- Si no hay coincidencias, muestra "No mocks match your search" en vez de un listado vacio
- El boton `x` en la barra limpia la busqueda al instante

### 10. Guide — Documentacion In-App

El sidebar tiene un item **Guide** que abre una pagina de documentacion integrada con:

- **Quick Start** — 4 pasos para empezar rapido
- **Creating Mocks** — como crear y configurar mocks
- **API Keys** — como generar y usar keys
- **Usage Dashboard** — como interpretar las metricas
- **Keyboard Shortcuts** — tabla completa de atajos
- **Tips** — conseils para sacarle el maximo partido

Todos los textos son **clickeables** — tocar "Mocks" te lleva a la pagina de Mocks, tocar "API Keys" a la de API Keys, etc.

Incluye **capturas de pantalla** de cada seccion del dashboard para referencia visual.

### 11. Settings — Plan, Perfil y Danger Zone

La pagina de **Settings** (barra lateral → Settings) concentra la gestion de cuenta y plan en
una sola vista, con datos reales (nada hardcodeado):

| Seccion         | Que muestra                                                                                          |
| --------------- | ---------------------------------------------------------------------------------------------------- |
| **Profile**     | Avatar con tu foto de Clerk (o tu inicial si no tenes foto), nombre y email                          |
| **Plan**        | Badge de plan (FREE azul, PRO ambar premium) + barras de rate limit (req/hora) y mock slots          |
| **Danger Zone** | Delete account — con confirmacion type-to-confirm (escribi "delete account")                         |

- **Delete account es un hard delete:** elimina el usuario de la DB y su cuenta en Clerk, y el
  `ON DELETE CASCADE` borra TODOS sus mocks, API keys y request logs. No se puede deshacer —
  por eso pide type-to-confirm. Nota: el delete de un mock individual sigue siendo soft-delete
  (conserva los logs), pero el delete de la CUENTA es irreversible y arrastra todo.

- **Datos reales:** el plan, el limite de slots y el rate limit vienen de `GET /api/me` y del
  panel de uso (TanStack Query con refetch cada 30s). El badge muestra el plan REAL, nunca un
  valor fijo.
- **Upgrade to Pro:** abre el paywall modal. En v0.0.0 es visual solamente — no hay cobros, el
  backend no lo hace cumplir.
- **No existe "Reset usage"** — se descarto por diseno: resetear el contador anularia la unica
  proteccion del free tier (300 req/hora). El camino correcto a mas cuota es el plan Pro.

---

## Como Consumir los Mocks

Esta es la funcionalidad principal de Mock3: tu frontend hace requests HTTP al endpoint publico
de Mock3, y Mock3 responde con exactamente el JSON que configuraste.

### Estructura de la URL

```
{mock_base_url}/mocks/{path}
```

| Parte           | Origen                                 | Ejemplo                             |
| --------------- | -------------------------------------- | ----------------------------------- |
| `mock_base_url` | URL del backend (deploy o `.env`)      | `https://mock3-api.your-domain.com` |
| `/mocks/`       | Prefijo fijo — indica un endpoint mock | `/mocks/`                           |
| `{path}`        | Lo que ingresaste en el campo Path     | `products` o `users/123`            |

La URL base de tus mocks es la **misma URL del backend** que usa el dashboard — solo que bajo
el prefijo `/mocks/` en vez de `/api/`.

| Mock Path        | URL Mock Completa                                        |
| ---------------- | -------------------------------------------------------- |
| `products`       | `https://mock3-api.your-domain.com/mocks/products`       |
| `users/:id`      | `https://mock3-api.your-domain.com/mocks/users/42`       |
| (sin path)       | `https://mock3-api.your-domain.com/mocks`                |
| `orders/pending` | `https://mock3-api.your-domain.com/mocks/orders/pending` |

### Autenticacion: API Key como Bearer Token

Toda request a un endpoint mock requiere tu API key en el header `Authorization`:

```
Authorization: Bearer m3_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6
```

> **Por que NO en la URL?** Las credenciales en URLs son un riesgo de seguridad — quedan
> logueadas por servidores, se filtran via headers `Referer`, las cachean proxies, y se guardan
> en el historial del navegador. El header `Authorization` es el estandar de la industria para
> autenticacion de APIs (lo usan Stripe, GitHub, Clerk, y toda API que se respete).

### Contrato de Respuesta

#### Exito (dentro del rate limit)

```json
// HTTP 200 (o el status que configuraste)
// Headers:
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 283
X-RateLimit-Reset: 2026-07-28T15:00:00.000Z
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS, HEAD
Access-Control-Allow-Headers: Content-Type, Authorization

{
  "id": 1,
  "name": "Sample Product",
  "price": 29.99
}
```

El body de respuesta es **exactamente** lo que configuraste en el dashboard. El status code
es **exactamente** el que seteas. Los headers personalizados que configuraste se incluyen.

### Rate Limiting

| Propiedad       | Valor                                              |
| --------------- | -------------------------------------------------- |
| **Limite**      | 300 requests por hora                              |
| **Ventana**     | Deslizante (rolling 1 hour)                        |
| **Alcance**     | Por usuario (compartidas entre todas sus API keys) |
| **Aplica a**    | Solo endpoints mock (`/mocks/*`)                   |
| **NO aplica a** | Endpoints del dashboard (`/api/*`)                 |

> **Que significa "por usuario":** El limite sigue a la **cuenta**, no a cada key. Un usuario
> con 3 API keys tiene 300 req/hora EN TOTAL, repartidos entre las 3 keys. Crear mas keys
> NO aumenta el limite — asi el free tier protege la cuenta completa del abuso.

Cuando el rate limit se excede:

```json
// HTTP 429
X-RateLimit-Limit: 300
X-RateLimit-Remaining: 0

{
  "error": "RATE_LIMIT_EXCEEDED",
  "message": "Rate limit exceeded. Please try again later."
}
```

La ventana deslizante significa que el reset es continuo — a medida que las requests viejas
salen de la ventana de 1 hora, el contador baja. No hay una hora fija de reset.

La decision de no incluir `retryAfter` dinamico es intencional: con sliding window, el tiempo
de reset cambia constantemente y genera UX confusa. El dashboard de uso es el lugar diseñado
para monitorear tu consumo.

### Codigos de Error

| Codigo HTTP | Error Code                | Significado                                       | Solucion                                               |
| ----------- | ------------------------- | ------------------------------------------------- | ------------------------------------------------------ |
| **401**     | `MISSING_API_KEY`         | Falta el header `Authorization`                   | Inclui `Authorization: Bearer m3_live_xxx`             |
| **401**     | `INVALID_API_KEY`         | API key invalida o expirada                       | Verifica que la key sea correcta y no haya expirado    |
| **403**     | `FREE_TIER_LIMIT_REACHED` | Limite del plan free (3 mocks) alcanzado          | Elimina un mock existente o upgrade (proximamente)     |
| **404**     | `MOCK_NOT_FOUND`          | No se encontro un mock                            | Verifica la URL y la API key                           |
| **405**     | `METHOD_NOT_ALLOWED`      | El metodo HTTP no esta configurado para este mock | Habilita el metodo en el dashboard                     |
| **409**     | `MOCK_DELETED`            | El mock existe pero fue desactivado (soft-delete) | Volve a crearlo — no se puede editar un mock eliminado |
| **429**     | `RATE_LIMIT_EXCEEDED`     | Superaste las 300 requests/hora                   | Espera a que la ventana deslizante se resetee          |
| **500**     | —                         | Error interno del servidor                        | Contacta al equipo o revisa los logs                   |

Formato de error (consistente en toda la API):

```json
{
  "error": "MISSING_API_KEY",
  "message": "Authorization header is required"
}
```

---

## Ejemplos por Tecnologia

Los endpoints mock de Mock3 son solo APIs HTTP — funcionan con **cualquier** tecnologia que
pueda hacer requests HTTP. Aca tenes ejemplos en varios lenguajes y frameworks, todos usando
el mismo patron de URL + API key.

> Todos los ejemplos usan estos valores — reemplazalos con los tuyos:
>
> - **Base URL:** `https://mock3-api.your-domain.com`
> - **Path:** `products`
> - **API Key:** `m3_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

### cURL

```bash
curl https://mock3-api.your-domain.com/mocks/products \
  -H "Authorization: Bearer m3_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"
```

O extract tus variables:

```bash
export MOCK3_BASE="https://mock3-api.your-domain.com"
export MOCK3_KEY="m3_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6"

curl "${MOCK3_BASE}/mocks/products" \
  -H "Authorization: Bearer ${MOCK3_KEY}"
```

### JavaScript / TypeScript (fetch)

```javascript
const MOCK3_BASE = "https://mock3-api.your-domain.com";
const API_KEY = "m3_live_a1b2c3d4e5f6...";

const response = await fetch(`${MOCK3_BASE}/mocks/products`, {
  method: "GET", // o POST, PUT, DELETE
  headers: {
    Authorization: `Bearer ${API_KEY}`,
    "Content-Type": "application/json",
  },
});

if (!response.ok) {
  const error = await response.json();
  console.error(`Mock3 Error [${error.error}]: ${error.message}`);
  return;
}

const data = await response.json();
console.log(data);
```

### Axios

```javascript
import axios from "axios";

const MOCK3_BASE = "https://mock3-api.your-domain.com";
const API_KEY = "m3_live_a1b2c3d4e5f6...";

// Opcion 1: Header por request
const response = await axios.get(`${MOCK3_BASE}/mocks/products`, {
  headers: { Authorization: `Bearer ${API_KEY}` },
});

// Opcion 2: Instancia dedicada
const mock3Api = axios.create({
  baseURL: MOCK3_BASE,
  headers: { Authorization: `Bearer ${API_KEY}` },
});

const response = await mock3Api.get("/mocks/products");
```

### React

```tsx
// hooks/useProducts.ts
const MOCK3_BASE = import.meta.env.VITE_MOCK3_BASE_URL;
const MOCK3_KEY = import.meta.env.VITE_MOCK3_API_KEY;

export function useProducts() {
  // v5: isLoading fue renombrado a isPending (isLoading = isPending && isFetching)
  const { data, isPending, error } = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const res = await fetch(`${MOCK3_BASE}/mocks/products`, {
        headers: { Authorization: `Bearer ${MOCK3_KEY}` },
      });
      if (!res.ok) throw new Error(await res.json().then((e) => e.message));
      return res.json();
    },
  });

  return { products: data, isPending, error };
}
```

> **Tip:** Guarda `MOCK3_BASE` y `MOCK3_KEY` en tu `.env` (Vite: `VITE_MOCK3_BASE_URL`,
> `VITE_MOCK3_API_KEY`).

### Vue

```vue
<script setup>
import { createFetch } from "@vueuse/core";

// Instancia pre-configurada con base URL + API key (patrón recomendado por VueUse
// para APIs con auth: los headers van en beforeFetch, no como opción de useFetch)
const useMock3 = createFetch({
  baseUrl: import.meta.env.VITE_MOCK3_BASE_URL,
  options: {
    beforeFetch({ options }) {
      options.headers = {
        ...options.headers,
        Authorization: `Bearer ${import.meta.env.VITE_MOCK3_API_KEY}`,
      };
      return { options };
    },
  },
});

const { data: products, error } = await useMock3("/mocks/products");
</script>
```

### Angular

```typescript
// service/products.service.ts
import { HttpClient, HttpHeaders } from "@angular/common/http";

@Injectable({ providedIn: "root" })
export class ProductsService {
  private baseUrl = environment.mock3BaseUrl;
  private apiKey = environment.mock3ApiKey;
  private headers = new HttpHeaders().set(
    "Authorization",
    `Bearer ${this.apiKey}`,
  );

  constructor(private http: HttpClient) {}

  getProducts() {
    return this.http.get(`${this.baseUrl}/mocks/products`, {
      headers: this.headers,
    });
  }
}
```

### Swift (iOS)

```swift
import Foundation

let baseURL = "https://mock3-api.your-domain.com"
let apiKey = "m3_live_a1b2c3d4e5f6..."

guard let url = URL(string: "\(baseURL)/mocks/products") else {
  fatalError("Invalid URL")
}

var request = URLRequest(url: url)
request.setValue("Bearer \(apiKey)", forHTTPHeaderField: "Authorization")

URLSession.shared.dataTask(with: request) { data, response, error in
  guard let data = data,
        let json = try? JSONSerialization.jsonObject(with: data) else {
    return
  }
  print(json)
}.resume()
```

### Kotlin (Android)

```kotlin
// OkHttp example
import okhttp3.*

val client = OkHttpClient()

val request = Request.Builder()
    .url("https://mock3-api.your-domain.com/mocks/products")
    .header("Authorization", "Bearer m3_live_a1b2c3d4e5f6...")
    .build()

client.newCall(request).enqueue(object : Callback {
    override fun onResponse(call: Call, response: Response) {
        val body = response.body?.string()
        println(body)
    }

    override fun onFailure(call: Call, e: IOException) {
        e.printStackTrace()
    }
})
```

### Python

```python
import requests

MOCK3_BASE = "https://mock3-api.your-domain.com"
API_KEY = "m3_live_a1b2c3d4e5f6..."

headers = {"Authorization": f"Bearer {API_KEY}"}
response = requests.get(f"{MOCK3_BASE}/mocks/products", headers=headers)

if response.status_code == 429:
    print("Rate limited! Check usage dashboard.")
elif response.status_code == 401:
    print("Invalid API key.")
elif response.status_code == 404:
    print("Mock not found.")
else:
    data = response.json()
    print(data)
```

### Go

```go
package main

import (
    "fmt"
    "io"
    "net/http"
)

func main() {
    baseURL := "https://mock3-api.your-domain.com"
    apiKey := "m3_live_a1b2c3d4e5f6..."

    req, _ := http.NewRequest("GET", baseURL + "/mocks/products", nil)
    req.Header.Set("Authorization", "Bearer " + apiKey)

    client := &http.Client{}
    resp, err := client.Do(req)
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    body, _ := io.ReadAll(resp.Body)
    fmt.Println(string(body))
}
```

---

## Seguridad

### API Keys

- **Nunca en texto plano:** Las API keys se almacenan exclusivamente como hash SHA-256 en la
  base de datos. Ni siquiera el sistema puede recuperar la key original.
- **Single-use display:** La key se muestra **UNA SOLA VEZ** al crearse. Si la perdes, tenes
  que regenerarla.
- **Expira opcional:** Podes configurar un TTL en horas para que las keys se autodestruyan
  despues de cierto tiempo.
- **Prefijo identificador:** Solo se guarda el prefijo (`m3_live_a1b2c3d4...`) para que puedas
  identificar tus keys en el listado sin exponer la key completa.
- **Type-to-confirm:** Las acciones destructivas (regenerar, eliminar) requieren que escribas
  el nombre exacto de la key para confirmar.

### Dos Capas de Autenticacion

```
Capa 1 — Dashboard (Clerk JWT):
  Browser → Clerk SignIn → getToken() → Axios interceptor → clerkMiddleware()
  → req.userId = "user_3H9Heq..." (Clerk ID)

Capa 2 — Mock Endpoint (API Key):
  Tu frontend → fetch() con Bearer API key → apiKeyAuth() → SHA-256 → DB lookup
  → req.userId = "550e8400-e29b-..." (UUID local)
```

Estos flujos JAMAS se cruzan. Los endpoints del dashboard no aceptan API keys, los endpoints
mock no aceptan Clerk JWTs.

### Resolucion de Clerk ID

Cuando el middleware de Clerk setea `req.userId`, lo hace con el ID de Clerk (`user_xxx`).
Pero la base de datos usa UUIDs. Cada servicio es responsable de resolver ese ID al UUID local
antes de hacer operaciones en DB. `apiKeyAuth` ya setea el UUID directamente porque hace un
lookup en DB.

### CORS

| Contexto           | Comportamiento                                                  |
| ------------------ | --------------------------------------------------------------- |
| **Dashboard**      | Mismo-origen, `credentials: include`                            |
| **Endpoints mock** | Cross-origin, `Access-Control-Allow-Origin: *`, sin credentials |

### Protecciones Adicionales

- **Rate limiting** por usuario previene abuso del free tier
- **Soft-delete** en API keys (isActive=false) permite auditoria
- **Soft-delete** en mocks (isActive=false) — conserva los `request_logs` historicos para que el
  panel de uso no pierda datos. Los mocks desactivados no se listan ni se sirven, y no pueden
  editarse (409 `MOCK_DELETED`)
- **Errores genericos** en auth 401 — no se filtra si la key es invalida o expirada
- **`CLERK_SECRET_KEY`** nunca debe compartirse en texto plano. Si se expone, regenerar
  inmediatamente desde el dashboard de Clerk.

---

## Stack Tecnologico

### Backend

| Tecnologia  | Version          | Proposito                                        |
| ----------- | ---------------- | ------------------------------------------------ |
| Node.js     | v26              | Runtime (ESM nativo)                             |
| Express.js  | v5               | Framework HTTP                                   |
| Drizzle ORM | latest           | ORM para PostgreSQL (ESM-native, type-safe)      |
| PostgreSQL  | >= 15            | Base de datos                                    |
| Clerk       | `@clerk/express` | Autenticacion (JWT, OAuth, Web3)                 |
| Zod         | latest           | Validacion de schemas (compartidos con frontend) |
| Vitest      | latest           | Testing                                          |
| nanoid      | latest           | Generacion de slugs                              |

### Frontend Dashboard

| Tecnologia      | Version        | Proposito                           |
| --------------- | -------------- | ----------------------------------- |
| React           | 19             | UI framework                        |
| TypeScript      | 5.x            | Type safety                         |
| Vite            | 6              | Bundler / dev server                |
| React Router    | v7+            | Routing client-side                 |
| TanStack Query  | v5             | Server state + optimistic updates   |
| Zustand         | latest         | UI state management                 |
| React Hook Form | latest         | Formularios con validacion Zod      |
| shadcn/ui       | latest         | Component library (New York style)  |
| Tailwind CSS    | v4             | CSS utility-first                   |
| Clerk           | `@clerk/react` | Autenticacion UI                    |
| @clerk/themes   | ^2.4.57        | Tema dark prebuilt para Clerk forms |
| CodeMirror      | 6              | Editor JSON con syntax highlighting |
| Axios           | latest         | HTTP client con interceptores       |
| Lucide React    | latest         | Iconos (tree-shakeable)             |
| Vitest + RTL    | latest         | Testing                             |

### Deployment

| Servicio           | Plan  | Proposito                                                       |
| ------------------ | ----- | --------------------------------------------------------------- |
| **Docker Compose** | Local | Stack completo: PostgreSQL + backend + frontend en contenedores |
| **Clerk**          | Free  | Authentication (10k MAU)                                        |

**Costo total: $0/mes** — todo corre en tu maquina.

> **Historico:** En v0.0.0 el stack corria en la nube (Back4app backend + Vercel frontend + Supabase
> DB). El free tier de Back4app **destruye el contenedor** cuando el custom domain expira
> (logs: `DEPLOYMENT DESTROYED`), dejando el backend inaccesible. Por eso el proyecto migro a
> Docker Compose local. Si en el futuro se necesita hosting cloud, la investigacion previa
> concluyo que **Render** es la mejor opcion: URL estable,
> 750 horas/mes free, sin destruccion automatica.

#### Gotchas de Deployment

| Gotcha                                                    | Solucion                                                                                                                        |
| --------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| **Backend corre desde `dist/`, no `src/`**                | Todo cambio en `mock3-backend/src/` requiere `pnpm run build` + restart (o rebuild del contenedor)                              |
| **`drizzle-kit push` necesita los archivos en la imagen** | El Dockerfile copia `drizzle.config.ts` y `src/db/schema.ts` a la stage de produccion — si se quitan, el push falla al arrancar |
| **Vite env vars son build-time**                          | Cambiar `VITE_API_URL` o `VITE_CLERK_PUBLISHABLE_KEY` requiere rebuild de la imagen frontend                                    |
| **DB no expone puerto al host**                           | La DB corre solo en la red interna Docker — evita el conflicto con un postgres local en puerto 5432                             |
| **`FRONTEND_URL` debe coincidir**                         | `http://localhost:8080` — el CORS del backend solo permite esa origin en modo estricto                                          |

---

## Estructura del Proyecto

```
mock3/
├── docker-compose.yml         # Stack local: db + backend + frontend (metodo recomendado)
├── .env                       # Variables de entorno del compose (gitignored)
├── mock3-backend/              # Express MVC backend
│   ├── Dockerfile             # Multi-stage: build TS → dist + drizzle-kit disponible
│   ├── src/
│   │   ├── app.ts              # Setup de Express, middleware chain
│   │   ├── config/
│   │   │   └── env.ts          # Variables de entorno validadas con Zod
│   │   ├── controllers/
│   │   │   ├── auth.controller.ts     # Sincronizacion de usuario Clerk
│   │   │   ├── user.controller.ts     # GET /api/me (perfil, plan, limites)
│   │   │   ├── mock.controller.ts     # CRUD de mocks + serveMock
│   │   │   ├── apikey.controller.ts   # Generacion y gestion de API keys
│   │   │   └── usage.controller.ts    # Estadisticas de uso
│   │   ├── db/
│   │   │   ├── schema.ts              # Esquema Drizzle (4 tablas)
│   │   │   ├── index.ts               # Conexion PostgreSQL
│   │   │   └── migrations/            # Migraciones Drizzle Kit
│   │   ├── jobs/
│   │   │   └── cleanupLogs.ts         # Limpieza de logs cada 28h
│   │   ├── middlewares/
│   │   │   ├── clerkAuth.ts           # Validacion JWT de Clerk
│   │   │   ├── apiKeyAuth.ts          # Validacion de API key Bearer
│   │   │   ├── rateLimiter.ts         # 300 req/hora sliding window
│   │   │   ├── requestLogger.ts       # Logging a request_logs
│   │   │   ├── requireAuth.ts         # Garantiza req.userId existente
│   │   │   ├── errorHandler.ts        # Manejador global de errores
│   │   │   └── notFound.ts            # Manejador 404
│   │   ├── routes/
│   │   │   ├── index.ts               # Agregador de rutas
│   │   │   ├── auth.routes.ts         # /api/auth/*
│   │   │   ├── mock.routes.ts         # /api/mocks/*
│   │   │   ├── mock-public.routes.ts  # /mocks/* (publico)
│   │   │   ├── apikey.routes.ts       # /api/api-keys/*
│   │   │   ├── usage.routes.ts        # /api/usage/*
│   │   │   └── user.routes.ts         # /api/me
│   │   ├── services/
│   │   │   ├── user.service.ts        # Creacion y busqueda de usuarios
│   │   │   ├── mock.service.ts        # CRUD de mocks + busqueda por path
│   │   │   ├── apikey.service.ts      # Generacion, hash, validacion, expiracion
│   │   │   └── usage.service.ts       # Consultas de estadisticas
│   │   ├── types/
│   │   │   ├── express.d.ts           # Augmentation de Express (req.userId, req.mockId)
│   │   │   └── index.ts               # Tipos compartidos
│   │   ├── utils/
│   │   │   ├── crypto.ts              # SHA-256 para API keys
│   │   │   └── errors.ts              # Clases de error custom
│   │   └── validations/
│   │       ├── auth.schema.ts         # Schemas Zod de auth
│   │       ├── mock.schema.ts         # Schemas Zod de mocks
│   │       └── apikey.schema.ts       # Schemas Zod de API keys
│   ├── package.json
│   ├── tsconfig.json
│   └── drizzle.config.ts
│
├── mock3-dashboard/            # React SPA dashboard
│   ├── Dockerfile             # Multi-stage: Vite build → Nginx
│   ├── nginx.conf             # SPA fallback + proxy /api/ y /mocks/ → backend
│   ├── .dockerignore
│   ├── src/
│   │   ├── App.tsx             # Root: ClerkProvider (tema dark), Router, ErrorBoundary
│   │   ├── main.tsx            # Entry point
│   │   ├── components/
│   │   │   ├── ui/             # shadcn/ui (button, dialog, sidebar, etc.)
│   │   │   ├── command-palette/
│   │   │   │   └── CommandPalette.tsx         # Cmd+K: navegacion + acciones con filtro
│   │   │   ├── settings/
│   │   │   │   ├── ProfileSection.tsx      # Avatar (foto Clerk o inicial) + nombre + email
│   │   │   │   ├── PlanSection.tsx         # Badge plan + rate limits + Upgrade to Pro
│   │   │   │   ├── DangerZoneSection.tsx   # Delete account (type-to-confirm)
│   │   │   │   └── DangerConfirmDialog.tsx # Dialog de confirmacion destructiva
│   │   │   ├── paywall/
│   │   │   │   └── PaywallModal.tsx        # Modal upgrade global (ui.store)
│   │   │   ├── api-keys/
│   │   │   │   ├── ApiKeyCard.tsx               # Tarjeta con nombre, badge, menu
│   │   │   │   ├── ApiKeyGenerateButton.tsx     # Generacion con nombre + TTL
│   │   │   │   ├── ApiKeyList.tsx               # Listado con estados
│   │   │   │   ├── DeleteConfirmDialog.tsx      # Type-to-confirm delete
│   │   │   │   ├── RegenerateConfirmDialog.tsx  # Type-to-confirm regenerate
│   │   │   │   └── RegenerateDisplayDialog.tsx  # Muestra key regenerada
│   │   │   ├── mocks/
│   │   │   │   ├── MockCard.tsx              # Tarjeta con URL + copia
│   │   │   │   ├── MockForm.tsx              # Formulario crear/editar
│   │   │   │   ├── MockList.tsx              # Listado con empty state
│   │   │   │   ├── MockDetail.tsx            # Vista detalle/edicion
│   │   │   │   ├── MethodBadge.tsx           # Badges HTTP color-coded
│   │   │   │   ├── ResponseEditor.tsx        # Editor JSON (CodeMirror)
│   │   │   │   └── DeleteMockConfirmDialog.tsx # Type-to-confirm delete
│   │   │   ├── usage/
│   │   │   │   ├── UsageChart.tsx            # Grafico horario
│   │   │   │   ├── UsageDashboard.tsx        # Contenedor de uso
│   │   │   │   └── UsageStats.tsx            # Tarjetas de estadisticas
│   │   │   ├── layout/
│   │   │   │   ├── AppSidebar.tsx            # Sidebar (shadcn)
│   │   │   │   ├── DashboardLayout.tsx       # Shell del dashboard
│   │   │   │   └── Topbar.tsx                # UserButton + breadcrumbs
│   │   │   └── ErrorBoundary.tsx             # React error boundary
│   │   ├── config/
│   │   │   └── routes.tsx                    # Definiciones de rutas
│   │   ├── hooks/
│   │   │   ├── useAuth.ts                    # Pipeline: token → sync → ready
│   │   │   └── useKeyboardShortcuts.ts       # Atajos N, /, Cmd+K (ignora inputs)
│   │   ├── lib/
│   │   │   ├── utils.ts                      # cn() helper para shadcn
│   │   │   ├── http.ts                       # Axios instance + interceptores
│   │   │   ├── authToken.ts                  # Token storage (function ref)
│   │   │   ├── mockService.ts                # Llamadas API de mocks
│   │   │   ├── apiKeyService.ts              # Llamadas API de keys
│   │   │   ├── usageService.ts              # Llamadas API de uso
│   │   │   └── http-colors.ts                # Constantes de colores HTTP
│   │   ├── api/
│   │   │   ├── useMocks.ts                   # Queries + mutations de mocks
│   │   │   ├── useApiKeys.ts                 # Queries + mutations de API keys
│   │   │   ├── useUsage.ts                   # Queries de uso
│   │   │   └── useMe.ts                      # Queries de perfil (GET /api/me)
│   │   ├── stores/
│   │   │   ├── auth.store.ts                 # Zustand: isReady
│   │   │   └── ui.store.ts                   # Zustand: sidebar, theme
│   │   ├── types/
│   │   │   └── index.ts                      # TypeScript interfaces (sin logica)
│   │   ├── views/
│   │   │   ├── Dashboard.tsx                 # Pagina principal del dashboard
│   │   │   ├── auth/
│   │   │   │   ├── SignInPage.tsx             # Pagina de inicio de sesion (max-w-[400px] centrado)
│   │   │   │   └── SignUpPage.tsx             # Pagina de registro (max-w-[400px] centrado)
│   │   │   ├── mocks/
│   │   │   │   ├── MockList.tsx               # Listado de mocks con busqueda
│   │   │   │   └── MockDetail.tsx             # Detalle/edicion de mock
│   │   │   ├── api-keys/
│   │   │   │   └── ApiKeyList.tsx             # Listado de API keys
│   │   │   ├── guide/
│   │   │   │   └── HowToUse.tsx               # Documentacion in-app con screenshots
│   │   │   ├── usage/
│   │   │   │   └── UsageDashboard.tsx         # Panel de uso
│   │   │   └── settings/
│   │   │       └── Settings.tsx               # Pagina de configuracion
│   │   └── validations/
│   │       └── mock.schema.ts                # Schemas Zod (compartidos)
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
│
├── MOCK3_PRD.md                # Product Requirements Document
├── DESIGN.mock3.md             # Design System Tokens
├── MOCK3_ISSUES.md             # 13 implementation slices
└── README.md                   # Este archivo
```

---

## Arquitectura de Autenticacion — Dos Capas

Mock3 tiene **dos capas de autenticacion completamente independientes** que JAMAS se mezclan:

| Capa              | Quien la usa           | Metodo de auth                                | Rutas protegidas                                  | `req.userId` contiene      |
| ----------------- | ---------------------- | --------------------------------------------- | ------------------------------------------------- | -------------------------- |
| **Dashboard**     | Vos (via browser)      | Clerk JWT (`Authorization: Bearer <jwt>`)     | `/api/mocks/*`, `/api/api-keys/*`, `/api/usage/*` | Clerk user ID (`user_xxx`) |
| **Mock Endpoint** | Tu frontend (via HTTP) | API Key (`Authorization: Bearer m3_live_xxx`) | `/mocks/*`                                        | Local DB UUID              |

### Flujo del Dashboard

```
Browser → Clerk SignIn → getToken() → setAuthToken(fn) → Axios interceptor
  → Authorization: Bearer <jwt> → clerkMiddleware() → Controller
                                                       ↓
                                                req.userId = "user_3H9Heq..."
```

El token se almacena como **referencia a funcion** (`() => getToken()`), no como string fijo.
Esto permite que Clerk refresque el token automaticamente cuando expira (los tokens de desarrollo
de Clerk son de corta duracion ~60s).

### Flujo del Endpoint Mock

```
Tu frontend → fetch() con Authorization: Bearer m3_live_xxx
  → apiKeyAuth middleware:
      1. Extrae Bearer token del header
      2. SHA-256(full token) → comparado con hash almacenado
      3. Si coincide → req.userId = apiKey.userId (UUID local)
  → rateLimiter → cuenta en request_logs
  → serveMock → responde con JSON configurado
  → requestLogger → registra en request_logs (solo si se sirvio)
```

### Como se valida una API Key (Paso a Paso)

```
1. Llega la request con Authorization: Bearer m3_live_abc123...
2. apiKeyAuth extrae "m3_live_abc123..."
3. Se calcula SHA-256: hash = sha256("m3_live_abc123...")
4. Busqueda en DB: SELECT * FROM api_keys WHERE key_hash = hash AND is_active = true
5. Si no se encuentra → 401 UNAUTHORIZED
6. Si se encuentra pero expiro (expires_at <= NOW()) → 401 UNAUTHORIZED
7. Si es valida → req.userId = api_key.userId (UUID local)
8. serveMock verifica que mock.userId === req.userId (ownership check)
9. Responde con el JSON configurado + status code
```

### Frontend Auth Guard

Las queries de TanStack Query estan protegidas por un flag `isReady` de Zustand:

```
Componente monta
  → useMocks() se ejecuta pero enabled=false  ← bloqueado hasta que auth este listo
  → useAuth() useEffect:
      1. getToken() → resuelve
      2. setAuthToken(fn) → almacena referencia a funcion
      3. syncUser() → POST /api/auth/sync → crea usuario en DB
      4. setReady() → isReady = true
  → useMocks() se re-ejecuta con enabled=true
  → http.ts lee el token → GET /api/mocks
```

---

## API Reference

### Endpoints del Dashboard (Clerk JWT)

Todos los endpoints del dashboard requieren autenticacion JWT de Clerk. Montados bajo `/api`.

#### Mocks

| Method   | Endpoint         | Descripcion                                                |
| -------- | ---------------- | ---------------------------------------------------------- |
| `POST`   | `/api/mocks`     | Crear un nuevo endpoint mock                               |
| `GET`    | `/api/mocks`     | Listar todos tus mocks (solo activos)                      |
| `GET`    | `/api/mocks/:id` | Obtener un mock especifico                                 |
| `PUT`    | `/api/mocks/:id` | Actualizar configuracion de un mock                        |
| `DELETE` | `/api/mocks/:id` | Soft-delete (desactiva el mock, conserva los request logs) |

#### API Keys

| Method   | Endpoint                       | Descripcion                         |
| -------- | ------------------------------ | ----------------------------------- |
| `POST`   | `/api/api-keys`                | Generar una nueva API Key           |
| `GET`    | `/api/api-keys`                | Listar tus API Keys                 |
| `POST`   | `/api/api-keys/:id/regenerate` | Regenerar una key (revocar + crear) |
| `DELETE` | `/api/api-keys/:id`            | Eliminar (soft-delete) una API Key  |

#### Usage

| Method | Endpoint             | Descripcion                            |
| ------ | -------------------- | -------------------------------------- |
| `GET`  | `/api/usage`         | Obtener estadisticas generales de uso  |
| `GET`  | `/api/usage/current` | Obtener uso de la hora actual          |
| `GET`  | `/api/usage/hourly`  | Obtener uso por hora (para el grafico) |
| `GET`  | `/api/usage/mocks`   | Obtener ranking de uso por mock        |

#### Usuario

| Method   | Endpoint  | Descripcion                                                                                                                                                                   |
| -------- | --------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `GET`    | `/api/me` | Obtener perfil del usuario + plan + limite de slots (`{ email, plan, maxSlots }`)                                                                                             |
| `DELETE` | `/api/me` | **Delete account** — elimina la cuenta definitivamente: borra el usuario + todos sus mocks, API keys y request logs (hard delete con `ON DELETE CASCADE` en DB) + la cuenta en Clerk |

#### Health

| Method | Endpoint      | Descripcion             |
| ------ | ------------- | ----------------------- |
| `GET`  | `/api/health` | Health check (sin auth) |

### Endpoints Mock Publicos (API Key)

Estos son los endpoints que consume tu frontend. Autenticados via `Authorization: Bearer`.

| Method | Endpoint         | Descripcion       |
| ------ | ---------------- | ----------------- |
| `ANY`  | `/mocks`         | Mock root path    |
| `ANY`  | `/mocks/{*path}` | Mock con sub-path |

Soporta todos los metodos HTTP: `GET`, `POST`, `PUT`, `PATCH`, `DELETE`, `OPTIONS`, `HEAD`.

```
# Ejemplos de requests al mismo mock, diferentes configs:
GET    /mocks/products      → devuelve config de GET
POST   /mocks/products      → devuelve config de POST
PUT    /mocks/products/42   → devuelve config de PUT
DELETE /mocks/products/42   → devuelve config de DELETE
```

---

## Licencia

MIT — usalo, forkеalo, aprendé de él. Mock3 es open source para la comunidad de desarrolladores.
