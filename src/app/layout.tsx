import type { Metadata } from "next";
import localFont from "next/font/local";

import { DevCycleClientsideProvider } from "@devcycle/nextjs-sdk";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { SiteHeader } from "@/components/layout/site-header";
import { AuthProvider } from "@/components/providers/auth-provider";
import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryProvider } from "@/lib/react-query/provider";

import { getClientContext } from "../lib/devcycle/config";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});

const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  title: "FlagFeed",
  description: "Gamified learning platform with feature flags & RSS feeds",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
          <DevCycleClientsideProvider context={getClientContext()}>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              <ReactQueryProvider>
                <div className="relative flex min-h-screen flex-col">
                  <SiteHeader />
                  <main className="flex-1">{children}</main>
                </div>
                <ReactQueryDevtools initialIsOpen={false} />
              </ReactQueryProvider>
              <Toaster />
            </ThemeProvider>
          </DevCycleClientsideProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
