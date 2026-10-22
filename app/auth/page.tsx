import { Metadata } from "next";
import { AuthCard } from "@/components/auth/AuthCard";

export const metadata: Metadata = {
  title: "Autenticación // Arcade Vault",
  description: "Sistema de identificación de pilotos arcade. Inicia sesión o regístrate para competir.",
};

export default function AuthPage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-space-md relative">
      <AuthCard />
    </main>
  );
}
