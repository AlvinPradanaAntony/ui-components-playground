import type { Metadata } from "next";
import "./globals.css";
export const metadata: Metadata = { title: "UI Components Playground", description: "Playground komponen UI" };
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (<html lang="id" suppressHydrationWarning><body>{children}</body></html>);
}
