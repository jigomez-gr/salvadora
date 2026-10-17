import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

const PAGE_MARKDOWN: Record<string, string> = {
  "/": `# Centro de Yoga y Bienestar Salvadora Conesa — Fuenlabrada

> Clases de Kundalini Yoga, Nagna Yoga, baños y puja de gong, meditación guiada y retiros de ayuno terapéutico en Fuenlabrada (Madrid), dirigido por Salvadora Conesa.

Bienvenido al Centro de Yoga y Bienestar Salvadora Conesa, un espacio de más de 15 años dedicado a la salud integral, el autocuidado y la expansión de la conciencia.

## Oferta Formativa y Terapéutica

1. **Kundalini Yoga**: Práctica milenaria para activar la vitalidad, armonizar los chakras y equilibrar el sistema nervioso a través de kriyas, respiraciones y mantras.
2. **Nagna Yoga (Yoga Desnudo Consciente)**: Práctica sin vestimentas en un marco de respeto ético y confidencialidad para descondicionar el cuerpo, superar complejos y cultivar la autoaceptación.
3. **Baños de Gong**: Inmersión en frecuencias armónicas con gongs y cuencos tibetanos para inducir estados meditativos profundos (ondas theta y delta) y liberar tensiones musculares.
4. **Pujas de Gong**: Ceremonia sagrada nocturna con horas continuadas de vibración de gong, celebrada dos veces al año.
5. **Retiros de Ayuno Terapéutico**: Experiencias de depuración física y mental en la naturaleza con caminatas en silencio, yoga suave y descanso consciente.
6. **Taller Mejorar Asanas**: Alineación postural y biomecánica consciente para una práctica segura y profunda.

## Enlaces Rápidos
- [Servicios y Clases](/servicios): Catálogo completo de disciplinas y horarios.
- [Reserva Online](/reserva): Reserva directa de clases y experiencias.
- [Nagna Yoga](/nagna-yoga): Información detallada de la práctica.
- [Mejorar Asanas](/mejorar-asanas): Contenido del taller postural.
- [Política de Privacidad](/politica-de-privacidad): Información sobre tratamiento de datos (RGPD).

## Contacto
- **Dirección**: Fuenlabrada, Madrid, España
- **Email**: salvadora@centrodeyogasalvadoraconesa.es
- **Teléfono / WhatsApp**: +34 695 17 26 25
- **Web**: https://centrodeyogasalvadoraconesa.es
`,

  "/servicios": `# Servicios y Clases — Centro de Yoga Salvadora Conesa

Explora todas las disciplinas, talleres y actividades impartidas por Salvadora Conesa y su equipo de colaboradores.

## Clases y Talleres Destacados

### Kundalini Yoga
- **Enfoque**: Respiración (pranayama), posturas (asanas), cantos de mantras y meditaciones transformadoras.
- **Duración**: Sesiones de 75 a 90 minutos.
- **Modalidades**: Presencial en sala acondicionada.

### Nagna Yoga
- **Enfoque**: Yoga desnudo consciente para la autoaceptación, el desprendimiento de prejuicios estéticos y la reconexión íntima con el propio ser.
- **Ambiente**: Máximo respeto, cuidado y espacio seguro libre de juicios.

### Baños de Gong
- **Enfoque**: Terapia de sonido con gongs sinfónicos y cuencos tibetanos.
- **Beneficios**: Alivio del estrés crónico, regeneración celular y descanso profundo del sistema nervioso.

### Taller Mejorar Asanas
- **Enfoque**: Perfeccionamiento técnico, biomecánica y ajustes posturales personalizados.

### Actividades Especiales y Colaboradores
- Bienestar Experience, Asesoramiento en Longevidad, Yoga Nidra y Terapias Complementarias.

## Reservas
Para reservar plaza o consultar horarios actualizados, visita [Página de Reservas](/reserva) o contacta por WhatsApp al [+34 695 17 26 25](https://wa.me/34695172625).
`,

  "/reserva": `# Reserva de Clases y Sesiones — Centro de Yoga Salvadora Conesa

Gestiona tu plaza para clases regulares, talleres especiales y baños de gong.

## Opciones de Reserva
1. **Reserva Directa Online**: Selecciona la actividad, fecha y horario deseado a través de nuestra pasarela segura.
2. **Asistente Virtual**: Puedes interactuar con nuestro agente conversacional en la web para coordinar tu cita o resolver dudas sobre disponibilidad.
3. **Atención por WhatsApp**: Escríbenos directamente al [+34 695 17 26 25](https://wa.me/34695172625) para resolver preguntas personalizadas.

## Condiciones
- Se recomienda llegar 10 minutos antes de la hora acordada.
- Material incluido en la sala (esterillas, mantas, zafus y cojines de meditación).
- Cancelaciones con al menos 24 horas de antelación para reprogramar tu sesión.
`,

  "/nagna-yoga": `# Nagna Yoga — Yoga Desnudo Consciente en Fuenlabrada

El Nagna Yoga es una disciplina milenaria que propone la práctica del yoga sin ropa como vehículo de liberación interior, desmitificación del cuerpo y conexión con la esencia pura.

## Principios Fundamentales
- **Aceptación Corporal**: Mirar y sentir el propio cuerpo sin las etiquetas ni exigencias del mundo exterior.
- **Espacio Seguro y Sagrado**: Las sesiones se rigen por un código estricto de respeto, confidencialidad y ausencia de intencionalidad sexual.
- **Fluidez y Movimiento**: Sin la resistencia de tejidos o costuras, la respiración y el estiramiento son percibidos con total nitidez.

## A quién va dirigido
A cualquier persona que desee reconciliarse con su corporeidad, liberar tensiones arraigadas o experimentar una práctica de yoga profunda y libre.

## Reservar plaza
Consulta fechas y grupos reducidos en [Reservas](/reserva) o llama al [+34 695 17 26 25](https://wa.me/34695172625).
`,

  "/mejorar-asanas": `# Taller Mejorar Asanas — Alineación y Profundización Postural

Taller técnico enfocado en la biomecánica corporal, la corrección de hábitos posturales y el desarrollo de una práctica segura y duradera.

## Contenido del Taller
1. **Base y Apoyo**: Conciencia de la pisada y el enraizamiento (Pada Bandha).
2. **Alineación de Columna**: Prevención de hiperlordosis y sobrecargas cervicales o lumbares.
3. **Transiciones Fluídas**: Cómo entrar y salir de cada postura manteniendo la respiración consciente.
4. **Adaptaciones**: Variantes con apoyos (bloques, cinturones, mantas) según la anatomía individual.

## Información de Reserva
- Plazas limitadas para garantizar atención individualizada.
- Reserva a través de [la sección de reservas](/reserva).
`,

  "/politica-de-privacidad": `# Política de Privacidad — Centro de Yoga Fuenlabrada Salvadora Conesa

Conforme al Reglamento General de Protección de Datos (RGPD UE 2016/679) y la Ley Orgánica 3/2018 (LOPDGDD).

- **Responsable**: Centro de Yoga Fuenlabrada Salvadora Conesa
- **Finalidad**: Gestión de citas, reservas, suscripciones y atención de consultas de los usuarios.
- **Legitimación**: Consentimiento del interesado y relación precontractual/contractual.
- **Destinatarios**: No se cederán datos a terceros salvo obligación legal expresa.
- **Derechos**: Acceso, rectificación, supresión, oposición y portabilidad enviando solicitud a salvadora@centrodeyogasalvadoraconesa.es.
`,

  "/politica-de-cookies": `# Política de Cookies — Centro de Yoga Salvadora Conesa

Este sitio web utiliza cookies técnicas imprescindibles para la navegación y la gestión de sesiones de reserva.

- **Cookies Técnicas**: Necesarias para el correcto funcionamiento de la plataforma y el asistente de reservas.
- **Cookies Analíticas**: Utilizadas para medir el tráfico y mejorar la experiencia de usuario (anonimizadas).
- **Gestión**: Puedes configurar o deshabilitar las cookies desde las preferencias de tu navegador web.
`,

  "/ley-de-proteccion-de-datos": `# Ley de Protección de Datos (RGPD y LOPDGDD)

Información detallada sobre las garantías, protocolos de seguridad y derechos digitales de los clientes del Centro de Yoga Salvadora Conesa.

Garantizamos la confidencialidad absoluta en todos los canales de interacción, incluyendo formularios web, reservas online y asistentes inteligentes de soporte.
`,
};

