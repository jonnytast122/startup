import "./globals.css";
import { AuthProvider } from "@/contexts/AuthContext"; // Make sure the path is correct

export const metadata = {
  title: "Anan",
  description:
    "A tech startup focused on innovation, driven by a passionate team committed to creating impactful solutions in the technology space.",
  icons: {
    icon: "https://firebasestorage.googleapis.com/v0/b/anan-image.appspot.com/o/ANAN%20logo%20FA-06.png?alt=media&token=1b1315d9-1e8c-407f-934d-31c35255f377",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <main className="relative overflow-hidden">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
