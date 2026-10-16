# Centro de Yoga Salvadora Conesa auth.md

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
