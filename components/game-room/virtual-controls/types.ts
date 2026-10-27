export type TouchControlMode = "auto" | "on" | "off";

export type VirtualActionKey =
  | "ArrowUp"
  | "ArrowDown"
  | "ArrowLeft"
  | "ArrowRight"
  | "Space"
  | "KeyW"
  | "KeyA"
  | "KeyS"
  | "KeyD"
  | "KeyC"
  | "KeyT"
  | "Escape";

export interface VirtualButtonConfig {
  id: string;
  label: string;
  sublabel?: string;
  icon?: string;
  key: VirtualActionKey;
  keyCode?: string;
  color: "cyan" | "magenta" | "amber" | "green" | "surface";
  size?: "sm" | "md" | "lg";
}

export type DpadLayoutType = "4-way" | "2-way-horizontal" | "none";

export interface GameVirtualControlsConfig {
  gameId: string;
  dpadType: DpadLayoutType;
  primaryButtons: VirtualButtonConfig[];
  secondaryButtons?: VirtualButtonConfig[];
  directTouchCanvas?: boolean;
}
