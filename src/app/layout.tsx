import type { Metadata, Viewport } from "next";
import { Inter, Fira_Code } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
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

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });
const firaCode = Fira_Code({ subsets: ["latin"], variable: "--font-mono" });

export const metadata: Metadata = {
  title: "Ritualize",
  description: "Routine app",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
    ],
    apple: "/icon.png",
  },
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
          <body className={`${inter.variable} ${firaCode.variable} font-sans`}>
            <ConvexClientProvider>
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
            </ConvexClientProvider>
          </body>
        </html>
      </ConvexAuthNextjsServerProvider>
    </ViewTransitions>
  );
}
