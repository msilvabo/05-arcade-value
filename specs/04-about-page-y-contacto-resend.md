# Spec 04: Página Acerca de (About) y Envío de Correo con Resend

**Estado:** Aprobado  
**Fecha:** 2026-10-22  
**Depende de:** 01-biblioteca-juegos-mvp.md, 02-arcade-interfaces-visuales.md, 03-home-landing-y-about.md  

---

## Objetivo
Implementar la página "Acerca de" (`/about`) basada en la referencia visual `references/home-about/about.jsx`, integrando un formulario interactivo con estética de terminal retro (`VAULT-OS`) conectado a una Server Action de Next.js 16 para el envío real de correos mediante la plataforma Resend.

---

## Alcance

### Dentro del alcance
- **1. Ruta y Página Acerca de (`app/about/page.tsx`):**
  - Creación de la página pública en la ruta `/about` con metadata adecuada de Next.js.
  - Integración fluida con la barra de navegación global (`Navbar`) existente donde el enlace `/about` se marca como activo.
  - Estilos consistentes con el diseño arcade retro (Tailwind CSS v4, efectos neón, scanlines y paleta Cyberpunk/Retro).
- **2. Hero y Sección Misión:**
  - Eyebrow / Kicker neón amarillo: `▸ ACERCA DE`.
  - Título principal retro: `ACERCA DE ARCADE VAULT`.
  - Párrafo descriptivo de la misión de preservación de juegos arcade clásicos.
  - Fila de 3 tarjetas destacadas con iconos retro pixel art:
    1. *Hecho con ❤️ para jugadores* (Acento Magenta / Icono Corazón).
    2. *Juegos en HTML — Corren en cualquier navegador* (Acento Cyan / Icono Navegador).
    3. *Proyecto en constante crecimiento* (Acento Verde / Icono Planta).
- **3. Divisor Ornamental Neón:**
  - Barra decorativa con fila de bloques pixelados animados (`div-pixels`) y delays secuenciales, emulando la estética de marquesina arcade.
- **4. Sección de Contacto y Consejos:**
  - Bloque lateral de introducción con kicker neón cyan: `▸ CONTACTO`, título `CONTÁCTANOS` y texto motivador.
  - Indicadores con luces LED de colores:
    - LED cyan: `RESPUESTA EN 24-48H`
    - LED amarillo: `SUGERENCIAS BIENVENIDAS`
    - LED magenta: `SIN SPAM, JAMÁS`
- **5. Formulario Interactivo y Terminal VAULT-OS:**
  - Campos de entrada: Nombre (`name`), Correo Electrónico (`email`), Mensaje (`message`) y campo trampa invisible anti-spam (`honeypot`).
  - Validación de campos requeridos y formato de correo electrónico en cliente con animación de sacudida (`shake`) en caso de errores inmediatos.
  - Estados interactivos:
    - **Inactivo / Edición:** Inputs con bordes sutiles y efectos glow al enfocar.
    - **Enviando (Loading):** Transición a la terminal retro `VAULT-OS // TERMINAL` ejecutando los pasos secuenciales de consola (`[OK] Conectando con servidor…`, `[OK] Validando contenido…`, `[OK] Transmitiendo paquete…`).
    - **Éxito (Success):** Mensaje terminal de confirmación `> MENSAJE RECIBIDO. TE RESPONDEREMOS PRONTO. GRACIAS, [NOMBRE].` y botón retro `ENVIAR OTRO MENSAJE` para reiniciar el estado.
    - **Error (Failure):** Línea terminal de error `[FAIL] Error en la transmisión: [motivo]` con botón para reintentar sin borrar la información previamente escrita.
- **6. Backend con Resend y Server Actions:**
  - Instalación y configuración de la librería oficial `resend`.
  - Server Action en `app/actions/contact.ts` para procesar el envío de forma segura en el servidor.
  - Validación de parámetros y filtrado de bots vía honeypot en el servidor.
  - Envío de correo HTML formateado con estilo retro al buzón del equipo configurado en variables de entorno.
  - Manejo de entorno de desarrollo sin clave configurada (modo simulado con logging claro para pruebas locales sin romper la UI).
- **7. Configuración de Variables de Entorno:**
  - Adición de variables requeridas en `.env.example`:
    - `RESEND_API_KEY`: Clave API obtenida en la consola de Resend.
    - `RESEND_FROM_EMAIL`: Remitente verificado o por defecto de pruebas (`onboarding@resend.dev` o `Arcade Vault <contacto@tudominio.com>`).
    - `CONTACT_NOTIFICATION_EMAIL`: Correo receptor del equipo donde llegarán los mensajes.

### Fuera del alcance
- Respuestas automáticas (auto-reply) enviadas al usuario remitente.
- Almacenamiento persistente de mensajes en base de datos (PostgreSQL u otra DB); los mensajes se entregan exclusivamente vía email.
- Sistema de captcha visual con retos complejos (reCAPTCHA/Turnstile); se utiliza honeypot ligero sin fricción.

---

## Modelo de Datos y Tipos

Definición de estructuras TypeScript en `types/contact.ts`:

```typescript
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

export type ContactActionState = {
  status: "idle" | "success" | "error";
  message?: string;
  senderName?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export interface HighlightCardItem {
  icon: "HEART" | "BROWSER" | "PLANT";
  text: string;
  color: "magenta" | "cyan" | "green";
}
```

---

## Plan de Implementación

1. **Dependencias y Configuración de Entorno:**
   - Instalar `resend` mediante `npm install resend`.
   - Definir los tipos en `types/contact.ts`.
   - Documentar las variables en `.env.example` y crear plantilla local.

