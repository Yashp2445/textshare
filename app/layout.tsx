import type { Metadata } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import { SocketProvider } from "@/components/SocketProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { HeaderNav } from "@/components/HeaderNav";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "LiveShare — Real-Time Live Text & File Sharing",
  description: "Instant collaborative live text editor and drag-and-drop file sharing with public and private rooms.",
  keywords: ["text share", "live pastebin", "real-time text sharing", "file sharing", "collaborative editor", "private rooms"],
  openGraph: {
    title: "LiveShare — Real-Time Live Text & File Sharing",
    description: "Instant collaborative live text editor and file sharing with public and private rooms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <body>
        <ThemeProvider>
          <SocketProvider>
            <div className="app">
              <header className="app-header">
                <HeaderNav />
              </header>

              <main className="app-main">
                {children}
              </main>
            </div>
          </SocketProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
