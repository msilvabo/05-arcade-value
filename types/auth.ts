export interface AuthUserSession {
  id: string;
  email: string;
  gamerTag: string;
  avatarUrl?: string | null;
}

export type AuthMode = "login" | "register" | "forgot-password";

export interface AuthActionResult {
  success: boolean;
  message?: string;
  error?: string;
  requiresEmailVerification?: boolean;
}

export interface SignUpPayload {
  email: string;
  password: string;
  gamerTag: string;
}

export interface SignInPayload {
  email: string;
  password: string;
}

export type SocialAuthProvider = "google" | "github";
