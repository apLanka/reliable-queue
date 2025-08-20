import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import Footer from "../components/Footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Reliable Queue - Production-Ready Task Management",
  description: "A comprehensive task queue management library for JavaScript & TypeScript. Handle asynchronous operations with guaranteed execution, intelligent retry logic, and seamless React integration.",
  keywords: ["queue", "task queue", "job queue", "reliable", "retry", "typescript", "react", "async"],
  authors: [{ name: "Pasindu Lanka", url: "https://github.com/apLanka" }],
  creator: "Pasindu Lanka",
  publisher: "Pasindu Lanka",
  openGraph: {
    title: "Reliable Queue - Production-Ready Task Management",
    description: "A comprehensive task queue management library for JavaScript & TypeScript applications",
    url: "https://reliable-queue.dev",
    siteName: "Reliable Queue",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Reliable Queue - Production-Ready Task Management",
    description: "A comprehensive task queue management library for JavaScript & TypeScript applications",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
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
        <div className="min-h-screen flex flex-col">
          <Navigation />
          <main className="flex-grow">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
