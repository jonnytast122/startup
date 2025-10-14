"use client";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ReactQueryProvider from "./react-query-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <title>Anan</title>
        <meta
          name="description"
          content="A tech startup focused on innovation..."
        />
        <link rel="icon" href="/anan_logo.png" type="image/png" />
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
