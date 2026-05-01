import { Navbar } from "./Navbar";
import { Footer } from "./Footer";
// import { WhatsAppFab } from "./WhatsAppFab";

export function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      {/* <WhatsAppFab /> */}
    </div>
  );
}
