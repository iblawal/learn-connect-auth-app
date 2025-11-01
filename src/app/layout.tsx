import type { Metadata, Viewport } from "next";
import Navbar from "@/components/Navbar";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import PageWrapper from "@/components/PageWrapper";
import Header from "@/components/Header";
import { AuthProvider } from "@/context/AuthContext"; 

//  Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

//  CRITICAL: Mobile Viewport Configuration
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0EA5E9", // brandSky color
};

//  Metadata
export const metadata: Metadata = {
  title: "Learn & Connect - Student Dashboard",
  description:
    "Connect with coursemates worldwide, prepare for interviews, and enhance your learning journey",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "Learn & Connect",
  },
  formatDetection: {
    telephone: false,
  },
  openGraph: {
    type: "website",
    siteName: "Learn & Connect",
    title: "Learn & Connect - Student Dashboard",
    description: "Connect with coursemates worldwide",
  },
};

//  MAIN LAYOUT COMPONENT
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/*  CRITICAL: PWA and Mobile Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta
          name="apple-mobile-web-app-status-bar-style"
          content="black-translucent"
        />
        <link rel="apple-touch-icon" href="/icon-192.png" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-screen flex from-brandSky via-brandGold/10 to-brandEmerald/20 text-white`}
        suppressHydrationWarning
      >
        {/*  Wrap entire app with AuthProvider */}
        <AuthProvider>
          {/*  Navbar / Sidebar */}
          <Navbar />

          {/*  Main Content */}
          <main className="flex-1 relative">
            <Header />
            <PageWrapper>{children}</PageWrapper>
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
