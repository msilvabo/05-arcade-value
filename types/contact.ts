export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

export type ContactActionState = {
  status: "idle" | "loading" | "success" | "error";
  message?: string;
  senderName?: string;
  errors?: {
    name?: string[];
    email?: string[];
    message?: string[];
  };
};

export interface HighlightCardItem {
  icon: "HEART" | "BROWSER" | "PLANT";
  text: string;
  color: "magenta" | "cyan" | "green";
}
