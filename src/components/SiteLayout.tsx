import { Navbar } from "./Navbar";

import { Footer } from "./Footer";

// import { WhatsAppFab } from "./WhatsAppFab";

interface SiteLayoutProps {
  children: React.ReactNode;
  district?: string;
}

export function SiteLayout({
  children,
  district,
}: SiteLayoutProps) {

  return (
    <div className="min-h-screen flex flex-col">

      <Navbar district={district} />

      <main className="flex-1">

        {children}

      </main>

      <Footer />

      {/* <WhatsAppFab /> */}

    </div>
  );
}