import type { Metadata } from "next";
import { SocketProvider } from "@/components/SocketProvider";
import "./globals.css";

export const metadata: Metadata = {
  title: "TextShare Live",
  description: "Real-time collaborative text and file sharing.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <SocketProvider>
          <div className="app">
            <header className="app-header">
              <div className="header-inner">
                <a href="/" className="logo">
                  <svg
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M12 20h9" />
                    <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                  </svg>
                  <span>LiveShare</span>
                </a>
                <nav>
                  <a href="/group/create" className="btn btn-nav">
                    Create Private Group
                  </a>
                </nav>
              </div>
            </header>

            <main className="app-main">
              {children}
            </main>
          </div>
        </SocketProvider>
      </body>
    </html>
  );
}
