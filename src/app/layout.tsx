import "~/styles/globals.css";
import { type Metadata } from "next";
import { Geist } from "next/font/google";
import { TRPCReactProvider } from "~/trpc/react";
import AuthProvider from "./_components/auth-provider";
import Navbar from "./_components/navbar";
import Footer from "./_components/footer";
import ScrollToTopButton from "./_components/scroll-to-top-button";

export const metadata: Metadata = {
  title: "CodeCompass",
  description: "Your personalized learning path",
  icons: [{ rel: "icon", url: "/favicon.svg" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${geist.variable} bg-gray-900`}>
      <body className="flex min-h-screen flex-col">
        <AuthProvider>
          <TRPCReactProvider>
            <Navbar />
            <main className="flex-grow">{children}</main>
            <ScrollToTopButton />
            <Footer />
          </TRPCReactProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
