import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ConvexAuthNextjsServerProvider } from "@convex-dev/auth/nextjs/server";
import ConvexClientProvider from "@/providers/ConvexClientProvider";
// import { SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
// We need to implement SignIn/SignedIn/SignedOut or use Convex Auth helpers
// For now, let's keep the structure but we need equivalent components.
// @convex-dev/auth does NOT provide SignIn/SignedIn components out of the box for Next.js layout like Clerk does.
// We need to handle this differently.
import { AuthWrapper } from "@/components/auth/AuthWrapper";

import { ModalProvider } from "@/providers/ModelProvider";
import { AlertProvider } from "@/providers/AlertProvider";
import { ViewTransitions } from "next-view-transitions";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Ritualize",
  description: "Routine app",
  manifest: "/manifest.json",
  icons: { apple: "/icon.png" },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: "overlays-content",
};

export default function RootLayout({
  children,
  model,
}: Readonly<{
  children: React.ReactNode;
  model: React.ReactNode;
}>) {
  return (
    <ViewTransitions>
      <ConvexAuthNextjsServerProvider>
        <html lang="en" suppressHydrationWarning>
          <head>
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" />
            <link
              href="https://fonts.googleapis.com/css2?family=Funnel+Display:wght@300..800&display=swap"
              rel="stylesheet"
            />
          </head>
          <body className={inter.className}>
            <ConvexClientProvider>
              <ReactQueryProvider>
                <ThemeProvider
                  attribute="class"
                  forcedTheme="dark"
                  defaultTheme="dark"
                >
                  <AlertProvider>
                    <ModalProvider>
                      <AuthWrapper model={model}>{children}</AuthWrapper>
                      <Toaster />
                    </ModalProvider>
                  </AlertProvider>
                </ThemeProvider>
              </ReactQueryProvider>
            </ConvexClientProvider>
          </body>
        </html>
      </ConvexAuthNextjsServerProvider>
    </ViewTransitions>
  );
}
