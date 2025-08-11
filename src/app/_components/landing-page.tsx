/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-explicit-any */
import Link from "next/link";

export default function LandingPage({ session }: { session: any }) {
  return (
    <div className="w-full text-white">
      {/* Hero Section */}
      <section className="py-20 text-center md:py-32">
        <div className="container mx-auto">
          <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl">
            Your Code is Smart.
            <br />
            <span className="text-purple-400">
              Your Learning Path Should Be, Too.
            </span>
          </h1>
          <p className="mx-auto mt-6 max-w-3xl text-lg text-gray-300 md:text-xl">
            Stop guessing what to learn next. CodeCompass analyzes your GitHub
            projects to create a personalized curriculum that closes your
            real-world skill gaps.
          </p>
          <div className="mt-8">
            <Link
              href={session?.user ? "/dashboard" : "/api/auth/signin"}
              className="rounded-full bg-purple-600 px-10 py-4 font-semibold no-underline transition hover:bg-purple-500"
            >
              {session?.user ? "Go to Your Dashboard" : "Get Started for Free"}
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="bg-gray-800/50 py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">How It Works</h2>
          <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Feature 1 */}
            <div className="rounded-lg bg-gray-900 p-8">
              <h3 className="text-xl font-semibold text-purple-400">
                1. Connect & Analyze
              </h3>
              <p className="mt-4 text-gray-400">
                Securely connect your GitHub account. CodeCompass performs a
                deep, read-only analysis of your repositories.
              </p>
            </div>
            {/* Feature 2 */}
            <div className="rounded-lg bg-gray-900 p-8">
              <h3 className="text-xl font-semibold text-purple-400">
                2. Identify Gaps
              </h3>
              <p className="mt-4 text-gray-400">
                Our AI engine identifies anti-patterns, security risks, and
                areas where new technologies could improve your code.
              </p>
            </div>
            {/* Feature 3 */}
            <div className="rounded-lg bg-gray-900 p-8">
              <h3 className="text-xl font-semibold text-purple-400">
                3. Learn & Grow
              </h3>
              <p className="mt-4 text-gray-400">
                Receive a hyper-personalized learning path with articles,
                videos, and project-based challenges to fill your knowledge
                gaps.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section (Placeholder) */}
      <section className="py-20">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold">Loved by Developers</h2>
          <div className="mx-auto mt-12 max-w-4xl">
            <div className="rounded-lg bg-gray-900 p-8">
              <p className="text-xl text-gray-400 italic">
                &quot;CodeCompass found three major performance issues in my
                side project that I had completely missed. The learning path it
                generated was spot on.&quot;
              </p>
              <p className="mt-6 font-semibold text-purple-400">
                - Brodie C., Full-Stack Dev
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
