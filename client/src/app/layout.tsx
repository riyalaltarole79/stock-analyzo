import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import Navbar from "@/components/layout/Navbar";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StockAnalyzo | Professional Trading Platform",
  description: "Real-time stock analysis and paper trading simulation",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-slate-950 text-slate-100 min-h-screen selection:bg-indigo-500/30`}>
        <AuthProvider>
          <div className="relative flex flex-col min-h-screen">
            <Navbar />
            <main className="flex-grow">
              {children}
            </main>
            <footer className="border-t border-slate-900 py-8 text-center text-slate-500 text-sm">
              &copy; {new Date().getFullYear()} StockAnalyzo. For educational purposes only.
            </footer>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
