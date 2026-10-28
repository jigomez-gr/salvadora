/**
 * Global Feature Flags for Landing
 * 
 * PORWASSAP: Controls visibility of all WhatsApp booking / handoff buttons on the landing.
 *            Active by default (set to 'N' to deactivate).
 * PORVAPI:    Controls visibility of VAPI voice assistant buttons ('Pedir por Teléfono', 'Te Llamamos').
 *            Active by default (set to 'N' to deactivate).
 */

export function isPorWassapEnabled(): boolean {
  const val = (
    process.env.NEXT_PUBLIC_PORWASSAP ||
    process.env.PORWASSAP ||
    "S"
  ).trim().toUpperCase();
  return val !== "N";
}

export function isPorVapiEnabled(): boolean {
  const val = (
    process.env.NEXT_PUBLIC_PORVAPI ||
    process.env.PORVAPI ||
    "S"
  ).trim().toUpperCase();
  return val !== "N";
}

export function getNumeroWassap(): { raw: string; clean: string; display: string } {
  const raw = (
    process.env.NEXT_PUBLIC_NUMEROWASSAP ||
    process.env.NUMEROWASSAP ||
    "34 646 03 42 31"
  ).trim();
  const clean = raw.replace(/\D/g, "") || "34646034231";
  const display = raw.startsWith("+") ? raw : `+${raw}`;
  return { raw, clean, display };
}
