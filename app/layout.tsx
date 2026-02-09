import type { Metadata } from "next";
import "./globals.css";
import Link from "next/link";
import { BarChart3 } from "lucide-react";
import { getAppUrl } from "@/lib/env";

export const metadata: Metadata = {
  title: "InvestDone - Investment Forecasting Platform",
  description:
    "Stock analysis and forecasting platform with AI-powered insights",
  metadataBase: getAppUrl(),
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        <nav className="border-b border-gray-200 bg-white">
          <div className="container mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2">
              <BarChart3 className="w-6 h-6 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">
                InvestDone
              </span>
            </Link>
            <div className="flex items-center gap-6">
              <Link
                href="/dashboard"
                className="text-sm text-gray-600 hover:text-gray-900 transition-colors"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </nav>
        <main>{children}</main>
      </body>
    </html>
  );
}
