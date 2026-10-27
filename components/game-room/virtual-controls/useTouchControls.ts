"use client";

import { useState, useEffect, useCallback } from "react";
import { TouchControlMode } from "./types";

const STORAGE_KEY = "arcade_vault_touch_controls_mode";

export interface UseTouchControlsReturn {
  mode: TouchControlMode;
  setMode: (mode: TouchControlMode) => void;
  cycleMode: () => void;
  isTouchActive: boolean;
  hasHardwareTouch: boolean;
  orientation: "portrait" | "landscape";
}

export function useTouchControls(): UseTouchControlsReturn {
  // Inicialización lazy de modo desde localStorage
  const [mode, setModeState] = useState<TouchControlMode>(() => {
    if (typeof window === "undefined") return "auto";
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "auto" || stored === "on" || stored === "off") {
        return stored;
      }
    } catch {
      // Ignorar restricciones en iframes o sandbox
    }
    return "auto";
  });

  // Inicialización lazy de soporte táctil de hardware
  const [hasHardwareTouch, setHasHardwareTouch] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    const hasCoarsePointer =
      window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
    const maxTouchPoints =
      typeof navigator !== "undefined" ? navigator.maxTouchPoints || 0 : 0;
    const hasTouchEvents = "ontouchstart" in window;
    return !!(hasCoarsePointer || maxTouchPoints > 0 || hasTouchEvents);
  });

  // Inicialización lazy de orientación
  const [orientation, setOrientation] = useState<"portrait" | "landscape">(
    () => {
      if (typeof window === "undefined") return "landscape";
      return window.innerHeight > window.innerWidth ? "portrait" : "landscape";
    }
  );

  // Escuchar cambios externos de orientación o redimensión
  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleResize = () => {
      const isPortrait =
        window.innerHeight > window.innerWidth ||
        (window.matchMedia &&
          window.matchMedia("(orientation: portrait)").matches);
      setOrientation(isPortrait ? "portrait" : "landscape");

      // Re-verificar coarse pointer si se alternó emulación en DevTools
      const hasCoarse =
        window.matchMedia && window.matchMedia("(pointer: coarse)").matches;
      const maxPts = navigator.maxTouchPoints || 0;
      setHasHardwareTouch(
        !!(hasCoarse || maxPts > 0 || "ontouchstart" in window)
      );
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("orientationchange", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("orientationchange", handleResize);
    };
  }, []);

  const setMode = useCallback((newMode: TouchControlMode) => {
    setModeState(newMode);
    try {
      localStorage.setItem(STORAGE_KEY, newMode);
    } catch {
      // Ignorar restricciones
    }
  }, []);

  const cycleMode = useCallback(() => {
    setModeState((current) => {
      let next: TouchControlMode = "auto";
      if (current === "auto") next = "on";
      else if (current === "on") next = "off";
      else if (current === "off") next = "auto";

      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Ignorar
      }
      return next;
    });
  }, []);

  const isTouchActive = mode === "on" || (mode === "auto" && hasHardwareTouch);

  return {
    mode,
    setMode,
    cycleMode,
    isTouchActive,
    hasHardwareTouch,
    orientation,
  };
}
