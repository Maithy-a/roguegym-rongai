import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";

export const metadata: Metadata = {
  title: "Rogue Gym Management System",
  description: "A gym management system built with Next.js and TypeScript.",
  icons: {
    icon: "/icons/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ClerkProvider appearance={{ variables: { colorPrimary: "#fb923c" } }} >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}