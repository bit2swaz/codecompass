import Link from "next/link";
import { api } from "~/trpc/server";

export default async function Header() {
  const session = await api.auth.getSession();

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
              <Link
                href="/api/auth/signout"
                className="rounded-full bg-white/10 px-5 py-2 font-semibold no-underline transition hover:bg-white/20"
              >
                Sign out
              </Link>
            </div>
          ) : (
            <Link
              href="/api/auth/signin"
              className="rounded-full bg-white/10 px-5 py-2 font-semibold no-underline transition hover:bg-white/20"
            >
              Sign in
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