2. **Server Action para Envío de Correo (`app/actions/contact.ts`):**
   - Implementar `sendContactMessageAction(prevState, formData)` con `"use server"`.
   - Validar presencia y formato de `name`, `email` y `message`.
   - Descartar silenciosamente peticiones que completen el campo trampa `honeypot`.
   - Inicializar el cliente Resend con `process.env.RESEND_API_KEY`.
   - Si no hay API key definida en entorno local/desarrollo, simular un retardo de 600ms y registrar en consola con advertencia amigable sin lanzar error fatal.
   - Enviar email con plantilla HTML formateada usando `resend.emails.send()`.
   - Devolver `ContactActionState` con status `success` o `error`.

3. **Componentes Modulares de la Interfaz (`components/about/`):**
   - `AboutHero.tsx`: Encabezado, kicker, título y descripción de misión.
   - `HighlightList.tsx`: Grid de las 3 tarjetas de características con sus iconos SVG retro pixel art.
   - `AboutDivider.tsx`: Marquesina de bloques pixelados con animaciones en cascada.
   - `ContactIntro.tsx`: Kicker, título, descripción y los tres indicadores LED retro.
   - `VaultTerminal.tsx`: Consola retro estilo UNIX/MS-DOS con soporte para estados de conexión, éxito y error con reintento.
   - `ContactForm.tsx`: Formulario cliente con campos controlados, soporte para el campo oculto honeypot, efecto `shake` y llamada a la Server Action.

4. **Página Principal About (`app/about/page.tsx`):**
   - Componer la vista completa integrando los módulos creados.
   - Añadir metadata SEO para la página ("Acerca de Arcade Vault - Misión y Contacto").
   - Verificar y afinar clases Tailwind v4 y variables neón en `app/globals.css`.

5. **Verificación y Calidad:**
   - Verificar responsive design (móvil, tablet y escritorio).
   - Probar validaciones en cliente (campos vacíos, emails inválidos) y servidor.
   - Probar envío exitoso con y sin clave real de Resend.
   - Comprobar que `npm run build` y `npm run lint` pasen satisfactoriamente.

---

## Criterios de Aceptación

- [ ] La ruta `/about` es accesible y el enlace en el `Navbar` global se marca como activo al visitarla.
- [ ] La sección Hero muestra el título, la misión y las 3 tarjetas con iconos vectoriales pixel art acordes a `references/home-about/about.jsx`.
- [ ] El divisor ornamental reproduce la animación de marquesina pixel neón.
- [ ] El formulario de contacto valida campos obligatorios y formato de correo, ejecutando la animación `shake` ante entradas inválidas.
- [ ] El envío del formulario activa la terminal retro `VAULT-OS // TERMINAL` mostrando el proceso y mensaje de agradecimiento personalizado con el nombre del usuario.
- [ ] Ante errores de red o fallo en el servicio de correo, la terminal muestra el mensaje de fallo y permite reintentar sin borrar el contenido.
- [ ] El backend utiliza una Server Action de Next.js (`app/actions/contact.ts`) con la librería `resend`.
- [ ] Si la clave `RESEND_API_KEY` no está configurada en desarrollo local, el sistema no colapsa y maneja el flujo de manera amigable mediante simulación con log de consola.
- [ ] Las variables de entorno `RESEND_API_KEY`, `RESEND_FROM_EMAIL` y `CONTACT_NOTIFICATION_EMAIL` están debidamente documentadas en `.env.example`.
- [ ] `npm run build` y `npm run lint` compilan sin errores de TypeScript ni advertencias bloqueantes.

---

## Decisiones Tomadas y Descartadas

- **Tomada: Next.js Server Action en lugar de Route Handler (/api/contact):**  
  *Justificación:* Simplifica el manejo de estado en React 19 / Next.js 16, evita boilerplate de peticiones HTTP `fetch` manuales y aprovecha la seguridad intrínseca del servidor de Next.js sin exponer credenciales.
- **Tomada: Manejo de retroalimentación integrado en la terminal retro VAULT-OS:**  
  *Justificación:* Mantiene la inmersión temática retro establecida en el template de referencia sin recurrir a notificaciones toast genéricas fuera de tono.
- **Tomada: Protección con campo honeypot invisible:**  
  *Justificación:* Brinda un primer nivel de defensa eficaz contra bots de spam sin añadir desafíos molestos (captchas) que afecten la estética visual o la experiencia del jugador.
- **Tomada: Modo de desarrollo simulado cuando no hay API Key:**  
  *Justificación:* Permite a cualquier desarrollador clonar el proyecto y probar la interfaz completa sin verse bloqueado por no disponer inmediatamente de una cuenta o token de Resend activo.
- **Descartada: Auto-respuesta por correo al usuario:**  
  *Justificación:* En dominios no verificados o cuentas gratuitas de Resend iniciales (dominio sandbox `onboarding@resend.dev`), solo se permite enviar correos a la dirección del propietario de la cuenta, lo cual generaría fallos si se intenta enviar a remitentes arbitrarios.

---

## Riesgos Identificados

- **Restricción de dominios no verificados en Resend:** En fase de pruebas, Resend únicamente permite enviar correos al email asociado a la cuenta del desarrollador si se utiliza `onboarding@resend.dev`. Se documenta claramente en `.env.example` para evitar confusiones.
- **Límites de tasa (Rate Limiting) de la API de Resend:** Si el endpoint recibe ráfagas de envíos, Resend podría responder con código 429. Se captura la excepción en la Server Action para desplegar un mensaje amigable en la terminal retro.
