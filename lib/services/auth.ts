import { createClient } from "@/lib/supabase/client";
import {
  AuthActionResult,
  AuthUserSession,
  SignInPayload,
  SignUpPayload,
  SocialAuthProvider,
} from "@/types/auth";
import { ProfileRow } from "@/types/database";

/**
 * Traduce mensajes de error técnicos de Supabase a mensajes temáticos arcade.
 */
function mapAuthErrorToArcadeMessage(errorMsg: string): string {
  const normalized = errorMsg.toLowerCase();
  if (normalized.includes("invalid login credentials")) {
    return "CREDENCIALES INVÁLIDAS // VERIFICA EMAIL, CONTRASEÑA O SI CONFIRMASTE TU CORREO";
  }
  if (normalized.includes("email not confirmed")) {
    return "CORREO NO CONFIRMADO // VALIDA EL ENLACE ENVIADO A TU BANDEJA";
  }
  if (normalized.includes("user already registered")) {
    return "ESTE CORREO YA POSEE UNA LICENCIA DE PILOTO ACTIVA";
  }
  if (normalized.includes("password should be at least")) {
    return "LA CONTRASEÑA DEBE TENER AL MENOS 6 CARACTERES";
  }
  if (normalized.includes("rate limit") || normalized.includes("too many requests")) {
    return "TERMINAL BLOQUEADO TEMPORALMENTE POR EXCESO DE INTENTOS";
  }
  return `ERROR DEL TERMINAL // ${errorMsg.toUpperCase()}`;
}

/**
 * Registra un nuevo piloto en Supabase Auth con su gamer_tag en la metadata.
 */
export async function signUpPilot({
  email,
  password,
  gamerTag,
}: SignUpPayload): Promise<AuthActionResult> {
  try {
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const { data, error } = await supabase.auth.signUp({
      email: email.trim(),
      password,
      options: {
        data: {
          gamer_tag: gamerTag.trim(),
        },
        emailRedirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: mapAuthErrorToArcadeMessage(error.message),
      };
    }

    // Si Supabase devuelve usuario pero las identidades están vacías, suele significar email ya registrado
    if (data.user && Array.isArray(data.user.identities) && data.user.identities.length === 0) {
      return {
        success: false,
        error: "ESTE CORREO YA POSEE UNA LICENCIA DE PILOTO ACTIVA",
      };
    }

    const hasSession = !!data.session;
    const isConfirmed = !!data.user?.email_confirmed_at;

    return {
      success: true,
      requiresEmailVerification: !hasSession && !isConfirmed,
      message:
        hasSession || isConfirmed
          ? "¡REGISTRO EXITOSO! ACCEDIENDO AL VAULT..."
          : "¡REGISTRO RECIBIDO! TRANSMISIÓN DE VERIFICACIÓN ENVIADA A TU CORREO.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Fallo de conexión";
    return {
      success: false,
      error: mapAuthErrorToArcadeMessage(message),
    };
  }
}

/**
 * Inicia sesión con Email y Contraseña.
 */
export async function signInPilot({
  email,
  password,
}: SignInPayload): Promise<AuthActionResult> {
  try {
    const supabase = createClient();

    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password,
    });

    if (error) {
      return {
        success: false,
        error: mapAuthErrorToArcadeMessage(error.message),
      };
    }

    return {
      success: true,
      message: "¡CREDENCIALES VERIFICADAS! ACCEDIENDO AL VAULT...",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Fallo de conexión";
    return {
      success: false,
      error: mapAuthErrorToArcadeMessage(message),
    };
  }
}

/**
 * Autenticación federada con proveedores OAuth (Google, GitHub).
 */
export async function signInWithSocialProvider(
  provider: SocialAuthProvider
): Promise<AuthActionResult> {
  try {
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${origin}/auth/callback`,
      },
    });

    if (error) {
      return {
        success: false,
        error: mapAuthErrorToArcadeMessage(error.message),
      };
    }

    return {
      success: true,
      message: `CONECTANDO CON PROTOCOLO ${provider.toUpperCase()}...`,
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Fallo de conexión";
    return {
      success: false,
      error: mapAuthErrorToArcadeMessage(message),
    };
  }
}

/**
 * Cierra la sesión activa del piloto.
 */
export async function signOutPilot(): Promise<AuthActionResult> {
  try {
    const supabase = createClient();
    const { error } = await supabase.auth.signOut();

    if (error) {
      return {
        success: false,
        error: mapAuthErrorToArcadeMessage(error.message),
      };
    }

    return {
      success: true,
      message: "SESIÓN CERRADA // TERMINAL EN ESPERA",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Fallo de conexión";
    return {
      success: false,
      error: mapAuthErrorToArcadeMessage(message),
    };
  }
}

/**
 * Envía un correo con enlace mágico para reestablecer la contraseña.
 */
export async function sendPasswordResetEmail(
  email: string
): Promise<AuthActionResult> {
  try {
    const supabase = createClient();
    const origin = typeof window !== "undefined" ? window.location.origin : "";

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), {
      redirectTo: `${origin}/auth/callback?next=/auth/reset`,
    });

    if (error) {
      return {
        success: false,
        error: mapAuthErrorToArcadeMessage(error.message),
      };
    }

    return {
      success: true,
      message: "TRANSMISIÓN DE RECUPERACIÓN ENVIADA A TU BANDEJA.",
    };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Fallo de conexión";
    return {
      success: false,
      error: mapAuthErrorToArcadeMessage(message),
    };
  }
}

/**
 * Obtiene el perfil de sesión del piloto autenticado actual.
 */
export async function getCurrentPilotProfile(): Promise<AuthUserSession | null> {
  try {
    const supabase = createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    let gamerTag = (user.user_metadata?.gamer_tag as string | undefined)?.toUpperCase();
    let avatarUrl = (user.user_metadata?.avatar_url as string | undefined) || null;

    if (!gamerTag) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .maybeSingle();

      if (profile) {
        const p = profile as ProfileRow;
        gamerTag = p.gamer_tag;
        avatarUrl = p.avatar_url || avatarUrl;
      }
    }

    return {
      id: user.id,
      email: user.email || "",
      gamerTag: gamerTag || `PILOTO_${user.id.substring(0, 5).toUpperCase()}`,
      avatarUrl,
    };
  } catch (err) {
    console.warn("Aviso al obtener perfil del piloto:", err);
    return null;
  }
}