const STUDIO_INFO_SKILL_MD = `# Studio Information and Class Schedule

Retrieve information about classes, therapy sessions, workshops, schedules, and location for Centro de Yoga y Bienestar Salvadora Conesa.

## Usage

Agents can consult class descriptions, pricing, and directions:
- Classes: Kundalini Yoga, Nagna Yoga, Gong Baths, Puja de Gong, Therapeutic Fasting Retreats, and Postural Alignment Workshops.
- Location: Fuenlabrada, Madrid, Spain
- Contact: salvadora@centrodeyogasalvadoraconesa.es / Phone & WhatsApp: +34 695 17 26 25
- Website: https://centrodeyogasalvadoraconesa.es
- Canonical documentation: https://centrodeyogasalvadoraconesa.es/llms.txt
`;

const BOOKING_ASSISTANT_SKILL_MD = `# Yoga and Gong Session Booking Assistant

Facilitate class bookings and reservations for yoga classes, sound bath sessions, and retreats at Centro de Yoga y Bienestar Salvadora Conesa.

## Booking Endpoints & Actions

- Reservation portal: https://centrodeyogasalvadoraconesa.es/reserva
- Direct booking API: POST https://centrodeyogasalvadoraconesa.es/api/reservas
- Real-time customer support: WhatsApp +34 695 17 26 25
- Cancellation policy: 24-hour advance notification required for rescheduling.
`;

