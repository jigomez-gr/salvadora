# Centro de Yoga y Bienestar Salvadora Conesa — Portal Web & Reservas

Landing page de alta conversión y sistema de información y reservas para el **Centro de Yoga y Bienestar Salvadora Conesa**. Desarrollada con **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS**, pasarela de pago con **Stripe** e integración directa en tiempo real con el backend de **CRM Salvadora**.

---

## 🌟 Características Principales

1. **Catálogo Dinámico Sincronizado con CRM**:
   - Conexión viva con el endpoint `/api/widget/services` del CRM.
   - Respaldo automático (*fallback catalog*) si la API no estuviera disponible de forma transitoria.
   - Clasificación por categorías con orden de prioridad:
     - `Orden #1`: Longevidad y Artes Psicofísicas
     - `Orden #2`: Clases Regulares de Yoga y Meditación
     - `Orden #3`: Talleres, Retiros y Eventos Especiales
     - `Orden #4`: Salud y Terapias Individuales
2. **Visualizador Dual Vídeo / Flyer con Lightbox Zoom**:
   - Selector interactivo `[🎬 Ver Vídeo]` / `[🖼️ Ver Flyer]` en tarjetas con ambos contenidos (ej. Retiro de Ayuno Terapéutico).
   - Modal Lightbox para ampliar flyers a pantalla completa con un solo clic.
3. **Filtros Avanzados y Navegación Rápida**:
   - Filtro por categoría y por tipo de actividad (Clases Regulares vs Talleres y Retiros).
   - Indicadores de prueba gratuita (*1ª Clase Gratis*), aforo y horarios estructurados.
4. **Captación de Leads y Reservas**:
   - Enlace directo a reservas por WhatsApp contextualizado con el nombre del servicio.
   - Modal de Diagnóstico y Recomendación de Terapias (`SimuladorDiagnosticoModal`).
   - Pasarela de pago Stripe Checkout para talleres y retiros de pago online.
5. **Streaming de Medios Externos Desacoplado**:
   - Endpoint `/videos/[...filename]` para servir vídeos y flyers de gran tamaño desde disco externo sin inflar el repositorio Git.

---

## 🚀 Requisitos Previos para Nueva Máquina

Para ejecutar este proyecto en otro ordenador o servidor:

| Requisito | Versión Recomendada | Notas |
| :--- | :--- | :--- |
| **Node.js** | `>= 20.9.0` (ó `22.x LTS`) | Imprescindible para soporte de Next.js 16 |
| **npm** o **pnpm** | `>= 10.x` | Gestor de paquetes estándar |
| **Git** | Cualquier versión moderna | Control de versiones |
| **Backend CRM** | `crm_salvadora` | En ejecución local (`http://localhost:3001`) o en VPS (`https://crm-salvadoraconesa.jigretera.com`) |

---

## ⚙️ Configuración del Entorno (`.env`)

Copia la plantilla de ejemplo antes de arrancar:

```bash
cp .env.example .env
```

Contenido de las variables principales:

```env
# Conexión al CRM Salvadora (NestJS)
# En local: http://localhost:3001
# En servidor remoto: https://crm-salvadoraconesa.jigretera.com
NEXT_PUBLIC_CRM_API_URL="http://localhost:3001"
NEXT_PUBLIC_DEFAULT_AGENT_KEY="booking"
NEXT_PUBLIC_BUSINESS_NAME="Centro de Yoga y Bienestar Salvadora Conesa"
NEXT_PUBLIC_ENABLE_ANALIZAIA="N"

# Base de datos PostgreSQL (con Prisma)
DATABASE_URL="postgresql://postgres:password@localhost:5432/crm_salvadora"

# Pasarela de Pagos Stripe (Opcional en desarrollo)
STRIPE_PUBLIC_KEY="pk_test_..."
STRIPE_SECRET_KEY="sk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Almacenamiento local de medios pesados (desacoplado de git)
MEDIA_STORAGE_ROOT="d:/tmp/antigraviti/salvadora/media_base"
MEDIA_VIDEOS_DIR="d:/tmp/antigraviti/salvadora/media_base/videos"
MEDIA_DOCUMENTS_DIR="d:/tmp/antigraviti/salvadora/media_base/documentos"
MEDIA_FLYERS_DIR="d:/tmp/antigraviti/salvadora/media_base/flyers"
```

---

## 📦 Instalación y Puesta en Marcha

### 1. Instalar dependencias

```bash
npm install
```

### 2. Generar cliente de Prisma

```bash
npx prisma generate
```

### 3. Modo Desarrollo

```bash
npm run dev
```

La web estará disponible de inmediato en [http://localhost:3000](http://localhost:3000).

### 4. Compilación para Producción

```bash
npm run build
npm run start
```

---

## 📂 Estructura de Rutas y Páginas

- **`/`**: Portada principal del centro, propuesta de valor, testimonios, formulario y acceso a servicios.
- **`/servicios`**: Catálogo completo dinámico sincronizado con el CRM, filtros por categoría, preview de vídeos/flyers y modal de reservas.
- **`/mejorar-asanas`**: Guía formativa y visual para perfeccionar posturas y asanas.
- **`/nagna-yoga`**: Sección especializada dedicada a la práctica de Nagna Yoga.
- **`/reserva/exito`** & **`/reserva/cancelada`**: Pantallas de confirmación y retorno del flujo de Stripe.
- **`/politica-de-privacidad`**, **`/politica-de-cookies`**, **`/ley-de-proteccion-de-datos`**: Páginas legales conformes a RGPD.
- **`/api/crm/services`**: Proxy backend con caché optimizada para consultar los servicios del CRM.
- **`/api/checkout`** & **`/api/stripe/webhook`**: Integración transaccional con Stripe.
- **`/videos/[...filename]`**: Endpoint dinámico de streaming de ficheros multimedia.

---

## 🔄 Cómo Clonar y Adaptar para un Proyecto Similar

Si necesitas crear una web similar para otro cliente (ej. academia, clínica, centro deportivo):

1. **Clonar este repositorio** en la nueva carpeta o máquina.
2. **Personalizar textos y marca**:
   - Ajustar `NEXT_PUBLIC_BUSINESS_NAME` en `.env`.
   - Modificar títulos, logotipo y descripciones en `src/app/layout.tsx` y `src/app/page.tsx`.
   - Adaptar la paleta de colores en `src/app/globals.css`.
3. **Apuntar al backend del nuevo negocio**:
   - Actualizar `NEXT_PUBLIC_CRM_API_URL` hacia la URL del CRM del nuevo cliente.
4. **Verificar compilación**:
   - Ejecutar `npm run build` para asegurar que todas las rutas compilan limpiamente.
