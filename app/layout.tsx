import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Press_Start_2P, VT323 } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains",
  subsets: ["latin"],
});

const pressStart = Press_Start_2P({
  weight: "400",
  variable: "--font-press",
  subsets: ["latin"],
});

const vt323 = VT323({
  weight: "400",
  variable: "--font-vt",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Heard In Movies",
  description: "A personal catalog of songs discovered through movies.",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "Heard In Movies",
  },
};

export const viewport: Viewport = {
  themeColor: "#11141d", // matches hsl(225, 25%, 8%) roughly
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevents zooming on inputs for mobile app feel
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body
        className={`${inter.variable} ${jetbrainsMono.variable} ${pressStart.variable} ${vt323.variable} min-h-screen flex flex-col bg-background text-foreground`}
      >
        <main className="flex-1 w-full max-w-2xl mx-auto px-4 sm:px-6 md:px-8 pt-4 sm:pt-8 md:pt-12">
          {children}
        </main>
      </body>
    </html>
  );
}