export function proxy(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Web Bot Auth (draft-meunier-http-message-signatures-directory / IETF WebBotAuth)
  if (
    pathname === "/.well-known/http-message-signatures-directory" ||
    pathname === "/http-message-signatures-directory"
  ) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    const jwks = {
      keys: [
        {
          crv: "Ed25519",
          x: "lAYsPmMuz3wrhDp5dhoiFZXH993bKmpYLA3g5L9ttqk",
          kty: "OKP",
          kid: "sJ8yht9x-x_dhPNkBzFdesdiBLEO5Y-ebiPIu86P00o",
          use: "sig",
        },
      ],
    };

    return new NextResponse(JSON.stringify(jwks, null, 2), {
      status: 200,
      headers: {
        "Content-Type":
          "application/http-message-signatures-directory+json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Cache-Control": "public, max-age=86400",
      },
    });
  }

  // RFC 9727 API Catalog Discovery
  if (pathname === "/.well-known/api-catalog") {
    const apiCatalog = {
      linkset: [
        {
          anchor: "https://centrodeyogasalvadoraconesa.es/api/reservas",
          "service-doc": [
            {
              href: "https://centrodeyogasalvadoraconesa.es/llms.txt",
              type: "text/plain",
            },
          ],
          "service-desc": [
            {
              href: "https://centrodeyogasalvadoraconesa.es/.well-known/mcp/server-card.json",
              type: "application/json",
            },
          ],
        },
        {
          anchor: "https://centrodeyogasalvadoraconesa.es/api/mcp",
          "service-desc": [
            {
              href: "https://centrodeyogasalvadoraconesa.es/.well-known/mcp/server-card.json",
              type: "application/json",
            },
          ],
        },
      ],
    };

    return new NextResponse(JSON.stringify(apiCatalog, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/linkset+json; charset=utf-8",
      },
    });
  }

  // SEP-1649 / SEP-2127 MCP Server Card Discovery
  if (
    pathname === "/.well-known/mcp/server-card.json" ||
    pathname === "/.well-known/mcp" ||
    pathname === "/.well-known/mcp.json"
  ) {
    const serverCard = {
      serverInfo: {
        name: "Centro de Yoga Salvadora Conesa MCP Server",
        version: "1.0.0",
      },
      description:
        "Herramientas de consulta de servicios, horarios, clases de yoga (Kundalini, Nagna) y gestion de reservas para el Centro de Yoga y Bienestar Salvadora Conesa.",
      transport: {
        type: "streamable-http",
        endpoint: "https://centrodeyogasalvadoraconesa.es/api/mcp",
      },
      endpoint: "https://centrodeyogasalvadoraconesa.es/api/mcp",
      url: "https://centrodeyogasalvadoraconesa.es/api/mcp",
      capabilities: {
        tools: true,
        resources: true,
        prompts: false,
      },
    };

    return new NextResponse(JSON.stringify(serverCard, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  // A2A Protocol Agent Card Discovery
  if (pathname === "/.well-known/agent-card.json") {
    const agentCard = {
      name: "Centro de Yoga Salvadora Conesa Assistant",
      version: "1.0.0",
      description:
        "Agente autónomo para reservas de clases, talleres de yoga y baños de gong en Fuenlabrada.",
      url: "https://centrodeyogasalvadoraconesa.es",
      supportedInterfaces: [
        {
          url: "https://centrodeyogasalvadoraconesa.es/api/vapi/call",
          protocolBinding: "HTTP+JSON",
          protocolVersion: "1.0",
        },
      ],
      capabilities: {
        streaming: false,
        pushNotifications: false,
      },
      skills: [
        {
          id: "yoga-class-booking",
          name: "Yoga Class Booking",
          description:
            "Permite consultar disponibilidad y reservar clases de Kundalini Yoga y Nagna Yoga.",
        },
        {
          id: "gong-bath-reservation",
          name: "Gong Bath Reservation",
          description:
            "Permite reservar sesiones de baños y puja de gong terapéuticos.",
        },
        {
          id: "studio-information",
          name: "Studio Information",
          description:
            "Ofrece información detallada de horarios, precios, ubicación y disciplinas del centro.",
        },
      ],
    };

    return new NextResponse(JSON.stringify(agentCard, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  // ARD AI Catalog Discovery
  if (
    pathname === "/.well-known/ai-catalog.json" ||
    pathname === "/.well-known/ai-catalog" ||
    pathname === "/.well-known/ai-catalog/" ||
    pathname === "/ai-catalog.json" ||
    pathname === "/ai-catalog" ||
    pathname === "/ai-catalog/"
  ) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    const aiCatalog = {
      specVersion: "1.0",
      host: {
        displayName: "Centro de Yoga y Bienestar Salvadora Conesa",
        identifier: "did:web:centrodeyogasalvadoraconesa.es",
      },
      entries: [
        {
          identifier: "urn:air:centrodeyogasalvadoraconesa.es:server:mcp",
          displayName: "Salvadora Conesa MCP Server",
          type: "application/mcp-server-card+json",
          url: "https://centrodeyogasalvadoraconesa.es/.well-known/mcp/server-card.json",
          representativeQueries: [
            "clases de yoga en Fuenlabrada",
            "reservar sesion de bano de gong",
            "horarios y precios de kundalini yoga",
          ],
        },
        {
          identifier: "urn:air:centrodeyogasalvadoraconesa.es:agent:a2a",
          displayName: "Salvadora Conesa A2A Booking Agent",
          type: "application/a2a-agent-card+json",
          url: "https://centrodeyogasalvadoraconesa.es/.well-known/agent-card.json",
          representativeQueries: [
            "agente para reservar clase de nagna yoga",
            "contactar con el asistente del centro de yoga",
            "consultar retiros de ayuno terapeutico",
          ],
        },
        {
          identifier: "urn:air:centrodeyogasalvadoraconesa.es:skill:studio-info",
          displayName: "Studio Information Skill",
          type: "text/markdown",
          url: "https://centrodeyogasalvadoraconesa.es/.well-known/agent-skills/studio-info/SKILL.md",
          representativeQueries: [
            "donde esta el centro de yoga de salvadora conesa",
            "que disciplinas de yoga se imparten",
          ],
        },
        {
          identifier: "urn:air:centrodeyogasalvadoraconesa.es:skill:booking-assistant",
          displayName: "Booking Assistant Skill",
          type: "text/markdown",
          url: "https://centrodeyogasalvadoraconesa.es/.well-known/agent-skills/booking-assistant/SKILL.md",
          representativeQueries: [
            "reservar clase de kundalini yoga",
            "asistente de reservas para clases y banos de gong",
            "como apuntarse a los talleres de yoga",
          ],
        },
      ],
    };

    return new NextResponse(JSON.stringify(aiCatalog, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
      },
    });
  }

  // Agent Skills Discovery Index (RFC 0.2.0)
  if (
    pathname === "/.well-known/agent-skills/index.json" ||
    pathname === "/.well-known/agent-skills" ||
    pathname === "/.well-known/agent-skills/"
  ) {
    const skillsIndex = {
      $schema: "https://schemas.agentskills.io/discovery/0.2.0/schema.json",
      skills: [
        {
          name: "studio-info",
          type: "skill-md",
          description:
            "Retrieve information about classes, therapy sessions, workshops, schedules, and location for Centro de Yoga y Bienestar Salvadora Conesa.",
          url: "/.well-known/agent-skills/studio-info/SKILL.md",
          digest:
            "sha256:2067ee00c61715a2a77ec687b571006bb8c76f70312fedd8e2ea370e653144c5",
        },
        {
          name: "booking-assistant",
          type: "skill-md",
          description:
            "Facilitate class bookings and reservations for yoga classes, sound bath sessions, and retreats at Centro de Yoga y Bienestar Salvadora Conesa.",
          url: "/.well-known/agent-skills/booking-assistant/SKILL.md",
          digest:
            "sha256:2a0358a27f50b8e1afd9d6d8544a152b5bcbeea706c157d9304e348f63c8ab06",
        },
      ],
    };

    return new NextResponse(JSON.stringify(skillsIndex, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Agent Skills - studio-info SKILL.md
  if (
    pathname === "/.well-known/agent-skills/studio-info/SKILL.md" ||
    pathname === "/.well-known/agent-skills/studio-info" ||
    pathname === "/.well-known/agent-skills/studio-info/"
  ) {
    return new NextResponse(STUDIO_INFO_SKILL_MD, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // Agent Skills - booking-assistant SKILL.md
  if (
    pathname === "/.well-known/agent-skills/booking-assistant/SKILL.md" ||
    pathname === "/.well-known/agent-skills/booking-assistant" ||
    pathname === "/.well-known/agent-skills/booking-assistant/"
  ) {
    return new NextResponse(BOOKING_ASSISTANT_SKILL_MD, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }

  // RFC 9728 OAuth Protected Resource Metadata
  if (
    pathname === "/.well-known/oauth-protected-resource" ||
    pathname === "/.well-known/oauth-protected-resource/" ||
    pathname === "/oauth-protected-resource" ||
    pathname === "/oauth-protected-resource/"
  ) {
    if (request.method === "OPTIONS") {
      return new NextResponse(null, {
        status: 204,
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
          "Access-Control-Allow-Headers": "*",
        },
      });
    }

    const host = request.headers.get("x-forwarded-host") || request.headers.get("host") || "centrodeyogasalvadoraconesa.es";
    const proto = host.includes("centrodeyogasalvadoraconesa.es") ? "https" : (request.headers.get("x-forwarded-proto") || "https");
    const canonicalOrigin = `${proto}://${host}`;

    // RFC 9728 Section 2 requires resource to be an absolute URI matching the protected resource URL.
    // Honor query param ?resource= if explicitly requested; otherwise default to origin with trailing slash per RFC 9728 Section 2 / 3.1
    const queryResource = request.nextUrl.searchParams.get("resource");
    const resourceUrl = queryResource || `${canonicalOrigin}/`;

    const prm = {
      resource: resourceUrl,
      authorization_servers: [
        `${canonicalOrigin}/`,
        canonicalOrigin,
        "https://centrodeyogasalvadoraconesa.es/",
        "https://centrodeyogasalvadoraconesa.es",
      ],
      scopes_supported: ["openid", "profile", "read:classes", "write:bookings"],
      bearer_methods_supported: ["header"],
      resource_documentation: "https://centrodeyogasalvadoraconesa.es/llms.txt",
      resource_policy_uri: "https://centrodeyogasalvadoraconesa.es/politica-de-privacidad",
      resource_tos_uri: "https://centrodeyogasalvadoraconesa.es/ley-de-proteccion-de-datos",
    };

    return new NextResponse(JSON.stringify(prm, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, HEAD, OPTIONS",
        "Access-Control-Allow-Headers": "*",
        "Cache-Control": "public, max-age=3600",
      },
    });
  }

  // Auth.md Agent Registration Discovery
  if (pathname === "/auth.md") {
    const authMdContent = `# Centro de Yoga Salvadora Conesa auth.md

Authentication and agent registration specifications for Centro de Yoga y Bienestar Salvadora Conesa APIs and services.

## Overview
This document describes the registration and authentication protocols supported by Centro de Yoga y Bienestar Salvadora Conesa for autonomous AI agents.

## Agent Audience & Access Policy
- **Public Read Access**: Anonymous AI agents can access public class schedules, gong bath dates, teacher bios, and service details without prior registration.
- **Agent Registration**: Agents that need to create bookings, query customer profiles, or receive notifications must register using the \`agent_auth\` registration endpoint.

## Registration Endpoints
- **Agent Registration**: \`POST https://centrodeyogasalvadoraconesa.es/api/auth/agent/register\`
- **Claim URI**: \`https://centrodeyogasalvadoraconesa.es/api/auth/agent/claim\`
- **Revocation URI**: \`https://centrodeyogasalvadoraconesa.es/api/auth/agent/revoke\`

## Supported Authentication Methods
1. **Anonymous Registration**: Agents receive an ephemeral client identifier and scoped access token to initiate bookings on behalf of visiting users.
2. **Verified Email Assertion**: Agents asserting a verified user email can authenticate to manage existing client reservations.
3. **ID-JAG (Identity Assertion)**: Standard JWT-based identity assertions (\`urn:ietf:params:oauth:token-type:id-jag\`).

## OAuth Discovery Endpoints
- **Protected Resource Metadata**: \`/.well-known/oauth-protected-resource\`
- **Authorization Server**: \`/.well-known/oauth-authorization-server\`
- **OIDC Configuration**: \`/.well-known/openid-configuration\`
- **API Catalog**: \`/.well-known/api-catalog\`

## Credential Usage
When communicating with protected endpoints, provide credentials via the standard HTTP header:
\`Authorization: Bearer <access_token>\`
`;

    return new NextResponse(authMdContent, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(Math.ceil(authMdContent.length / 3.8)),
      },
    });
  }

  // RFC 8414 OAuth 2.0 Authorization Server Metadata
  if (pathname === "/.well-known/oauth-authorization-server") {
    const oauth = {
      issuer: "https://centrodeyogasalvadoraconesa.es",
      authorization_endpoint: "https://centrodeyogasalvadoraconesa.es/api/auth/authorize",
      token_endpoint: "https://centrodeyogasalvadoraconesa.es/api/auth/token",
      jwks_uri: "https://centrodeyogasalvadoraconesa.es/.well-known/jwks.json",
      response_types_supported: ["code", "token"],
      grant_types_supported: ["authorization_code", "client_credentials", "refresh_token"],
      scopes_supported: ["openid", "profile", "read:classes", "write:bookings"],
      token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
      agent_auth: {
        skill: "https://centrodeyogasalvadoraconesa.es/auth.md",
        register_uri: "https://centrodeyogasalvadoraconesa.es/api/auth/agent/register",
        claim_uri: "https://centrodeyogasalvadoraconesa.es/api/auth/agent/claim",
        revocation_uri: "https://centrodeyogasalvadoraconesa.es/api/auth/agent/revoke",
        identity_types_supported: ["anonymous", "identity_assertion"],
        credential_types_supported: ["bearer_token", "api_key"],
        identity_assertion: {
          assertion_types_supported: [
            "urn:ietf:params:oauth:token-type:id-jag",
            "verified_email",
          ],
        },
        anonymous: {
          credential_types_supported: ["bearer_token"],
        },
        events_supported: ["revocation"],
      },
    };

    return new NextResponse(JSON.stringify(oauth, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  // OpenID Connect Discovery Metadata
  if (pathname === "/.well-known/openid-configuration") {
    const oidc = {
      issuer: "https://centrodeyogasalvadoraconesa.es",
      authorization_endpoint: "https://centrodeyogasalvadoraconesa.es/api/auth/authorize",
      token_endpoint: "https://centrodeyogasalvadoraconesa.es/api/auth/token",
      jwks_uri: "https://centrodeyogasalvadoraconesa.es/.well-known/jwks.json",
      response_types_supported: ["code", "token"],
      subject_types_supported: ["public"],
      id_token_signing_alg_values_supported: ["RS256"],
      grant_types_supported: ["authorization_code", "client_credentials", "refresh_token"],
      scopes_supported: ["openid", "profile", "read:classes", "write:bookings"],
      token_endpoint_auth_methods_supported: ["client_secret_basic", "client_secret_post"],
      agent_auth: {
        skill: "https://centrodeyogasalvadoraconesa.es/auth.md",
        register_uri: "https://centrodeyogasalvadoraconesa.es/api/auth/agent/register",
        claim_uri: "https://centrodeyogasalvadoraconesa.es/api/auth/agent/claim",
        revocation_uri: "https://centrodeyogasalvadoraconesa.es/api/auth/agent/revoke",
        identity_types_supported: ["anonymous", "identity_assertion"],
        credential_types_supported: ["bearer_token", "api_key"],
        identity_assertion: {
          assertion_types_supported: [
            "urn:ietf:params:oauth:token-type:id-jag",
            "verified_email",
          ],
        },
        anonymous: {
          credential_types_supported: ["bearer_token"],
        },
        events_supported: ["revocation"],
      },
    };

    return new NextResponse(JSON.stringify(oidc, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    });
  }

  const accept = request.headers.get("accept") || "";

  // Check if client explicitly requests Markdown
  if (accept.includes("text/markdown")) {
    const normalizedPath = pathname.endsWith("/") && pathname.length > 1
      ? pathname.slice(0, -1)
      : pathname;

    const markdown = PAGE_MARKDOWN[normalizedPath] || PAGE_MARKDOWN["/"];
    const estimatedTokens = Math.ceil(markdown.length / 3.8);

    return new NextResponse(markdown, {
      status: 200,
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
        "x-markdown-tokens": String(estimatedTokens),
        "Vary": "Accept",
      },
    });
  }

  const response = NextResponse.next();
  response.headers.set(
    "Link",
    '</.well-known/api-catalog>; rel="api-catalog", </.well-known/ai-catalog.json>; rel="ai-catalog", </.well-known/mcp/server-card.json>; rel="service-desc", </llms.txt>; rel="service-doc", </.well-known/agent-card.json>; rel="describedby", </.well-known/oauth-protected-resource>; rel="oauth-protected-resource", </.well-known/mcp/server-card.json>; rel="mcp-server-card", </.well-known/agent-card.json>; rel="agent-card"'
  );
  response.headers.set(
    "WWW-Authenticate",
    'Bearer resource_metadata="https://centrodeyogasalvadoraconesa.es/.well-known/oauth-protected-resource"'
  );
  return response;
}

export const config = {
  matcher: [
    "/auth.md",
    "/.well-known/mcp/server-card.json",
    "/.well-known/mcp",
    "/.well-known/mcp.json",
    "/.well-known/agent-card.json",
    "/.well-known/ai-catalog.json",
    "/.well-known/ai-catalog",
    "/ai-catalog.json",
    "/ai-catalog",
    "/.well-known/agent-skills",
    "/.well-known/agent-skills/:path*",
    "/.well-known/api-catalog",
    "/.well-known/oauth-protected-resource",
    "/.well-known/oauth-protected-resource/:path*",
    "/oauth-protected-resource",
    "/oauth-protected-resource/:path*",
    "/.well-known/oauth-authorization-server",
    "/.well-known/openid-configuration",
    "/.well-known/http-message-signatures-directory",
    "/http-message-signatures-directory",
    "/((?!api|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|auth\\.md|\\.well-known/|.*\\.(?:svg|png|jpg|jpeg|gif|webp|mp4|pdf|txt|ico|json|md)).*)",
  ],
};

