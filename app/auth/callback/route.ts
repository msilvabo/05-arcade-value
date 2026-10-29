import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

/**
 * Route Handler para procesar el flujo de autenticación PKCE
 * tras confirmación de correo o inicio de sesión con proveedores OAuth (Google/GitHub).
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const error = searchParams.get("error");
  const errorDescription = searchParams.get("error_description");
  const next = searchParams.get("next") || "/";

  // Si Supabase o el proveedor OAuth retornaron un error directo
  if (error || errorDescription) {
    const redirectUrl = new URL("/auth", origin);
    if (error) redirectUrl.searchParams.set("error", error);
    if (errorDescription) redirectUrl.searchParams.set("error_description", errorDescription);
    return NextResponse.redirect(redirectUrl.toString());
  }

  if (code) {
    const supabase = await createClient();
    const { error: exchangeError } = await supabase.auth.exchangeCodeForSession(code);

    if (!exchangeError) {
      const forwardedHost = request.headers.get("x-forwarded-host");
      const isLocalEnv = process.env.NODE_ENV === "development";

      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    } else {
      const redirectUrl = new URL("/auth", origin);
      redirectUrl.searchParams.set("error", "auth_code_error");
      redirectUrl.searchParams.set("error_description", exchangeError.message);
      return NextResponse.redirect(redirectUrl.toString());
    }
  }

  // Si no se proporcionó código ni error
  return NextResponse.redirect(`${origin}/auth?error=missing_code`);
}
