import type { Metadata } from "next";
import "./globals.css";
import { ToastProvider } from "@/components/ui/Toast";
import { ConfirmProvider } from "@/components/ui/ConfirmDialog";
import { ValidationProvider } from "@/components/ui/ValidationModal";
import Topbar from "@/components/Topbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "UI Components Playground",
  description: "Playground komponen UI",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

function ThemeInitScript() {
  // Inline theme init to avoid FOUC
  return (
    <script
      dangerouslySetInnerHTML={{
        __html: `(function(){
  try{
    var t=localStorage.getItem('theme');
    var validThemes=['light','system','dark'];
    if(!t||!validThemes.includes(t))t='system';
    var systemDark=window.matchMedia&&window.matchMedia('(prefers-color-scheme: dark)').matches;
    var actualTheme=t==='system'?(systemDark?'dark':'light'):t;
    document.documentElement.setAttribute('data-theme',actualTheme);
    document.documentElement.style.colorScheme=actualTheme;
  }catch(e){}
})();`,
      }}
    />
  );
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="color-scheme" content="light dark" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <ThemeInitScript />
      </head>
      <body className="antialiased font-sans">
        <ToastProvider>
          <ConfirmProvider>
            <ValidationProvider>
              <Topbar />
              {children}
              <Footer />
            </ValidationProvider>
          </ConfirmProvider>
        </ToastProvider>
      </body>
    </html>
  );
}
