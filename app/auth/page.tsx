import { Suspense } from "react";
import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Autenticación // Arcade Vault",
  description: "Sistema de identificación de pilotos arcade. Inicia sesión o regístrate para competir.",
};

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-space-md pt-28 pb-12 relative">
      <Suspense
        fallback={
          <div className="p-space-lg bg-surface-container-low rounded border border-primary-container/20 text-center font-mono text-primary animate-pulse tracking-widest uppercase">
            CARGANDO TERMINAL ARCADE...
          </div>
        }
      >
        <AuthCard />
      </Suspense>
    </main>
  );
}
