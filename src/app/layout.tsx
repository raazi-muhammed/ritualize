import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import ReactQueryProvider from "@/providers/ReactQueryProvider";
import { Toaster } from "@/components/ui/toaster";
import { ClerkProvider, SignIn, SignedIn, SignedOut } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Ritualize",
    description: "Routine app",
    manifest: "/manifest.json",
    icons: { apple: "/icon.png" },
};

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <head>
                <meta
                    name="viewport"
                    content="width=device-width, initial-scale=1, maximum-scale=1"
                />
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
                        <body className={inter.className}>
                            <SignedOut>
                                <div className="grid place-items-center h-[100svh]">
                                    <SignIn />
                                </div>
                            </SignedOut>
                            <SignedIn>{children}</SignedIn>
                        </body>
                        <Toaster />
                    </ThemeProvider>
                </ReactQueryProvider>
            </ClerkProvider>
        </html>
    );
}
