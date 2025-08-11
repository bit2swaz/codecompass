"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Navbar() {
  const { data: session } = useSession();

  return (
    <header className="sticky top-0 z-50 border-b border-gray-700 bg-gray-900/50 backdrop-blur-sm">
      <nav className="container mx-auto flex items-center justify-between p-4 text-white">
        <div className="flex items-center gap-8">
          <Link href="/" className="text-2xl font-bold text-purple-400">
            CodeCompass
          </Link>
          <div className="hidden items-center gap-6 md:flex">
            <Link
              href="/#features"
              className="text-gray-300 transition hover:text-white"
            >
              Features
            </Link>
            <span
              className="cursor-not-allowed text-gray-500"
              title="Coming Soon"
            >
              Pricing
            </span>
            <span
              className="cursor-not-allowed text-gray-500"
              title="Coming Soon"
            >
              Docs
            </span>
          </div>
        </div>
        <div>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <Link
                href="/dashboard"
                className="hidden rounded-full bg-gray-700 px-5 py-2 font-semibold no-underline transition hover:bg-gray-600 sm:block"
              >
                Dashboard
              </Link>
              <button
                onClick={() => signOut()}
                className="rounded-full bg-white/10 px-5 py-2 font-semibold no-underline transition hover:bg-white/20"
              >
                Sign out
              </button>
            </div>
          ) : (
            <button
              onClick={() => signIn("github")}
              className="rounded-full bg-white/10 px-5 py-2 font-semibold no-underline transition hover:bg-white/20"
            >
              Sign in with GitHub
            </button>
          )}
        </div>
      </nav>
    </header>
  );
}
