import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import RoutineProvider from "./(routine)/[id]/_provider/RoutineProvider";
import { ModalProvider } from "@/providers/ModelProvider";

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
        <html lang="en">
            <head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link
                    href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:ital,opsz@0,6..96;1,6..96&display=swap"
                    rel="stylesheet"
                />
            </head>
            <ClerkProvider
                appearance={{
                    baseTheme: [dark],
                }}>
                <ReactQueryProvider>
                    <ThemeProvider
                        attribute="class"
                        forcedTheme="dark"
                        defaultTheme="dark"
                        disableTransitionOnChange>
                        <RoutineProvider>
                            <ModalProvider>
                                <body className={inter.className}>
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
                                </body>
                            </ModalProvider>
                        </RoutineProvider>
                    </ThemeProvider>
                </ReactQueryProvider>
            </ClerkProvider>
        </html>
    );
}
