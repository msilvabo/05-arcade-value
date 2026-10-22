"use server";

import { Resend } from "resend";
import type { ContactActionState } from "@/types/contact";

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function renderRetroEmailHtml({
  name,
  email,
  message,
}: {
  name: string;
  email: string;
  message: string;
}): string {
  const timestamp = new Date().toLocaleString("es-ES", {
    timeZone: "UTC",
    dateStyle: "full",
    timeStyle: "medium",
  });

  return `
    <!DOCTYPE html>
    <html lang="es">
      <head>
        <meta charset="utf-8" />
        <title>Nuevo Mensaje - Arcade Vault</title>
      </head>
      <body style="margin: 0; padding: 24px; background-color: #07070b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f1f5f9;">
        <div style="max-width: 600px; margin: 0 auto; background-color: #0d0e15; border: 2px solid #00f0ff; border-radius: 8px; overflow: hidden; box-shadow: 0 0 20px rgba(0, 240, 255, 0.25);">
          <!-- Header Bar -->
          <div style="background-color: #141724; padding: 12px 18px; border-bottom: 1px solid #1e293b; display: flex; align-items: center;">
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ff3366; margin-right: 6px;"></span>
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #ffd600; margin-right: 6px;"></span>
            <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: #00ff66; margin-right: 12px;"></span>
            <span style="font-family: monospace; font-size: 13px; color: #00f0ff; font-weight: bold; letter-spacing: 1px;">VAULT-OS // TRANSMISIÓN RECIBIDA</span>
          </div>

          <!-- Content Body -->
          <div style="padding: 24px 28px;">
            <p style="margin: 0 0 8px 0; font-size: 12px; color: #ffd600; text-transform: uppercase; letter-spacing: 2px; font-weight: bold;">
              ▸ TRANSMISIÓN ENTRANTE DEL JUGADOR
            </p>
            <h1 style="margin: 0 0 20px 0; font-size: 22px; color: #ffffff; letter-spacing: 0.5px;">
              Mensaje de contacto recibido
            </h1>

            <div style="background-color: #121422; border-left: 4px solid #ff007f; padding: 16px; border-radius: 4px; margin-bottom: 24px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <tr>
                  <td style="padding: 4px 0; color: #94a3b8; width: 90px; font-weight: bold;">REMITENTE:</td>
                  <td style="padding: 4px 0; color: #00f0ff; font-weight: bold;">${escapeHtml(name)}</td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #94a3b8; font-weight: bold;">CORREO:</td>
                  <td style="padding: 4px 0; color: #f8fafc;"><a href="mailto:${escapeHtml(email)}" style="color: #f8fafc; text-decoration: underline;">${escapeHtml(email)}</a></td>
                </tr>
                <tr>
                  <td style="padding: 4px 0; color: #94a3b8; font-weight: bold;">FECHA (UTC):</td>
                  <td style="padding: 4px 0; color: #94a3b8; font-family: monospace;">${timestamp}</td>
                </tr>
              </table>
            </div>

            <div style="margin-bottom: 24px;">
              <p style="margin: 0 0 8px 0; font-size: 12px; color: #00ff66; font-weight: bold; text-transform: uppercase; letter-spacing: 1.5px;">
                MENSAJE TRANSMITIDO:
              </p>
              <div style="background-color: #08090f; border: 1px solid #1e293b; padding: 16px; border-radius: 6px; white-space: pre-wrap; font-size: 15px; line-height: 1.6; color: #e2e8f0;">
                ${escapeHtml(message)}
              </div>
            </div>

            <p style="margin: 24px 0 0 0; font-size: 12px; color: #64748b; text-align: center; border-top: 1px dashed #1e293b; padding-top: 16px; font-family: monospace;">
              ARCADE VAULT • SISTEMA DE MENSAJERÍA VIRTUAL • FREE PLAY ALWAYS
            </p>
          </div>
        </div>
      </body>
    </html>
  `;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

export async function sendContactMessageAction(
  _prevState: ContactActionState,
  formData: FormData
): Promise<ContactActionState> {
  try {
    const rawName = formData.get("name");
    const rawEmail = formData.get("email");
    const rawMessage = formData.get("message");
    const rawHoneypot = formData.get("honeypot");

    const name = typeof rawName === "string" ? rawName.trim() : "";
    const email = typeof rawEmail === "string" ? rawEmail.trim() : "";
    const message = typeof rawMessage === "string" ? rawMessage.trim() : "";
    const honeypot = typeof rawHoneypot === "string" ? rawHoneypot.trim() : "";

    // 1. Filtrado anti-spam invisible (Honeypot): Si se llenó, es un bot.
    if (honeypot) {
      // Fingir éxito para no alertar al bot
      return {
        status: "success",
        senderName: name || "Player",
      };
    }

    // 2. Validación de campos
    const errors: Record<string, string[]> = {};

    if (!name) {
      errors.name = ["El nombre es requerido."];
    } else if (name.length < 2) {
      errors.name = ["El nombre debe tener al menos 2 caracteres."];
    } else if (name.length > 80) {
      errors.name = ["El nombre no puede exceder 80 caracteres."];
    }

    if (!email) {
      errors.email = ["El correo electrónico es requerido."];
    } else if (!EMAIL_REGEX.test(email)) {
      errors.email = ["Introduce una dirección de correo electrónico válida."];
    }

    if (!message) {
      errors.message = ["El mensaje es requerido."];
    } else if (message.length < 5) {
      errors.message = ["El mensaje debe tener al menos 5 caracteres."];
    } else if (message.length > 3000) {
      errors.message = ["El mensaje no puede superar los 3000 caracteres."];
    }

    if (Object.keys(errors).length > 0) {
      return {
        status: "error",
        message: "Por favor corrige los campos indicados.",
        errors,
      };
    }

    const apiKey = process.env.RESEND_API_KEY?.trim();
    const fromEmail =
      process.env.RESEND_FROM_EMAIL?.trim() ||
      "Arcade Vault <onboarding@resend.dev>";
    const toEmail =
      process.env.CONTACT_NOTIFICATION_EMAIL?.trim() || "contacto@arcadevault.gg";

    // 3. Entorno local sin API key: Modo simulado amigable
    if (!apiKey || apiKey === "re_your_api_key_here") {
      // Simular latencia de red para la animación de terminal
      await new Promise((resolve) => setTimeout(resolve, 800));
      console.warn(
        "\n[ARCADE VAULT - RESEND SIMULADOR]\n" +
          "⚠️ No se encontró una clave RESEND_API_KEY configurada.\n" +
          `▸ De: ${name} <${email}>\n` +
          `▸ Para: ${toEmail}\n` +
          `▸ Mensaje: "${message}"\n` +
          "El formulario funcionará en la interfaz simulando éxito.\n"
      );
      return {
        status: "success",
        senderName: name,
        message: "Transmisión simulada exitosamente en entorno local.",
      };
    }

    // 4. Envío real a través de Resend
    const resend = new Resend(apiKey);
    const { error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject: `[Arcade Vault] Mensaje de ${name}`,
      html: renderRetroEmailHtml({ name, email, message }),
    });

    if (error) {
      console.error("[ARCADE VAULT - RESEND ERROR]", error);
      return {
        status: "error",
        message:
          error.message ||
          "Error al transmitir el mensaje mediante el servicio de correo.",
      };
    }

    return {
      status: "success",
      senderName: name,
    };
  } catch (err: unknown) {
    const errorMsg =
      err instanceof Error
        ? err.message
        : "Ocurrió un error inesperado al procesar la solicitud.";
    console.error("[ARCADE VAULT - CONTACT ERROR]", err);
    return {
      status: "error",
      message: errorMsg,
    };
  }
}
