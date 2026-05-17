import { Geist, Geist_Mono } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import Providers from "./providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "DevSaga",
  description: "AI-powered debugging assistant that helps you debug errors and tracks your errors over time, identifies your weak spots, and recommends free resources to help you improve.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <Providers>
        <TooltipProvider>
        {children}
        </TooltipProvider>
        </Providers>
        <SpeedInsights />
      </body>
    </html>
  );
}
