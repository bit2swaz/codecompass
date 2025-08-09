"use client";

import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";

export default function Header() {
  const { data: session } = useSession();

  return (
    <header className="border-b border-gray-700 bg-gray-900">
      <nav className="container mx-auto flex items-center justify-between p-4 text-white">
        <Link href="/" className="text-2xl font-bold text-purple-400">
          CodeCompass
        </Link>
        <div>
          {session?.user ? (
            <div className="flex items-center gap-4">
              <span className="text-gray-300">
                Welcome, {session.user.name}
              </span>
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
