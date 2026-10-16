import crypto from "crypto";

export interface SendSmsOptions {
  number: string;
  message: string;
  sender?: string;
  contactId?: string;
  callId?: string;
  appointmentId?: string;
}

export interface SendSmsResult {
  success: boolean;
  status?: string;
  messages?: number;
  cost?: number;
  currency?: string;
  rawResponse?: any;
  error?: string;
  service?: "zadarma_direct" | "crm_proxy";
}

const DEFAULT_ZADARMA_KEY = process.env.ZADARMA_API_KEY || "45dc42d6f22439899024";
const DEFAULT_ZADARMA_SECRET = process.env.ZADARMA_API_SECRET || "34061190a934a453aa99";
const CRM_API_URL = process.env.NEXT_PUBLIC_CRM_API_URL || "https://crm-salvadoraconesa.jigretera.com";

/**
 * Genera la firma criptográfica HMAC-SHA1 requerida por la API de Zadarma:
 * 1. Ordena los parámetros alfabéticamente por clave.
 * 2. Genera la query string.
 * 3. Calcula el hash MD5 de la query string.
 * 4. Concatena: method_path + queryString + md5Hash.
 * 5. Genera el HMAC-SHA1 con apiSecret en formato hexadecimal y luego lo codifica en Base64.
 * 6. Formato de cabecera: Authorization: {apiKey}:{signature}
 */
export function generateZadarmaAuthHeader(
  apiKey: string,
  apiSecret: string,
  methodPath: string,
  params: Record<string, string>
): string {
  const sortedKeys = Object.keys(params).sort();
  const queryString = sortedKeys.map((k) => `${k}=${params[k]}`).join("&");
  const md5Hash = crypto.createHash("md5").update(queryString).digest("hex");
  const toSign = `${methodPath}${queryString}${md5Hash}`;
  const hmacHex = crypto.createHmac("sha1", apiSecret).update(toSign).digest("hex");
  const signature = Buffer.from(hmacHex).toString("base64");
  return `${apiKey}:${signature}`;
}

/**
 * Normaliza el número de teléfono eliminando espacios y asegurando el código de país.
 */
export function formatPhoneNumber(phone: string): string {
  let clean = phone.replace(/[\s\-\(\)\.]/g, "").trim();
  if (clean.startsWith("+")) {
    clean = clean.substring(1);
  } else if (/^[6789]\d{8}$/.test(clean)) {
    // Número español de 9 dígitos por defecto
    clean = `34${clean}`;
  }
  return clean;
}

/**
 * Envía un mensaje SMS mediante la API de Zadarma, con fallback automático al CRM.
 */
