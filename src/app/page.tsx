import Link from "next/link";
import { api } from "~/trpc/server";

export default async function Home() {
  const session = await api.auth.getSession();

  return (
    <div className="container mx-auto mt-16 flex flex-col items-center justify-center gap-12 px-4 py-16 text-white">
      <h1 className="text-center text-5xl font-extrabold tracking-tight sm:text-[5rem]">
        Your Code is Smart.
        <br />
        <span className="text-purple-400">
          Your Learning Path Should Be, Too.
        </span>
      </h1>
      <p className="max-w-3xl text-center text-2xl text-gray-300">
        Stop guessing what to learn next. CodeCompass analyzes your GitHub
        projects to create a personalized curriculum that closes your real-world
        skill gaps.
      </p>

      {/* This button will now lead to the dashboard */}
      {session?.user && (
        <Link
          href="/dashboard"
          className="rounded-full bg-purple-600 px-10 py-3 font-semibold text-white no-underline transition hover:bg-purple-500"
        >
          Go to Your Dashboard
        </Link>
      )}
    </div>
  );
}
