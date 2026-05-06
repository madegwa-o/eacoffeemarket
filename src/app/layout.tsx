import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Script from "next/script";

import { Header } from "@/components/header";
import { AuthProvider } from "@/components/auth-provider";
import { Analytics } from "@vercel/analytics/next";
import { ThemeProvider } from "@/components/theme-provider";
import { Suspense } from "react";
import MobileBottomNav from "@/components/MobileBottomNav";
import InstallPrompt from "@/components/InstallPrompt";
import AuthErrorHandlerWrapper from "@/components/auth-error-handler-wrapper";
import { NotificationDisplay } from "@/components/notifications/notification-display";
import ChatbotWidget from "@/components/chatbot-widget";

// -----------------
// Font Configuration
// -----------------
const geistSans = Geist({
    variable: "--font-geist-sans",
    subsets: ["latin"],
});

const geistMono = Geist_Mono({
    variable: "--font-geist-mono",
    subsets: ["latin"],
});

// -----------------
// Viewport (Next.js 15+)
// -----------------
export const viewport: Viewport = {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
    themeColor: [
        { media: "(prefers-color-scheme: light)", color: "#FFFFFF" },
        { media: "(prefers-color-scheme: dark)", color: "#000000" }
    ],
    colorScheme: "light dark"
};

// -----------------
// Metadata
// -----------------
export const metadata: Metadata = {
    metadataBase: new URL("https://eacoffeemarket.com"),

    title: {
        default: "East Africa Coffee Market — Exhibitor Directory",
        template: "%s | East Africa Coffee Market",
    },

    description:
        "Discover premium coffee exhibitors, roasters, and suppliers from across East Africa. Connect with specialty coffee vendors and traders.",

    applicationName: "East Africa Coffee Market",
    generator: "Next.js",
    manifest: "/manifest.json",

    keywords: [
        "coffee market",
        "East Africa coffee",
        "coffee exhibitors",
        "coffee suppliers",
        "specialty coffee",
        "coffee roasters",
        "coffee traders",
        "coffee directory",
        "Ethiopia coffee",
        "Kenya coffee",
        "Rwanda coffee",
        "Uganda coffee",
        "fair trade coffee",
        "organic coffee"
    ],

    authors: [
        {
            name: "Oscar Madegwa",
            url: "https://madegwa.pages.dev",
        },
    ],

    creator: "East Africa Coffee Market",
    publisher: "East Africa Coffee Market",

    icons: {
        icon: [
            { url: "/icons/favicon-16x16.png", sizes: "16x16", type: "image/png" },
            { url: "/icons/favicon-32x32.png", sizes: "32x32", type: "image/png" }
        ],
        apple: "/icons/apple-touch-icon.png",
        other: [
            {
                rel: "mask-icon",
                url: "/icons/android-chrome-192x192.png",
                color: "#00C853"
            }
        ],
    },

    openGraph: {
        type: "website",
        url: "https://eacoffeemarket.com",
        title: "East Africa Coffee Market — Exhibitor Directory",
        description:
            "Discover premium coffee exhibitors and specialty suppliers from across East Africa.",
        siteName: "East Africa Coffee Market",
        images: [
            {
                url: "https://eacoffeemarket.com/og-image.png",
                width: 1200,
                height: 630,
                alt: "East Africa Coffee Market — Exhibitor Directory"
            }
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "East Africa Coffee Market",
        description:
            "Connect with premium coffee exhibitors and suppliers from East Africa.",
        images: ["https://eacoffeemarket.com/og-image.png"],
        creator: "@eacoffeemarket"
    },

    category: "business",
    alternates: {
        canonical: "https://eacoffeemarket.com/"
    },

    appleWebApp: {
        capable: true,
        title: "Paysuit",
        statusBarStyle: "black-translucent"
    },

    formatDetection: { telephone: false }
};

// -----------------
// Root Layout
// -----------------
export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
    return (
        <html lang="en">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <AuthProvider>
            <ThemeProvider defaultTheme="system" storageKey="theme-pref">
                <Suspense fallback={null}>
                    <Header />
                    {children}

                    <Analytics />
                </Suspense>

                <NotificationDisplay />
                <AuthErrorHandlerWrapper />
                <InstallPrompt />
                <MobileBottomNav />
                <ChatbotWidget />
            </ThemeProvider>
        </AuthProvider>

        {/* SEO Structured Data */}
        <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
                __html: JSON.stringify({
                    "@context": "https://schema.org",
                    "@type": "LocalBusiness",
                    name: "East Africa Coffee Market",
                    description:
                        "Comprehensive directory of premium coffee exhibitors and suppliers from across East Africa.",
                    url: "https://eacoffeemarket.com",
                    areaServed: ["Ethiopia", "Kenya", "Rwanda", "Uganda", "Tanzania", "Cameroon"],
                    serviceType: "Coffee Trading Directory",
                    image: "https://eacoffeemarket.com/og-image.png",
                    creator: {
                        "@type": "Organization",
                        name: "East Africa Coffee Market",
                        url: "https://eacoffeemarket.com"
                    }
                }),
            }}
        />
        </body>
        </html>
    );
}
