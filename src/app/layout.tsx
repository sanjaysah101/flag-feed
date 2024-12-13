import type { Metadata } from "next";
import localFont from "next/font/local";

// import { DevCycleClientsideProvider } from "@devcycle/nextjs-sdk";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import { ThemeProvider } from "@/components/theme";
import { Toaster } from "@/components/ui/toaster";
import { ReactQueryProvider } from "@/lib/react-query/provider";

import { FeatureFlagsProvider } from "../components/providers/feature-flags-provider";
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
      <body className={`${geistSans.variable} ${geistMono.variable} min-h-screen bg-background antialiased`}>
        <FeatureFlagsProvider>
          <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
            <ReactQueryProvider>
              {children}
              <ReactQueryDevtools initialIsOpen={false} />
            </ReactQueryProvider>
            <Toaster />
          </ThemeProvider>
        </FeatureFlagsProvider>
      </body>
    </html>
  );
}
