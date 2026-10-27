import { VirtualActionKey } from "./types";

interface KeyDetail {
  key: string;
  code: string;
  keyCode: number;
}

const KEY_DETAILS_MAP: Record<VirtualActionKey, KeyDetail> = {
  ArrowUp: { key: "ArrowUp", code: "ArrowUp", keyCode: 38 },
  ArrowDown: { key: "ArrowDown", code: "ArrowDown", keyCode: 40 },
  ArrowLeft: { key: "ArrowLeft", code: "ArrowLeft", keyCode: 37 },
  ArrowRight: { key: "ArrowRight", code: "ArrowRight", keyCode: 39 },
  Space: { key: " ", code: "Space", keyCode: 32 },
  KeyW: { key: "w", code: "KeyW", keyCode: 87 },
  KeyA: { key: "a", code: "KeyA", keyCode: 65 },
  KeyS: { key: "s", code: "KeyS", keyCode: 83 },
  KeyD: { key: "d", code: "KeyD", keyCode: 68 },
  KeyC: { key: "c", code: "KeyC", keyCode: 67 },
  KeyT: { key: "t", code: "KeyT", keyCode: 84 },
  Escape: { key: "Escape", code: "Escape", keyCode: 27 },
};

// Registro de teclas activas para evitar spam o desfase de estados
const activeKeys = new Set<VirtualActionKey>();

/**
 * Emite feedback háptico sutil si el dispositivo y navegador lo soportan
 */
export function triggerHaptic(durationMs: number = 15): void {
  if (typeof window === "undefined" || typeof navigator === "undefined") return;
  try {
    if (typeof navigator.vibrate === "function") {
      navigator.vibrate(durationMs);
    }
  } catch {
    // Silenciar si está bloqueado por permisos del navegador
  }
}

/**
 * Sintetiza un evento KeyboardEvent nativo para simular pulsación física de tecla
 */
export function pressKey(
  key: VirtualActionKey,
  options?: { repeat?: boolean; skipHaptic?: boolean }
): void {
  if (typeof window === "undefined") return;

  const isAlreadyActive = activeKeys.has(key);
  if (isAlreadyActive && !options?.repeat) {
    return;
  }

  activeKeys.add(key);

  const detail = KEY_DETAILS_MAP[key] || {
    key,
    code: key,
    keyCode: 0,
  };

  const event = new KeyboardEvent("keydown", {
    key: detail.key,
    code: detail.code,
    keyCode: detail.keyCode,
    which: detail.keyCode,
    bubbles: true,
    cancelable: true,
    repeat: !!options?.repeat,
  });

  window.dispatchEvent(event);

  if (!options?.skipHaptic) {
    triggerHaptic(15);
  }
}

/**
 * Sintetiza un evento KeyboardEvent keyup nativo al soltar el botón táctil
 */
export function releaseKey(key: VirtualActionKey): void {
  if (typeof window === "undefined") return;

  if (!activeKeys.has(key)) {
    return;
  }

  activeKeys.delete(key);

  const detail = KEY_DETAILS_MAP[key] || {
    key,
    code: key,
    keyCode: 0,
  };

  const event = new KeyboardEvent("keyup", {
    key: detail.key,
    code: detail.code,
    keyCode: detail.keyCode,
    which: detail.keyCode,
    bubbles: true,
    cancelable: true,
  });

  window.dispatchEvent(event);
}

/**
 * Libera todas las teclas retenidas (útil en blur, unmount o pausa)
 */
export function releaseAllKeys(): void {
  if (typeof window === "undefined") return;

  const keysToRelease = Array.from(activeKeys);
  keysToRelease.forEach((key) => releaseKey(key));
  activeKeys.clear();
}

/**
 * Consulta si una tecla virtual está actualmente presionada
 */
export function isKeyPressed(key: VirtualActionKey): boolean {
  return activeKeys.has(key);
}
