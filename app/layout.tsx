import type { Metadata } from "next";
import { SocketProvider } from "@/components/SocketProvider";
import { ThemeProvider } from "@/components/ThemeProvider";
import { ThemeToggle } from "@/components/ThemeToggle";
import { VantaBackground } from "@/components/VantaBackground";
import { HeaderNav } from "@/components/HeaderNav";
import "./globals.css";

export const metadata: Metadata = {
  title: "LiveShare — Real-Time Text, File Sharing & Scientific Calculator",
  description: "Instant collaborative live text editor, drag-and-drop file sharing, and scientific calculator with private group rooms.",
  keywords: ["text share", "live pastebin", "scientific calculator", "real-time text sharing", "file sharing", "collaborative editor"],
  openGraph: {
    title: "LiveShare — Real-Time Text, File Sharing & Scientific Calculator",
    description: "Instant collaborative live text editor and scientific calculator with private group rooms.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:ital,wght@0,400;0,500;0,600;0,700;1,400&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <ThemeProvider>
          <SocketProvider>
            <VantaBackground />
            <div className="app">
              <header className="app-header">
                <div className="header-inner">
                  <a href="/" className="logo">
                    <div className="logo-icon-box glow-violet">
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M12 20h9" />
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                      </svg>
                    </div>
                    <span className="logo-text">LiveShare</span>
                  </a>

                  {/* Header Segmented Control Navigation */}
                  <HeaderNav />

                  <nav className="nav-actions">
                    <ThemeToggle />
                  </nav>
                </div>
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
