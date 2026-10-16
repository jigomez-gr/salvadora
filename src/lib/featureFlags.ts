/**
 * Global Feature Flags for Landing
 * 
 * PORWASSAP: Controls visibility of all WhatsApp booking / handoff buttons on the landing.
 *            Active ONLY if set to 'S'.
 * PORVAPI:    Controls visibility of VAPI voice assistant buttons ('Pedir por Teléfono', 'Te Llamamos').
 *            Active ONLY if set to 'S'.
 */

export function isPorWassapEnabled(): boolean {
  const val = (
    process.env.NEXT_PUBLIC_PORWASSAP ||
    process.env.PORWASSAP ||
    "N"
  ).trim().toUpperCase();
  return val === "S";
}

export function isPorVapiEnabled(): boolean {
  const val = (
    process.env.NEXT_PUBLIC_PORVAPI ||
    process.env.PORVAPI ||
    "S"
  ).trim().toUpperCase();
  return val === "S";
}