export async function sendSms(options: SendSmsOptions): Promise<SendSmsResult> {
  const cleanNumber = formatPhoneNumber(options.number);
  const message = options.message;

  if (!cleanNumber || cleanNumber.length < 8) {
    return {
      success: false,
      error: `Número de teléfono no válido: ${options.number}`,
    };
  }

  // 1. Intentar envío directo a Zadarma API
  try {
    const methodPath = "/v1/sms/send/";
    const params: Record<string, string> = {
      number: cleanNumber,
      message,
    };
    if (options.sender) {
      params.sender = options.sender;
    }

    const authHeader = generateZadarmaAuthHeader(
      DEFAULT_ZADARMA_KEY,
      DEFAULT_ZADARMA_SECRET,
      methodPath,
      params
    );

    const formData = new URLSearchParams();
    for (const [k, v] of Object.entries(params)) {
      formData.append(k, v);
    }

    const zadarmaRes = await fetch(`https://api.zadarma.com${methodPath}`, {
      method: "POST",
      headers: {
        Authorization: authHeader,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: formData.toString(),
      signal: AbortSignal.timeout(8000),
    });

    const data = await zadarmaRes.json().catch(() => ({}));

    if (zadarmaRes.ok && data?.status === "success") {
      console.log(`[SMS ZADARMA ENVIADO] Éxito a +${cleanNumber}:`, data);
      return {
        success: true,
        status: data.status,
        messages: data.messages ? Number(data.messages) : 1,
        cost: data.cost ? Number(data.cost) : undefined,
        currency: data.currency || "EUR",
        rawResponse: data,
        service: "zadarma_direct",
      };
    } else {
      console.warn(`[SMS ZADARMA DIRECTO FALLÓ] Respuesta:`, data);
    }
  } catch (directErr: any) {
    console.warn(`[SMS ZADARMA DIRECTO ERROR] ${directErr.message}. Probando fallback en CRM...`);
  }

  // 2. Fallback a través del endpoint REST del CRM Salvadora
  try {
    const cleanCrmUrl = CRM_API_URL.replace(/\/$/, "");
    const crmRes = await fetch(`${cleanCrmUrl}/api/sms/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        number: cleanNumber,
        message,
        sender: options.sender || "Salvadora",
        contactId: options.contactId,
        callId: options.callId,
        appointmentId: options.appointmentId,
      }),
      signal: AbortSignal.timeout(8000),
    });

    const crmData = await crmRes.json().catch(() => ({}));
    if (crmRes.ok && (crmData.success || crmData.status === "success")) {
      console.log(`[SMS CRM FALLBACK ENVIADO] Éxito a +${cleanNumber}:`, crmData);
      return {
        success: true,
        status: crmData.status || "success",
        messages: crmData.messages,
        cost: crmData.cost,
        currency: crmData.currency || "EUR",
        rawResponse: crmData,
        service: "crm_proxy",
      };
    } else {
      console.error(`[SMS CRM FALLBACK ERROR] Respuesta del CRM:`, crmData);
      return {
        success: false,
        error: crmData.error || "No se pudo entregar el SMS a través del CRM",
        rawResponse: crmData,
      };
    }
  } catch (crmErr: any) {
    console.error(`[SMS FALLBACK CRM FALLÓ]: ${crmErr.message}`);
    return {
      success: false,
      error: `Error de conexión al enviar SMS: ${crmErr.message}`,
    };
  }
}

/**
 * Traduce el código de servicio a un nombre amigable para el usuario.
 */
export function getServiceReadableName(serviceCode: string): string {
  const map: Record<string, string> = {
    clase_semanal: "1 Clase Semanal de Yoga",
    dos_clases_semanal: "2 Clases Semanales de Yoga",
    gong: "Baño de Gong",
    puja: "Puja Nocturna de Gong",
    constelaciones_constelar: "Constelaciones Familiares (Constelar)",
    constelaciones_participar: "Constelaciones Familiares (Participar)",
    retiro_encuentro: "Retiro / Encuentro de Bienestar",
  };
  return map[serviceCode] || serviceCode;
}

/**
 * Envía el SMS automático de confirmación de reserva (alta).
 */
export async function sendBookingConfirmationSms(params: {
  telefono: string;
  nombre: string;
  servicio: string;
  plazas: number;
  email?: string;
}): Promise<SendSmsResult> {
  const serviceName = getServiceReadableName(params.servicio);
  const firstName = params.nombre.trim().split(" ")[0] || "amig@";

  // Plantilla amigable según especificación
  const emailNotice = params.email && !params.email.includes("@salvadoraconesa.com")
    ? `Detalles enviados a ${params.email}.`
    : "Si deseas recibir justificante por correo infórmalo en recepción.";

  const message = `¡Hola ${firstName}! Tu reserva de ${serviceName} (${params.plazas} plaza${params.plazas > 1 ? "s" : ""}) en Centro Salvadora está registrada. ${emailNotice} ¡Te esperamos! Tel: 695 172 625`;

  return sendSms({
    number: params.telefono,
    message,
    sender: "Salvadora",
  });
}

/**
 * Envía el SMS automático de confirmación de pago de reserva.
 */
export async function sendPaymentConfirmationSms(params: {
  telefono: string;
  nombre: string;
  servicio: string;
  importe: number;
}): Promise<SendSmsResult> {
  const serviceName = getServiceReadableName(params.servicio);
  const firstName = params.nombre.trim().split(" ")[0] || "amig@";

  const message = `Centro Salvadora: ¡Hola ${firstName}! Hemos recibido tu pago de ${params.importe} € para ${serviceName}. Tu plaza está confirmada. ¡Gracias! Tel: 695 172 625`;

  return sendSms({
    number: params.telefono,
    message,
    sender: "Salvadora",
  });
}
