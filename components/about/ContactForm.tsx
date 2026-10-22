"use client";

import React, { useState, useTransition } from "react";
import { sendContactMessageAction } from "@/app/actions/contact";
import type { ContactActionState } from "@/types/contact";
import { VaultTerminal } from "./VaultTerminal";

export function ContactForm() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });

  const [fieldErrors, setFieldErrors] = useState<{
    name?: string;
    email?: string;
    message?: string;
  }>({});

  const [shake, setShake] = useState(false);
  const [terminalView, setTerminalView] = useState<"hidden" | "loading" | "success" | "error">("hidden");
  const [terminalMessage, setTerminalMessage] = useState<string>("");
  const [sentSenderName, setSentSenderName] = useState<string>("");
  const [, startTransition] = useTransition();

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 450);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { name?: string; email?: string; message?: string } = {};
    if (!formData.name.trim()) {
      errors.name = "Indica tu nombre o alias de jugador.";
    }
    if (!formData.email.trim()) {
      errors.email = "Indica tu correo de contacto.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
      errors.email = "Formato de correo no válido.";
    }
    if (!formData.message.trim()) {
      errors.message = "Escribe un mensaje para continuar.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      triggerShake();
      return;
    }

    // Cambiar a terminal en estado "loading"
    setSentSenderName(formData.name.trim());
    setTerminalView("loading");

    const payload = new FormData();
    payload.append("name", formData.name.trim());
    payload.append("email", formData.email.trim());
    payload.append("message", formData.message.trim());
    if (formData.honeypot) {
      payload.append("honeypot", formData.honeypot);
    }

    startTransition(async () => {
      try {
        const response: ContactActionState = await sendContactMessageAction(
          { status: "idle" },
          payload
        );

        if (response.status === "success") {
          setTerminalView("success");
          if (response.senderName) {
            setSentSenderName(response.senderName);
          }
        } else {
          setTerminalView("error");
          setTerminalMessage(
            response.message || "No se pudo transmitir el mensaje. Revisa los datos e intenta de nuevo."
          );
        }
      } catch (err: unknown) {
        setTerminalView("error");
        setTerminalMessage(
          err instanceof Error ? err.message : "Error inesperado de conexión con el servidor."
        );
      }
    });
  };

  const handleReset = () => {
    setFormData({ name: "", email: "", message: "", honeypot: "" });
    setFieldErrors({});
    setTerminalView("hidden");
    setTerminalMessage("");
    setSentSenderName("");
  };

  const handleRetry = () => {
    setTerminalView("hidden");
  };

  if (terminalView !== "hidden") {
    return (
      <VaultTerminal
        status={terminalView}
        senderName={sentSenderName}
        errorMessage={terminalMessage}
        onReset={handleReset}
        onRetry={handleRetry}
      />
    );
  }

  return (
    <div
      className={`relative p-6 sm:p-7 bg-[var(--color-bg-2,#10111a)] border border-[var(--color-line,#1e2235)] transition-transform duration-100 ${
        shake ? "shake" : ""
      }`}
    >
      {/* Marco decorativo retro dashed interno */}
      <div
        className="absolute inset-1 pointer-events-none border border-dashed border-[var(--color-cyan,#00f0ff)]/20"
        aria-hidden="true"
      />

      <form onSubmit={handleSubmit} noValidate className="relative z-10 flex flex-col gap-4.5 text-left">
        {/* Campo trampa Honeypot anti-spam invisible */}
        <div className="hidden" aria-hidden="true">
          <label htmlFor="hp_field">No llenar este campo</label>
          <input
            id="hp_field"
            type="text"
            name="honeypot"
            value={formData.honeypot}
            onChange={handleInputChange}
            tabIndex={-1}
            autoComplete="off"
          />
        </div>

        {/* Campo Nombre */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-name"
            className="font-pixel text-[10px] tracking-wider text-[var(--color-ink,#f8fafc)] select-none"
          >
            NOMBRE / GAMERTAG <span className="text-[var(--color-cyan,#00f0ff)]">*</span>
          </label>
          <input
            id="contact-name"
            name="name"
            type="text"
            required
            placeholder="px_kai"
            value={formData.name}
            onChange={handleInputChange}
            className={`w-full px-3.5 py-2.5 bg-black/60 border text-sm font-mono text-white placeholder-[var(--color-ink-faint,#64748b)] outline-none transition-all duration-150 ${
              fieldErrors.name
                ? "border-[var(--color-magenta,#ff007f)] shadow-[0_0_8px_rgba(255,0,127,0.4)]"
                : "border-[var(--color-line,#1e2235)] focus:border-[var(--color-cyan,#00f0ff)] focus:shadow-[0_0_10px_rgba(0,240,255,0.35)]"
            }`}
          />
          {fieldErrors.name && (
            <span className="text-xs font-mono text-[var(--color-magenta,#ff007f)]">
              {fieldErrors.name}
            </span>
          )}
        </div>

        {/* Campo Correo */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-email"
            className="font-pixel text-[10px] tracking-wider text-[var(--color-ink,#f8fafc)] select-none"
          >
            CORREO ELECTRÓNICO <span className="text-[var(--color-cyan,#00f0ff)]">*</span>
          </label>
          <input
            id="contact-email"
            name="email"
            type="email"
            required
            placeholder="jugador@vault.gg"
            value={formData.email}
            onChange={handleInputChange}
            className={`w-full px-3.5 py-2.5 bg-black/60 border text-sm font-mono text-white placeholder-[var(--color-ink-faint,#64748b)] outline-none transition-all duration-150 ${
              fieldErrors.email
                ? "border-[var(--color-magenta,#ff007f)] shadow-[0_0_8px_rgba(255,0,127,0.4)]"
                : "border-[var(--color-line,#1e2235)] focus:border-[var(--color-cyan,#00f0ff)] focus:shadow-[0_0_10px_rgba(0,240,255,0.35)]"
            }`}
          />
          {fieldErrors.email && (
            <span className="text-xs font-mono text-[var(--color-magenta,#ff007f)]">
              {fieldErrors.email}
            </span>
          )}
        </div>

        {/* Campo Mensaje */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="contact-message"
            className="font-pixel text-[10px] tracking-wider text-[var(--color-ink,#f8fafc)] select-none"
          >
            MENSAJE <span className="text-[var(--color-cyan,#00f0ff)]">*</span>
          </label>
          <textarea
            id="contact-message"
            name="message"
            required
            rows={5}
            placeholder="Cuéntanos qué tienes en mente…"
            value={formData.message}
            onChange={handleInputChange}
            className={`w-full px-3.5 py-2.5 bg-black/60 border text-sm font-mono text-white placeholder-[var(--color-ink-faint,#64748b)] outline-none resize-y min-h-[110px] transition-all duration-150 ${
              fieldErrors.message
                ? "border-[var(--color-magenta,#ff007f)] shadow-[0_0_8px_rgba(255,0,127,0.4)]"
                : "border-[var(--color-line,#1e2235)] focus:border-[var(--color-cyan,#00f0ff)] focus:shadow-[0_0_10px_rgba(0,240,255,0.35)]"
            }`}
          />
          {fieldErrors.message && (
            <span className="text-xs font-mono text-[var(--color-magenta,#ff007f)]">
              {fieldErrors.message}
            </span>
          )}
        </div>

        {/* Botón de Enviar */}
        <button
          type="submit"
          className="w-full mt-2 py-3 px-6 bg-[var(--color-cyan,#00f0ff)] text-black font-pixel text-xs tracking-widest font-bold hover:bg-white hover:shadow-[0_0_16px_rgba(0,240,255,0.6)] active:translate-y-0.5 transition-all duration-150 cursor-pointer select-none"
        >
          ▶ ENVIAR MENSAJE
        </button>
      </form>
    </div>
  );
}
