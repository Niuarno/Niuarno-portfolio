import type { Metadata } from "next";
import { Space_Grotesk, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { Navigation } from "@/components/Navigation";
import { PageTransition } from "@/components/PageTransition";
import { VisitorTracker } from "@/components/visitor-tracker";

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Niuarno | Saheduzzaman Nour - Web Developer & CMS Expert",
  description: "Expert web developer specializing in WordPress, Wix, and Shopify. Building modern, scalable, and high-performance websites that convert visitors into customers.",
  keywords: ["Web Developer", "WordPress", "Wix", "Shopify", "CMS Expert", "Frontend Developer", "Niuarno", "Saheduzzaman Nour"],
  authors: [{ name: "Saheduzzaman Nour" }],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Niuarno | Saheduzzaman Nour",
    description: "Expert web developer specializing in WordPress, Wix, and Shopify",
    url: "https://niuarno.com",
    siteName: "Niuarno",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Niuarno | Saheduzzaman Nour",
    description: "Expert web developer specializing in WordPress, Wix, and Shopify",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${spaceGrotesk.variable} ${jetbrainsMono.variable} antialiased bg-background text-foreground font-sans`}
      >
        <VisitorTracker />
        <Navigation />
        <PageTransition>
          {children}
        </PageTransition>
        <Toaster />
      </body>
    </html>
  );
}
