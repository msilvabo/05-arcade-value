import React from "react";
import { ContactIntro } from "./ContactIntro";
import { ContactForm } from "./ContactForm";

export function ContactSection() {
  return (
    <section className="max-w-[1200px] mx-auto mb-20 px-6">
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-10 items-start">
        <ContactIntro />
        <ContactForm />
      </div>
    </section>
  );
}
