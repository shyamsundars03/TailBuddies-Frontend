import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Toaster } from "sonner";
import { ReduxProvider } from "../lib/redux/provider";
import { AuthLoader } from "../lib/providers/AuthLoader";
import { NotificationSocketHandler } from "../components/common/NotificationSocketHandler";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "TailBuddies",
  description: "Your pet care companion",
};

import ErrorBoundary from "../components/error/ErrorBoundary";
import ErrorFallback from "../components/error/ErrorFallback";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ReduxProvider>
          <AuthLoader>
            <ErrorBoundary fallback={<ErrorFallback />}>
              <NotificationSocketHandler />
              {children}
              <Toaster richColors position="top-right" />
            </ErrorBoundary>
          </AuthLoader>
        </ReduxProvider>
      </body>
    </html>
  );
}

