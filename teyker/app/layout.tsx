import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Teyker",
  description: "E-commerce moderno y elegante",
  icons: {
    icon: "/teykerLogo.ico",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="font-sans antialiased bg-[#f8f9fa] text-primary-gray">
        {children}
      </body>
    </html>
  );
}
