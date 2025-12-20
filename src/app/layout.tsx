import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
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
          <ClerkProvider
            appearance={{
              baseTheme: [dark],
            }}
          >
            <ReactQueryProvider>
              <ThemeProvider
                attribute="class"
                forcedTheme="dark"
                defaultTheme="dark"
              >
                <AlertProvider>
                  <ModalProvider>
                    <SignedOut>
                      <div className="grid place-items-center h-[100svh]">
                        <SignIn />
                      </div>
                    </SignedOut>
                    <SignedIn>
                      {children}
                      {model}
                    </SignedIn>
                    <Toaster />
                  </ModalProvider>
                </AlertProvider>
              </ThemeProvider>
            </ReactQueryProvider>
          </ClerkProvider>
        </body>
      </html>
    </ViewTransitions>
  );
}
