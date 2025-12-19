import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext";
import ReactQueryProvider from "./react-query-provider";

export const metadata = {
  title: "Anan App",
  description: "Smart Attendance, Accurate Payroll - Simplify Your Workforce Management with ANAN",
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.png",
  },
  themeColor: "#8936FF",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <AuthProvider>
          <ReactQueryProvider>
            <main className="relative overflow-hidden">{children}</main>
          </ReactQueryProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
