import { MessageCircle } from "lucide-react";
import { site } from "@/data/site";

export function WhatsAppFab() {
  return (
    <a
      href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent("Hi Rajbiosis, I'd like to enquire about your products.")}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[oklch(0.68_0.17_152)] text-white shadow-elegant hover:scale-110 transition-smooth animate-float"
    >
      <MessageCircle className="h-6 w-6" />
    </a>
  );
}
