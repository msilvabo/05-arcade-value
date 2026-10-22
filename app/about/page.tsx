import type { Metadata } from "next";
import { AboutView } from "@/components/about/AboutView";

export const metadata: Metadata = {
  title: "Acerca de | Arcade Vault",
  description:
    "Conoce la historia y misión de Arcade Vault: preservar la era dorada de los videojuegos clásicos con emulación moderna y 100% gratuita.",
  openGraph: {
    title: "Acerca de Arcade Vault",
    description:
      "Nuestra misión es preservar y celebrar los videojuegos clásicos de arcade, haciéndolos accesibles para todos en la web.",
  },
};

export default function AboutPage() {
  return <AboutView />;
}
