import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "ExamPrep - Master Your Exams",
  description: "Mock tests and PYQs for NEET and Government Exams",
};

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import AuthProvider from "@/components/AuthProvider";

// ... imports

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased font-sans bg-gray-50 dark:bg-black`}
      >
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-1 w-full max-w-[1920px] mx-auto">
              <Sidebar />
              <main className="flex-1 w-full">
                {children}
              </main>
            </div>
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
