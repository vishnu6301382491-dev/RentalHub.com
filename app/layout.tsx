import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import SiteFooter from "@/components/site-footer";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: 'RentalHub - Rent What You Need, Today',
  description: 'An animated rental marketplace for cars, tools, furniture, electronics, and premium local services.',
  openGraph: {
    title: 'RentalHub - Rent What You Need, Today',
    description:
      'A polished rental marketplace with live location, booking, delivery, installation, and profile-ready accounts.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RentalHub - Rent What You Need, Today',
    description:
      'A polished rental marketplace with live location, booking, delivery, installation, and profile-ready accounts.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <AuthProvider>
            <div className="flex min-h-screen flex-col">
              <main className="flex-1">{children}</main>
              <SiteFooter />
            </div>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
