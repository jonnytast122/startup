"use client";
import Head from "next/head";
import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ReactQueryProvider from "./react-query-provider";

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <Head>
        <title>Anan</title>
        <meta
          name="description"
          content="A tech startup focused on innovation..."
        />
        <link
          rel="icon"
          href="https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/ANAN%20logo%20FA-06.png?alt=media&token=1b1315d9-1e8c-407f-934d-31c35255f377"
        />
      </Head>
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
