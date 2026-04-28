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
            <NotificationSocketHandler />
            {children}
            <Toaster richColors position="top-right" />
          </AuthLoader>
        </ReduxProvider>
      </body>
    </html>
  );
}

