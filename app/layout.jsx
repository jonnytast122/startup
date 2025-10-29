"use client";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ReactQueryProvider from "./react-query-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Anan App</title>
        <link rel="manifest" href="/manifest.json" />
        <link rel="icon" href="/favicon.png" />
        <meta name="theme-color" content="#8936FF" />
      </head>
      <body>
        <AuthProvider>
          <ReactQueryProvider>
            <main className="relative overflow-hidden">{children}</main>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
